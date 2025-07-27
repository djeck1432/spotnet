"""
Integration tests for extra deposits functionality.
"""

import asyncio
import logging
from decimal import Decimal
from typing import Any, Dict


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


class TestExtraDeposit:
    """
    Integration tests for extra deposits functionality.
    Tests the ability to add, update, and retrieve extra deposits for positions.
    """

    test_data: Dict[str, Any] = {
        "wallet_id": "0x011F0c180b9EbB2B3F9601c41d65AcA110E48aec0292c778f41Ae286C78Cc374",
        "token_symbol": "ETH",
        "amount": "5",
        "multiplier": 2,
        "extra_deposits": [
            {"token": "USDC", "amount": "1000"},
            {"token": "STRK", "amount": "500"},
            {"token": "ETH", "amount": "2"},
        ],
    }

    def test_add_single_extra_deposit(self) -> None:
        """Test adding a single extra deposit to a position."""
        wallet_id = self.test_data["wallet_id"]
        with with_temp_user(wallet_id):
            # Create initial position
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=self.test_data["token_symbol"],
                amount=self.test_data["amount"],
                multiplier=self.test_data["multiplier"],
            )
            assert position.status == Status.PENDING, "Initial status should be pending"

            # Open position
            current_prices = asyncio.run(DashboardMixin.get_current_prices())
            assert self.test_data["token_symbol"] in current_prices, (
                f"Token {self.test_data['token_symbol']} missing in current prices"
            )
            position_status = position_db.open_position(position.id, current_prices)
            assert position_status == Status.OPENED, (
                "Position should be opened successfully"
            )

            # check extra deposits
            extra_deposits = position_db.get_extra_deposits_data(position.id)
            assert len(extra_deposits) == 0, "Should have no extra deposits"

            # Add extra deposit
            extra_deposit = self.test_data["extra_deposits"][0]
            position_db.add_extra_deposit_to_position(
                position=position,
                token_symbol=extra_deposit["token"],
                amount=extra_deposit["amount"],
            )

            # Verify extra deposit
            deposits = position_db.get_extra_deposits_data(position.id)
            assert len(deposits) == 1, "Should have exactly one extra deposit"
            assert deposits[extra_deposit["token"]] == extra_deposit["amount"], (
                "Extra deposit amount should match"
            )

    def test_add_multiple_extra_deposits(self) -> None:
        """Test adding multiple extra deposits to a position."""
        wallet_id = self.test_data["wallet_id"]
        with with_temp_user(wallet_id):
            # Create initial position
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=self.test_data["token_symbol"],
                amount=self.test_data["amount"],
                multiplier=self.test_data["multiplier"],
            )
            assert position.status == Status.PENDING, "Initial status should be pending"

            # Open position
            current_prices = asyncio.run(DashboardMixin.get_current_prices())
            assert self.test_data["token_symbol"] in current_prices, (
                f"Token {self.test_data['token_symbol']} missing in current prices"
            )
            position_status = position_db.open_position(position.id, current_prices)
            assert position_status == Status.OPENED, (
                "Position should be opened successfully"
            )

            # Add multiple extra deposits
            for deposit in self.test_data["extra_deposits"]:
                position_db.add_extra_deposit_to_position(
                    position=position,
                    token_symbol=deposit["token"],
                    amount=deposit["amount"],
                )

            # Verify all deposits
            deposits = position_db.get_extra_deposits_data(position.id)
            assert len(deposits) == len(self.test_data["extra_deposits"]), (
                "Should have all extra deposits"
            )

            for deposit in self.test_data["extra_deposits"]:
                assert deposit["token"] in deposits, (
                    f"Should have deposit for {deposit['token']}"
                )
                assert deposits[deposit["token"]] == deposit["amount"], (
                    f"Amount mismatch for {deposit['token']}"
                )

    def test_update_existing_extra_deposit(self) -> None:
        """Test updating an existing extra deposit."""
        wallet_id = self.test_data["wallet_id"]
        with with_temp_user(wallet_id):
            # Create position
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=self.test_data["token_symbol"],
                amount=self.test_data["amount"],
                multiplier=self.test_data["multiplier"],
            )

            # Add initial deposit
            initial_deposit = {"token": "USDC", "amount": "1000"}
            position_db.add_extra_deposit_to_position(
                position=position,
                token_symbol=initial_deposit["token"],
                amount=initial_deposit["amount"],
            )

            # Add another deposit for the same token
            additional_deposit = {"token": "USDC", "amount": "500"}
            position_db.add_extra_deposit_to_position(
                position=position,
                token_symbol=additional_deposit["token"],
                amount=additional_deposit["amount"],
            )

            # Verify the deposit was updated correctly
            deposits = position_db.get_extra_deposits_data(position.id)
            expected_amount = str(
                Decimal(initial_deposit["amount"])
                + Decimal(additional_deposit["amount"])
            )
            assert deposits[initial_deposit["token"]] == expected_amount, (
                "Extra deposit should be updated with combined amount"
            )

    def test_get_extra_deposits_by_position_id(self) -> None:
        """Test retrieving extra deposits using position ID."""
        # Create user and position
        wallet_id = self.test_data["wallet_id"]
        with with_temp_user(wallet_id):
            # Create position
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=self.test_data["token_symbol"],
                amount=self.test_data["amount"],
                multiplier=self.test_data["multiplier"],
            )

            # Add multiple deposits
            for deposit in self.test_data["extra_deposits"]:
                position_db.add_extra_deposit_to_position(
                    position=position,
                    token_symbol=deposit["token"],
                    amount=deposit["amount"],
                )

            # Get deposits using position ID
            extra_deposits = position_db.get_extra_deposits_by_position_id(position.id)

            # Verify deposits
            assert len(extra_deposits) == len(self.test_data["extra_deposits"]), (
                "Should retrieve all extra deposits"
            )

            for deposit in extra_deposits:
                matching_test_deposit = next(
                    (
                        d
                        for d in self.test_data["extra_deposits"]
                        if d["token"] == deposit.token_symbol
                    ),
                    None,
                )
                assert matching_test_deposit is not None, (
                    f"Should find matching test deposit for {deposit.token_symbol}"
                )
                assert deposit.amount == matching_test_deposit["amount"], (
                    f"Amount mismatch for {deposit.token_symbol}"
                )
                assert deposit.position_id == position.id, "Position ID should match"
                assert deposit.added_at is not None, "Added timestamp should be set"

    def test_extra_deposit_with_invalid_position(self) -> None:
        """Test adding extra deposit to non-existent position."""
        import uuid

        non_existent_position = type("Position", (), {"id": uuid.uuid4()})()

        # Attempt to add deposit to non-existent position
        try:
            position_db.add_extra_deposit_to_position(
                position=non_existent_position, token_symbol="USDC", amount="1000"
            )
            assert False, "Should raise an exception for non-existent position"
        except Exception:
            assert True, "Should handle non-existent position gracefully"
