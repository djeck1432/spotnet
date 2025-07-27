"""
Module: Position Creation Tests
This module contains integration tests for the creation and management
of user positions within the webapp
Key Components:
- **PositionDBConnector**: Manages database operations for positions.
- **DepositMixin**: Processes transaction data.
- **DashboardMixin**: Retrieves current token prices.
Test Class:
- **PositionCreationTest**: Validates position workflows:
  1. Fetching transaction data.
  2. Creating and verifying positions.
  3. Updating position statuses.
"""

import asyncio
import logging
import pytest
from typing import Dict, Any
from web_app.db.crud import PositionDBConnector, AirDropDBConnector
from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.models import Status
from web_app.test_integration.utils import with_temp_user

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

position_db = PositionDBConnector()
airdrop = AirDropDBConnector()


class TestPositionCreation:
    """
    Integration test for creating and managing positions.
    Steps:
    1. Fetch transaction data using `DepositMixin.get_transaction_data`.
    2. Create a position using `PositionDBConnector`.
    3. Verify the created position's attributes.
    4. Fetch current token prices using `DashboardMixin`.
    5. Update position status and validate changes.
    """

    form_data_1: Dict[str, Any] = {
        "wallet_id": "0x011F0c180b9EbB2B3F9601c41d65AcA110E48aec0292c778f41Ae286C78Cc374",
        "token_symbol": "STRK",
        "amount": "2",
        "multiplier": 1,
        "borrowing_token": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    }

    form_data_2: Dict[str, Any] = {
        "wallet_id": "0x011F0c180b9EbB2B3F9601c41d65AcA110E48aec0292c778f41Ae286C78Cc374",
        "token_symbol": "ETH",
        "amount": "5",
        "multiplier": 1,
        "borrowing_token": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    }

    form_data_3: Dict[str, Any] = {
        "wallet_id": "0x011F0c180b9EbB2B3F9601c41d65AcA110E48aec0292c778f41Ae286C78Cc374",
        "token_symbol": "USDC",
        "amount": "1",
        "multiplier": 1,
        "borrowing_token": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    }

    @pytest.mark.parametrize("form_data", [form_data_1, form_data_2, form_data_3])
    def test_create_position(self, form_data: Dict[str, Any]) -> None:
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

        with with_temp_user(wallet_id):
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=token_symbol,
                amount=amount,
                multiplier=multiplier,
            )
            assert position.status == Status.PENDING, (
                "Position status should be 'pending' upon creation"
            )
            assert position.is_protection is False, (
                "Position should not have protection by default"
            )

            logger.info(
                f"Position {position.id} created successfully with status '{position.status}'."
            )

            # Open position
            current_prices = asyncio.run(DashboardMixin.get_current_prices())
            assert position.token_symbol in current_prices, (
                "Token price missing in current prices"
            )
            position_status = position_db.open_position(position.id, current_prices)
            assert position_status == Status.OPENED, (
                "Position status should be 'opened' after updating"
            )
            logger.info(f"Position {position.id} successfully opened.")
            # Verify position attributes after opening
            position = position_db.get_position_by_id(position.id)
            assert position is not None, "Position not found in database before opening"
            assert position.status == Status.OPENED, (
                "Position status should be 'opened'"
            )
            assert position.start_price == current_prices[token_symbol], (
                "Start price should be the token price"
            )
            assert position.created_at is not None, (
                "Position should have a created_at timestamp"
            )
