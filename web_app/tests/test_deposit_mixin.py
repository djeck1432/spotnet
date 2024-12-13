"""Test cases for DepositMixin"""

from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock, patch
import pytest

from web_app.contract_tools.mixins.deposit import DepositMixin

# Known token addresses and decimals that match what TokenParams would return
TOKEN_ADDRESSES = {
    "STRK": "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    "ETH": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    "USDC": "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
}
TOKEN_DECIMALS = {
    TOKEN_ADDRESSES["STRK"]: 18,
    TOKEN_ADDRESSES["ETH"]: 18,
    TOKEN_ADDRESSES["USDC"]: 6,
}


class TestDepositMixin:
    """
    Test cases for DepositMixin
    """
    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "deposit_token_name, amount, multiplier, wallet_id, borrowing_token",
        [
            (
                "STRK",
                "100_000",
                2,
                "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
                "STRK",
            ),
            (
                "ETH",
                "3333.3",
                4,
                "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
                "USDC",
            ),
        ],
    )
    @patch(
        "web_app.contract_tools.mixins.deposit.TokenParams.get_token_decimals",
        side_effect=lambda addr: TOKEN_DECIMALS[addr],
    )
    @patch(
        "web_app.contract_tools.mixins.deposit.TokenParams.get_token_address",
        side_effect=lambda x: TOKEN_ADDRESSES[x],
    )
    @patch(
        "web_app.contract_tools.mixins.deposit.CLIENT.get_loop_liquidity_data",
        new_callable=AsyncMock,
    )
    async def test_get_transaction_data(
        self,
        mock_get_loop_liquidity_data: AsyncMock,
        mock_get_token_address: MagicMock,
        mock_get_token_decimals: MagicMock,
        deposit_token_name: str,
        amount: str,
        multiplier: int,
        wallet_id: str,
        borrowing_token: str,
    ) -> None:
        expected_transaction_data = {
            "caller": wallet_id,
            "pool_price": "mocked_pool_price",
            "pool_key": "mocked_pool_key",
            "deposit_data": "mocked_deposit_data",
        }

        mock_get_loop_liquidity_data.return_value = expected_transaction_data
        ekubo_contract_mock = MagicMock()

        transaction_data = await DepositMixin.get_transaction_data(
            deposit_token_name,
            amount,
            multiplier,
            wallet_id,
            borrowing_token,
            ekubo_contract_mock,
        )

        mock_get_loop_liquidity_data.assert_called_once_with(
            TOKEN_ADDRESSES[deposit_token_name],
            int(
                Decimal(amount)
                * Decimal(10 ** TOKEN_DECIMALS[TOKEN_ADDRESSES[deposit_token_name]])
            ),
            multiplier,
            wallet_id,
            borrowing_token,
            ekubo_contract_mock,
        )

        assert transaction_data == expected_transaction_data

    @pytest.mark.asyncio
    @pytest.mark.parametrize("supply_token", ["STRK", "ETH", "USDC"])
    @patch(
        "web_app.contract_tools.mixins.deposit.TokenParams.get_token_decimals",
        side_effect=lambda addr: TOKEN_DECIMALS[addr],
    )
    @patch(
        "web_app.contract_tools.mixins.deposit.TokenParams.get_token_address",
        side_effect=lambda x: TOKEN_ADDRESSES[x],
    )
    @patch(
        "web_app.contract_tools.mixins.deposit.CLIENT.get_repay_data",
        new_callable=AsyncMock,
    )
    async def test_get_repay_data(
        self,
        mock_get_repay_data: AsyncMock,
        mock_get_token_address: MagicMock,
        mock_get_token_decimals: MagicMock,
        supply_token: str,
    ) -> None:
        """
        Test cases for DepositMixin.get_repay_data method
        :param mock_get_repay_data: unittest.mock.AsyncMock
        :param mock_get_token_address: unittest.mock.MagicMock
        :param mock_get_token_decimals: unittest.mock.MagicMock
        :param supply_token: str
        """
        # Logic from DepositMixin: if supply_token != USDC -> debt_token = USDC
        # If supply_token == USDC -> debt_token = ETH
        if supply_token == "USDC":
            expected_debt_token = TOKEN_ADDRESSES["ETH"]
        else:
            expected_debt_token = TOKEN_ADDRESSES["USDC"]

        expected_supply_token = TOKEN_ADDRESSES[supply_token]

        expected_repay_data = {
            "supply_token": expected_supply_token,
            "debt_token": expected_debt_token,
            "supply_price": "mocked_supply_price",
            "debt_price": "mocked_debt_price",
            "pool_key": "mocked_pool_key",
        }

        mock_get_repay_data.return_value = {
            "supply_price": "mocked_supply_price",
            "debt_price": "mocked_debt_price",
            "pool_key": "mocked_pool_key",
        }

        ekubo_contract_mock = MagicMock()
        repay_data = await DepositMixin.get_repay_data(
            supply_token, ekubo_contract_mock
        )

        assert repay_data == expected_repay_data
