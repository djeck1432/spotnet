"""
This module handles the blockchain calls.
"""

import asyncio
import logging
import os
import time
from decimal import Decimal
from math import floor
from typing import Any, List

import starknet_py.cairo.felt
import starknet_py.hash.selector
import starknet_py.net.client_models
import starknet_py.net.networks
from starknet_py.contract import Contract
from starknet_py.net.full_node_client import FullNodeClient

from .constants import ZKLEND_MARKET_ADDRESS, TokenParams, MULTIPLIER_POWER

logger = logging.getLogger(__name__)


class RepayDataException(Exception):
    """
    Custom RepayDataException for handling errors while repaying data
    """
    pass


class StarknetClient:
    """
    A client to interact with the Starknet blockchain.
    """

    FEE = 0x20C49BA5E353F80000000000000000
    TICK_SPACING = 1000
    EXTENSION = 0
    SLEEP_TIME = 10

    def __init__(self):
        """
        Initializes the Starknet client with a given node URL.
        """
        node_url = os.getenv("STARKNET_NODE_URL") or "http://51.195.57.196:6060/v0_7"
        if not node_url:
            raise ValueError("STARKNET_NODE_URL environment variable is not set")

        self.client = FullNodeClient(node_url=node_url)

    @staticmethod
    def _convert_address(addr: str) -> int:
        """
        Converts a hexadecimal address string to an integer.

        :param addr: The address as a hexadecimal string.
        :return: The address as an integer.
        """
        return int(addr, base=16)

    async def _func_call(self, addr: int, selector: str, calldata: List[int]) -> Any:
        """
        Internal method to make a contract call on the Starknet blockchain.

        :param addr: The contract address as an integer.
        :param selector: The name of the function to call.
        :param calldata: A list of integers representing the calldata for the function.
        :return: The response from the contract call.
        """
        call = starknet_py.net.client_models.Call(
            to_addr=addr,
            selector=starknet_py.hash.selector.get_selector_from_name(selector),
            calldata=calldata,
        )
        try:
            res = await self.client.call_contract(call)
        except Exception as e:  # Catch and log any errors
            logger.error(f"Error making contract call: {e}")
            time.sleep(self.SLEEP_TIME)
            res = await self.client.call_contract(call)
        return res

    @staticmethod
    def _build_ekubo_pool_key(
        token0: str,
        token1: str,
        fee: int = FEE,
        tick_spacing: int = TICK_SPACING,
        extension=0,
    ) -> dict:
        """
        Get ekubo pool key.
        Return:
            dict: {
                'token0': <token_address>,
                'token1': <token_address>,
                'fee': 170141183460469235273462165868118016,
                'tick_spacing': 1000,
                'extension': 0
            }

        """
        token0, token1 = sorted(map(lambda x: StarknetClient._convert_address(x), (token0, token1)))
        return {
            "token0": token0,
            "token1": token1,
            "fee": fee,
            "tick_spacing": tick_spacing,
            "extension": extension,
        }

    @staticmethod
    async def _get_pool_price(pool_key, is_token1: bool, ekubo_contract: "Contract") -> Decimal:
        """
        Calculate Ekubo pool price.

        :param pool_key: The pool key dictionary.
        :param is_token1: Boolean indicating if the token is token1.
        :param ekubo_contract: The Ekubo contract instance.
        :return: The calculated pool price.
        """
        price_data = await ekubo_contract.functions["get_pool_price"].call(pool_key)
        underlying_token_0_address = TokenParams.add_underlying_address(
            str(hex(pool_key["token0"]))
        )
        underlying_token_1_address = TokenParams.add_underlying_address(
            str(hex(pool_key["token1"]))
        )

        token_0_decimals = TokenParams.get_token_decimals(underlying_token_0_address)
        token_1_decimals = TokenParams.get_token_decimals(underlying_token_1_address)
        price = Decimal(((price_data[0]["sqrt_ratio"] / 2**128) ** 2)) * (
            10 ** abs(token_0_decimals - token_1_decimals)
        )
        return (
            (1 / price) * 10**token_0_decimals
            if is_token1
            else price * 10**token_1_decimals
        )

    async def _get_zklend_reserve(self, token_address: str) -> list[int]:
        """
        Get ZkLend reserve data for a specific token.

        :param token_address: The address of the token.
        :return: A list of reserve data.
        """
        return await self._func_call(
            self._convert_address(ZKLEND_MARKET_ADDRESS),
            "get_reserve_data",
            [self._convert_address(token_address)],
        )

    async def get_available_zklend_reserves(self) -> dict[str, list[int]]:
        """
        Get available ZkLend reserves for all tokens.

        :return: A dictionary with token names as keys and reserve data as values.
        """
        tasks = [
            self._get_zklend_reserve(token.address) for token in TokenParams.tokens()
        ]
        return {
            token.name: reserve
            for token, reserve in zip(
                TokenParams.tokens(), await asyncio.gather(*tasks)
            )
        }

    async def get_z_addresses(self) -> dict[str, tuple[int, int]]:
        """
        Get ZkLend addresses.

        :return: A dictionary with token names as keys and tuples of addresses as values.
        """
        reserves = await self.get_available_zklend_reserves()
        return {token: (reserve[1], reserve[2]) for token, reserve in reserves.items()}

    async def get_zklend_debt(self, user: str, token: str) -> list[int]:
        """
        Get ZkLend debt for a specific user and token.

        :param user: The address of the user.
        :param token: The address of the token.
        :return: A list of debt data.
        """
        return await self._func_call(
            self._convert_address(ZKLEND_MARKET_ADDRESS),
            "get_user_debt_for_token",
            [self._convert_address(user), self._convert_address(token)],
        )

    async def get_balance(
        self, token_addr: str | int, holder_addr: str, decimals: int = None
    ) -> int:
        """
        Fetches the balance of a holder for a specific token.

        :param token_addr: The token contract address in hexadecimal string format.
        :param holder_addr: The address of the holder in hexadecimal string format.
        :param decimals: The number of decimal places to round the balance to. Defaults to None.
        :return: The token balance of the holder as an integer.
        """
        token_address_int = (
            self._convert_address(token_addr)
            if isinstance(token_addr, str)
            else token_addr
        )
        holder_address_int = self._convert_address(holder_addr)
        try:
            res = await self._func_call(
                token_address_int, "balanceOf", [holder_address_int]
            )
        except Exception as exc:
            logger.info(
                f"Failed to get balance for {token_addr} due to an error: {exc}"
            )
            return 0

        if decimals:
            return str(round(res[0] / 10**decimals, 6))
        return str(round(res[0], 6))

    async def get_loop_liquidity_data(
        self,
        deposit_token: str,
        amount: int,
        multiplier: Decimal,
        wallet_id: str,
        borrowing_token: str,
        ekubo_contract: "Contract",
    ) -> dict:
        """
        Get data for Spotnet liquidity looping call.

        :param deposit_token: The address of the deposit token.
        :param amount: The amount to deposit.
        :param multiplier: The multiplier for the deposit.
        :param wallet_id: The wallet ID.
        :param borrowing_token: The address of the borrowing token.
        :param ekubo_contract: The Ekubo contract instance.
        :return: A dictionary with liquidity data.
        """
        # Get pool key
        pool_key = self._build_ekubo_pool_key(deposit_token, borrowing_token)
        # Convert addresses
        deposit_token, borrowing_token = self._convert_address(
            deposit_token
        ), self._convert_address(borrowing_token)

        deposit_data = {
            "token": deposit_token,
            "amount": amount,
            "multiplier": int(multiplier * 10),
            # Moves for one decimal place, from 2.5 to 25
            "borrow_portion_percent": MULTIPLIER_POWER,
        }

        pool_price = floor(
            await self._get_pool_price(pool_key, deposit_token == pool_key["token1"], ekubo_contract)
        )
        return {
            "pool_price": pool_price,
            "pool_key": pool_key,
            "deposit_data": deposit_data,
            "ekubo_limits": {
                "lower": "18446748437148339061",
                "upper": "6277100250585753475930931601400621808602321654880405518632",
            },
            "caller": wallet_id,
        }

    async def get_repay_data(self, deposit_token: str, borrowing_token: str, ekubo_contract: "Contract") -> dict:
        """
        Get data for Spotnet position closing.

        :param deposit_token: The address of the deposit token.
        :param borrowing_token: The address of the borrowing token.
        :param ekubo_contract: The Ekubo contract instance.
        :return: A dictionary with repay data.
        """
        pool_key = self._build_ekubo_pool_key(deposit_token, borrowing_token)
        decimals_sum = TokenParams.get_token_decimals(
            deposit_token
        ) + TokenParams.get_token_decimals(borrowing_token)
        deposit_token, borrowing_token = self._convert_address(
            deposit_token
        ), self._convert_address(borrowing_token)

        is_token1 = deposit_token == pool_key["token1"]
        supply_price = floor(await self._get_pool_price(pool_key, is_token1, ekubo_contract))

        try:
            debt_price = floor(Decimal((1 / supply_price)) * 10**decimals_sum)
        except ZeroDivisionError:
            logger.error(
                f"Error while getting repay data: {deposit_token=}, {borrowing_token=}"
            )
            raise RepayDataException(
                f"Error while getting repay data(supply_price=0): "
                f"{deposit_token=}, {borrowing_token=}"
            )

        return {
            "supply_price": supply_price,
            "debt_price": debt_price,
            "pool_key": pool_key,
            "ekubo_limits": {
                "lower": "18446748437148339061",
                "upper": "6277100250585753475930931601400621808602321654880405518632",
            },
            "borrow_portion_percent": 93,
        }

    async def is_opened_position(self, contract_address: str) -> bool:
        """
        Checks if a position is opened on the Starknet blockchain.

        :param contract_address: The contract address.
        :return: A boolean indicating if the position is opened.
        """
        return await self._func_call(
            addr=self._convert_address(contract_address),
            selector="is_position_open",
            calldata=[],
        )

    async def withdraw_all(self, contract_address: str) -> List[Any]:
        """
        Withdraws all supported tokens from the contract by calling withdraw with amount=0.
        
        :param contract_address: The contract address to withdraw from
        :return: List of responses from withdraw calls
        """
        contract_addr_int = self._convert_address(contract_address)
        tasks = []
        
        for token in TokenParams.tokens():
            token_addr_int = self._convert_address(token.address)
            tasks.append(
                self._func_call(
                    addr=contract_addr_int,
                    selector="withdraw",
                    calldata=[token_addr_int, 0]
                )
            )
        
        return await asyncio.gather(*tasks)


CLIENT = StarknetClient()
