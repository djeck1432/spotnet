"""
Integration test for the PositionClose view.
"""

import asyncio
from datetime import datetime
from typing import Any, Dict

import pytest

from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.crud import AirDropDBConnector, PositionDBConnector, UserDBConnector
from web_app.db.models import Status

user_db = UserDBConnector()
airdrop = AirDropDBConnector()
position_db = PositionDBConnector()


class TestPositionClose:
    """
    Integration test for closing and managing positions.
    Steps:
    1. Create a position using `PositionDBConnector`.
    2. Verify the created position's attributes.
    3. Update position status to 'opened'.
    4. Close the position using `PositionDBConnector`.
    5. Validate the position's final status and attributes.
    """

    form_data_1: Dict[str, Any] = {
        "wallet_id": "0x011F0c180b9EbB2B3F9601c41d65AcA110E48aec0292c778f41Ae286C78Cc374",
        "token_symbol": "STRK",
        "amount": "2",
        "multiplier": 1,
    }

    form_data_2: Dict[str, Any] = {
        "wallet_id": "0xTestWalletETH",
        "token_symbol": "ETH",
        "amount": "5",
        "multiplier": 1,
    }

    form_data_3: Dict[str, Any] = {
        "wallet_id": "0xTestWalletUSDC",
        "token_symbol": "USDC",
        "amount": "1",
        "multiplier": 1,
    }

    @pytest.mark.parametrize("form_data", [form_data_1, form_data_2, form_data_3])
    def test_close_position(self, form_data: Dict[str, Any]) -> None:
        """
        Args:
        form_data (Dict[str, Any]): Position data.
        Returns:
            None
        """
        wallet_id = form_data["wallet_id"]
        token_symbol = form_data["token_symbol"]
        amount = form_data["amount"]
        multiplier = form_data["multiplier"]

        # Check if the user already exists before trying to create
        existing_user = position_db.get_user_by_wallet_id(wallet_id)
        if not existing_user:
            position_db.create_user(wallet_id)

        position = position_db.create_position(
            wallet_id=wallet_id,
            token_symbol=token_symbol,
            amount=amount,
            multiplier=multiplier,
        )

        assert (
            position.status == Status.PENDING
        ), "Position status should be 'pending' upon creation"

        current_prices = asyncio.run(DashboardMixin.get_current_prices())
        assert (
            token_symbol in current_prices
        ), f"Token {token_symbol} missing in current prices"
        position.start_price = current_prices[token_symbol]
        position.created_at = datetime.utcnow()

        position_status = position_db.open_position(position.id, current_prices)
        print(f"Position created: {position_status}")
        assert (
            position_status == Status.OPENED
        ), "Position status should be 'opened' after updating"

        print(
            f"Position {position.id} successfully opened with status '{position.status}'."
        )

        close_result = position_db.close_position(position.id)
        assert close_result, "Close operation should succeed."

        position = position_db.get_position_by_id(position.id)
        assert (
            position.status == Status.CLOSED
        ), "Position status should be 'closed' after close operation"

        # Clean up - delete the position and user
        user = position_db.get_user_by_wallet_id(wallet_id)
        airdrop.delete_all_users_airdrop(user.id)
        position_db.delete_position(position)
        if not position_db.get_positions_by_wallet_id(wallet_id, 0, 1):
            position_db.delete_user_by_wallet_id(wallet_id)
