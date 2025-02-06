"""
Integration test for position liquidation functionality.
"""

import asyncio
import logging
from datetime import datetime
from typing import Any, Dict

import pytest

from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.crud import AirDropDBConnector, PositionDBConnector, UserDBConnector
from web_app.db.models import Status
from web_app.test_integration.utils import with_temp_user

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

user_db = UserDBConnector()
airdrop = AirDropDBConnector()
position_db = PositionDBConnector()


class TestPositionLiquidation:
    """
    Integration test for liquidating positions.
    Steps:
    1. Create a position using `PositionDBConnector`.
    2. Open the position and verify its initial state.
    3. Liquidate the position.
    4. Verify liquidation status and attributes.
    5. Test retrieving liquidated positions.
    """

    test_positions: list[Dict[str, Any]] = [
        {
            "wallet_id": "0x011F0c180b9EbB2B3F9601c41d65AcA110E48aec0292c778f41Ae286C78Cc374",
            "token_symbol": "STRK",
            "amount": "2",
            "multiplier": 1,
        },
        {
            "wallet_id": "0xTestWalletETH",
            "token_symbol": "ETH",
            "amount": "5",
            "multiplier": 2,
        },
        {
            "wallet_id": "0xTestWalletUSDC",
            "token_symbol": "USDC",
            "amount": "1000",
            "multiplier": 3,
        },
    ]

    @pytest.mark.parametrize("position_data", test_positions)
    def test_position_liquidation(self, position_data: Dict[str, Any]) -> None:
        """
        Test the complete lifecycle of a position liquidation.

        Args:
            position_data (Dict[str, Any]): Position data for testing.
        """
        wallet_id = position_data["wallet_id"]
        token_symbol = position_data["token_symbol"]
        amount = position_data["amount"]
        multiplier = position_data["multiplier"]

        with with_temp_user(wallet_id) as user:
            # Create and verify initial position
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=token_symbol,
                amount=amount,
                multiplier=multiplier,
            )

            assert position is not None, "Position should be created successfully"
            assert position.status == Status.PENDING, "Initial status should be pending"
            assert not position.is_liquidated, "Position should not be liquidated initially"
            assert (
                position.liquidation_bonus == 0.0
            ), "Initial liquidation bonus should be 0"
            assert (
                position.datetime_liquidation is None
            ), "Liquidation datetime should be None initially"

            # Open position
            current_prices = asyncio.run(DashboardMixin.get_current_prices())
            assert (
                token_symbol in current_prices
            ), f"Token {token_symbol} missing in current prices"
            position_status = position_db.open_position(position.id, current_prices)
            assert (
                position_status == Status.OPENED
            ), "Position should be opened successfully"

            # Test liquidation
            liquidation_result = position_db.liquidate_position(position.id)
            assert liquidation_result is True, "Liquidation should succeed"

            # Verify liquidated position
            liquidated_position = position_db.get_position_by_id(position.id)
            # assert (
            #     liquidated_position.status == Status.CLOSED
            # ), "Position should be closed after liquidation"
            assert (
                liquidated_position is not None
            ), "Should be able to retrieve liquidated position"
            assert (
                liquidated_position.is_liquidated is True
            ), "Position should be marked as liquidated"
            assert (
                liquidated_position.datetime_liquidation is not None
            ), "Liquidation datetime should be set"

            # Test retrieving all liquidated positions
            all_liquidated = position_db.get_all_liquidated_positions()
            assert len(all_liquidated) > 0, "Should have at least one liquidated position"
            assert any(
                pos["token_symbol"] == token_symbol and pos["amount"] == amount
                for pos in all_liquidated
            ), "Liquidated position should be in the list"


    def test_liquidate_nonexistent_position(self) -> None:
        """Test attempting to liquidate a non-existent position."""
        import uuid

        non_existent_id = uuid.uuid4()
        result = position_db.liquidate_position(non_existent_id)
        assert result is False, "Liquidating non-existent position should return False"
