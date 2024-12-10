"""Test cases for DepositMixin"""

from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from web_app.contract_tools.mixins.deposit import DepositMixin


class TestDepositMixin:
    """
    Test cases for web_app.contract_tools.mixins.deposit.DepositMixin class
    """

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "deposit_token, amount, multiplier, wallet_id, borrowing_token",
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
        target="web_app.contract_tools.mixins.deposit.CLIENT.get_loop_liquidity_data",
        new_callable=AsyncMock,
    )
    @patch("web_app.contract_tools.mixins.deposit.TokenParams.get_token_address")
    async def test_get_transaction_data(
        self,
        deposit_token: str,
        amount: str,
        multiplier: int,
        wallet_id: str,
        borrowing_token: str,
        mock_get_loop_liquidity_data: AsyncMock,
        mock_get_token_address: MagicMock,
    ) -> None:
        """
        Tests cases for DepositMixin.get_transaction_data method
        :param mock_get_loop_liquidity_data: unittest.mock.AsyncMock
        :param deposit_token: Deposit token
        :param amount: Amount to deposit
        :param multiplier: Multiplier
        :param wallet_id: Wallet ID
        :param borrowing_token: Borrowing token
        :return: None
        """

        expected_transaction_data = {
            "caller": wallet_id,
            "pool_price": "mocked_pool_price",
            "pool_key": "mocked_pool_key",
            "deposit_data": "mocked_deposit_data",
        }

        mock_get_loop_liquidity_data.return_value = expected_transaction_data

        transaction_data = await DepositMixin.get_transaction_data(
            deposit_token, amount, multiplier, wallet_id, borrowing_token
        )

        mock_get_loop_liquidity_data.assert_called_once_with(
            deposit_token,
            int(Decimal(amount) * Decimal(10**18)),
            multiplier,
            wallet_id,
            borrowing_token,
        )

        assert transaction_data == expected_transaction_data

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "supply_token",
        ["STRK", "ETH", "USDC", None, 3.14, {}],
    )
    @patch(
        target="web_app.contract_tools.mixins.deposit.CLIENT.get_repay_data",
        new_callable=AsyncMock,
    )
    async def test_get_repay_data(
        self,
        mock_get_repay_data: AsyncMock,
        supply_token: str,
    ) -> None:
        """
        Test cases for DepositMixin.get_repay_data method
        :param mock_get_repay_data: unittest.mock.AsyncMock
        :param supply_token: Deposit token
        :return: None
        """
        expected_repay_data = {
            "supply_token": supply_token,
            "debt_token": "USDC",
            "supply_price": "mocked_supply_price",
            "debt_price": "mocked_debt_price",
            "pool_key": "mocked_pool_key",
        }

        mock_get_repay_data.return_value = {
            "supply_price": expected_repay_data["supply_price"],
            "debt_price": expected_repay_data["debt_price"],
            "pool_key": expected_repay_data["pool_key"],
        }

        repay_data = await DepositMixin.get_repay_data(supply_token)

        assert repay_data == expected_repay_data
