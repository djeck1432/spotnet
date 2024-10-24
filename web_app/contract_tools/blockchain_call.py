import logging
import os
import time
from math import floor
from typing import Any, List

import starknet_py.cairo.felt
import starknet_py.hash.selector
import starknet_py.net.client_models
import starknet_py.net.networks
from starknet_py.contract import Contract
from starknet_py.net.full_node_client import FullNodeClient

from .constants import EKUBO_MAINNET_ADDRESS, TokenParams

logger = logging.getLogger(__name__)


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
        node_url = os.getenv("STARKNET_NODE_URL")
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
        return {
            "token0": token0,
            "token1": token1,
            "fee": fee,
            "tick_spacing": tick_spacing,
            "extension": extension,
        }

    async def _get_pool_price(self, pool_key, is_token1: bool):
        """Calculate Ekubo pool price"""

        ekubo_contract = await Contract.from_address(
            EKUBO_MAINNET_ADDRESS, provider=self.client
        )
        price_data = await ekubo_contract.functions["get_pool_price"].call(pool_key)

        underlying_token_0_address = TokenParams.add_underlying_address(
            str(hex(pool_key["token0"]))
        )
        underlying_token_1_address = TokenParams.add_underlying_address(
            str(hex(pool_key["token1"]))
        )

        token_0_decimals = TokenParams.get_token_decimals(underlying_token_0_address)
        token_1_decimals = TokenParams.get_token_decimals(underlying_token_1_address)

        price = ((price_data[0]["sqrt_ratio"] / 2**128) ** 2) * (
            10 ** abs(token_0_decimals - token_1_decimals)
        )
        return (
            (1 / price) * 10**token_0_decimals
            if is_token1
            else price * 10**token_1_decimals
        )

    async def get_balance(
        self, token_addr: str, holder_addr: str, decimals: int = None
    ) -> int:
        """
        Fetches the balance of a holder for a specific token.

        :param token_addr: The token contract address in hexadecimal string format.
        :param holder_addr: The address of the holder in hexadecimal string format.
        :param decimals: The number of decimal places to round the balance to. Defaults to None.
        :return: The token balance of the holder as an integer.
        """
        token_address_int = self._convert_address(token_addr)
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
        multiplier: int,
        wallet_id: str,
        borrowing_token: str,
    ) -> dict:
        """
        Get data for Spotnet liquidity looping call.

        """
        # Get pool key
        pool_key = self._build_ekubo_pool_key(deposit_token, borrowing_token)
        # Convert addresses
        deposit_token, borrowing_token = self._convert_address(
            deposit_token
        ), self._convert_address(borrowing_token)
        # Set pool key
        pool_key["token0"], pool_key["token1"] = deposit_token, borrowing_token
        # Set wallet id
        wallet_id = self._convert_address(wallet_id)
        deposit_data = {
            "token": deposit_token,
            "amount": amount,
            "multiplier": multiplier,
        }

        pool_price = floor(
            await self._get_pool_price(pool_key, deposit_token == pool_key["token1"])
        )
        return {
            "caller": wallet_id,
            "pool_price": pool_price,
            "pool_key": pool_key,
            "deposit_data": deposit_data,
        }

    async def get_repay_data(self, deposit_token: str, borrowing_token: str) -> dict:
        """Get data for Spotnet position closing."""
        pool_key = self._build_ekubo_pool_key(deposit_token, borrowing_token)
        decimals_sum = TokenParams.get_token_decimals(
            deposit_token
        ) + TokenParams.get_token_decimals(borrowing_token)
        deposit_token, borrowing_token = self._convert_address(
            deposit_token
        ), self._convert_address(borrowing_token)

        pool_key["token0"], pool_key["token1"] = deposit_token, borrowing_token
        is_token1 = deposit_token == pool_key["token1"]
        supply_price = floor(await self._get_pool_price(pool_key, is_token1))

        try:
            debt_price = floor((1 / supply_price) * 10**decimals_sum)
        except ZeroDivisionError:
            logger.error(
                f"Error while getting repay data: {deposit_token=}, {borrowing_token=}"
            )
            return {}

        return {
            "supply_price": supply_price,
            "debt_price": debt_price,
            "pool_key": pool_key,
        }
