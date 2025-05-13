"""Test cases for StarknetClient"""

from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest
from starknet_py.contract import Contract
from starknet_py.net.full_node_client import FullNodeClient

from web_app.contract_tools.blockchain_call import RepayDataException, StarknetClient
from web_app.contract_tools.constants import TokenParams

CLIENT = StarknetClient()


class TestStarknetClient:
    """
    Test cases for web_app.contract_tools.blockchain_call.StarknetClient class
    """

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "addr, expected_addr",
        [
            ("0x0", 0),
            ("0x1", 1),
            ("0x10", 16),
            ("0xABCDEF", 11259375),
            ("0xFFFFFFFF", 4294967295),
            ("0x100000000", 4294967296),
            ("0x0000000A", 10),
        ],
    )
    async def test__convert_address(self, addr: str, expected_addr: int) -> None:
        """
        Test cases for StarknetClient._convert_address static method
        :param addr: str
        :param expected_addr: int
        :return: None
        """
        assert CLIENT._convert_address(addr) == expected_addr

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "token0, token1",
        [
            (TokenParams.STRK.address, TokenParams.STRK.address),
            (TokenParams.ETH.address, TokenParams.ETH.address),
            (TokenParams.USDC.address, TokenParams.USDC.address),
            (TokenParams.STRK.address, TokenParams.ETH.address),
            (TokenParams.ETH.address, TokenParams.USDC.address),
        ],
    )
    async def test__build_ekubo_pool_key(self, token0: str, token1: str) -> None:
        """
        Test cases for StarknetClient._build_ekubo_pool_key static method
        :param token0: str
        :param token1: str
        :return: None
        """
        token0, token1 = str(token0), str(token1)
        expected_data = {
            "token0": int(token0, base=16),
            "token1": int(token1, base=16),
            "fee": CLIENT.FEE,
            "tick_spacing": CLIENT.TICK_SPACING,
            "extension": 0,
        }
        assert CLIENT._build_ekubo_pool_key(token0, token1) == expected_data

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "addr, selector, calldata",
        [
            (0, "testCallback", [0]),
            (1, "djeck", list(range(10))),
            (3.13, "", []),
        ],
    )
    @patch.object(FullNodeClient, "call_contract", new_callable=AsyncMock)
    async def test__func_call(
        self,
        mock_client_call_contract: AsyncMock,
        addr: int,
        selector: str,
        calldata: list[int],
    ) -> None:
        """
        Test cases for StarknetClient._func_call method
        :param mock_client_call_contract: unittest.mock.AsyncMock
        :param addr: int
        :param selector: str
        :param calldata: list[int]
        :return: None
        """
        expected_response = {
            "addr": addr,
            "selector": selector,
            "calldata": calldata,
        }
        mock_client_call_contract.return_value = expected_response

        response = await CLIENT._func_call(addr, selector, calldata)

        mock_client_call_contract.assert_called_once()
        assert response == expected_response

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "token0, token1, is_token1",
        [
            (
                0x04718F5A0FC34CC1AF16A1CDEE98FFB20C31F5CD61D6AB07201858F4287C938D,
                0x04718F5A0FC34CC1AF16A1CDEE98FFB20C31F5CD61D6AB07201858F4287C938D,
                True,
            ),
            (
                0x049D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7,
                0x049D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7,
                False,
            ),
            (
                0x053C91253BC9682C04929CA02ED00B3E423F6710D2EE7E0D5EBB06F3ECF368A8,
                0x053C91253BC9682C04929CA02ED00B3E423F6710D2EE7E0D5EBB06F3ECF368A8,
                True,
            ),
            (
                0x04718F5A0FC34CC1AF16A1CDEE98FFB20C31F5CD61D6AB07201858F4287C938D,
                0x049D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7,
                False,
            ),
            (
                0x049D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7,
                0x053C91253BC9682C04929CA02ED00B3E423F6710D2EE7E0D5EBB06F3ECF368A8,
                True,
            ),
        ],
    )
    @patch.object(Contract, "from_address", new_callable=AsyncMock)
    async def test__get_pool_price(
        self,
        mock_contract_from_address: AsyncMock,
        token0: int,
        token1: int,
        is_token1: bool,
    ) -> None:
        """
        Test cases for StarknetClient._get_pool_price method
        :param mock_contract_from_address: unittests.mock.AsyncMock
        :param token0: int
        :param token1: int
        :param is_token1: bool
        :return: None
        """
        pool_key = {
            "token0": token0,
            "token1": token1,
            "fee": CLIENT.FEE,
            "tick_spacing": CLIENT.TICK_SPACING,
            "extension": 0,
        }

        sqrt_ratio = sum([ord(char) for char in str(token0) + str(token1)])

        mock_contract = AsyncMock()
        mock_contract.functions["get_pool_price"].call = AsyncMock(
            return_value=[
                {
                    "sqrt_ratio": sqrt_ratio,
                }
            ],
        )

        mock_contract_from_address.return_value = mock_contract

        pool_price = await CLIENT._get_pool_price(pool_key, is_token1, mock_contract)

        assert pool_price
        assert isinstance(pool_price, Decimal)

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "token_addr, holder_addr, decimals",
        [
            (
                TokenParams.get_token_address("STRK"),
                TokenParams.get_token_address("STRK"),
                18,
            ),
            (
                TokenParams.get_token_address("ETH"),
                TokenParams.get_token_address("ETH"),
                18,
            ),
            (
                TokenParams.get_token_address("USDC"),
                TokenParams.get_token_address("USDC"),
                6,
            ),
            (
                TokenParams.get_token_address("STRK"),
                TokenParams.get_token_address("ETH"),
                18,
            ),
            (
                TokenParams.get_token_address("ETH"),
                TokenParams.get_token_address("USDC"),
                None,
            ),
        ],
    )
    @patch.object(FullNodeClient, "call_contract", new_callable=AsyncMock)
    async def test_get_balance(
        self,
        mock_client_call_contract: AsyncMock,
        token_addr: str,
        holder_addr: str,
        decimals: int | None,
    ) -> None:
        """
        Test cases for StarknetClient.get_balance method
        :param mock_client_call_contract: unittest.mock.AsyncMock
        :param token_addr: str
        :param holder_addr: str
        :param decimals: int | None
        :return: None
        """
        contract_return_value = [int(str(token_addr)[:10], base=16)]
        mock_client_call_contract.return_value = contract_return_value

        balance = await CLIENT.get_balance(token_addr, holder_addr, decimals)

        assert balance
        assert isinstance(balance, str)

        if decimals:
            assert balance == str(round(contract_return_value[0] / 10**decimals, 6))
        else:
            assert balance == str(round(contract_return_value[0], 6))

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "deposit_token_addr, amount, multiplier, wallet_id, borrowing_token_addr",
        [
            (
                TokenParams.get_token_address("STRK"),
                "100_000",
                2,
                "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
                TokenParams.get_token_address("STRK"),
            ),
            (
                TokenParams.get_token_address("USDC"),
                "3333.3",
                4,
                "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
                TokenParams.get_token_address("ETH"),
            ),
        ],
    )
    @patch.object(Contract, "from_address", new_callable=AsyncMock)
    async def test_get_loop_liquidity_data(
        self,
        mock_contract_from_address: AsyncMock,
        deposit_token_addr: str,
        amount: int,
        multiplier: int,
        wallet_id: str,
        borrowing_token_addr: str,
    ) -> None:
        """
        Test cases for StarknetClient.get_loop_liquidity_data method
        :param mock_contract_from_address: unittest.mock.AsyncMock
        :param deposit_token_addr: str
        :param amount: int
        :param multiplier: int
        :param wallet_id: str
        :param borrowing_token_addr:str
        :return: None
        """
        sqrt_ratio = sum(
            [ord(char) for char in deposit_token_addr + borrowing_token_addr]
        )

        mock_contract = AsyncMock()
        mock_contract.functions["get_pool_price"].call = AsyncMock(
            return_value=[
                {
                    "sqrt_ratio": Decimal(sqrt_ratio),
                }
            ],
        )
        mock_contract_from_address.return_value = mock_contract

        liquidity_data = await CLIENT.get_loop_liquidity_data(
            deposit_token=deposit_token_addr,
            amount=amount,
            multiplier=multiplier,
            wallet_id=wallet_id,
            borrowing_token=borrowing_token_addr,
            ekubo_contract=mock_contract,
        )

        assert liquidity_data
        assert isinstance(liquidity_data, dict)
        assert isinstance(liquidity_data["pool_price"], int)
        assert int(liquidity_data["caller"], base=16) == CLIENT._convert_address(
            wallet_id
        )

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "deposit_token_addr, borrowing_token_addr",
        [
            (
                TokenParams.get_token_address("STRK"),
                TokenParams.get_token_address("STRK"),
            ),
            (
                TokenParams.get_token_address("ETH"),
                TokenParams.get_token_address("ETH"),
            ),
            (
                TokenParams.get_token_address("USDC"),
                TokenParams.get_token_address("USDC"),
            ),
            (
                TokenParams.get_token_address("STRK"),
                TokenParams.get_token_address("ETH"),
            ),
            (
                TokenParams.get_token_address("ETH"),
                TokenParams.get_token_address("USDC"),
            ),
        ],
    )
    @patch.object(Contract, "from_address", new_callable=AsyncMock)
    async def test_get_repay_data(
        self,
        mock_contract_from_address: AsyncMock,
        deposit_token_addr: str,
        borrowing_token_addr: str,
    ) -> None:
        """
        Test cases for StarknetClient.get_repay_data method
        :param mock_contract_from_address: unittest.mock.AsyncMock
        :param deposit_token_addr: str
        :param borrowing_token_addr: str
        :return: None
        """
        sqrt_ratio = sum(
            [ord(char) for char in deposit_token_addr + borrowing_token_addr]
        )

        mock_contract = AsyncMock()
        mock_contract.functions["get_pool_price"].call = AsyncMock(
            return_value=[
                {
                    "sqrt_ratio": sqrt_ratio,
                }
            ],
        )
        mock_contract_from_address.return_value = mock_contract

        try:
            repay_data = await CLIENT.get_repay_data(
                deposit_token_addr, borrowing_token_addr, mock_contract
            )
        except RepayDataException:
            assert RepayDataException.args
        else:

            assert isinstance(repay_data, dict)
            assert {"supply_price", "debt_price", "pool_key"}.issubset(
                repay_data
            ) or not len(repay_data.keys())
