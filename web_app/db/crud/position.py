"""
This module contains the position database configuration.
"""

import logging
import uuid
from datetime import datetime
from decimal import Decimal
from typing import TypeVar

from sqlalchemy import Numeric, cast, func
from sqlalchemy.exc import SQLAlchemyError

from .user import UserDBConnector
from web_app.db.models import AirDrop, Base, Position, Status, User

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class PositionDBConnector(UserDBConnector):
    """
    Provides database connection and operations management for the Position model.
    """

    START_PRICE = 0.0

    @staticmethod
    def _position_to_dict(position: Position) -> dict:
        """
        Converts a Position object to a dictionary.
        :param position: Position instance
        :return: dict
        """
        return {
            "id": str(position.id),
            "user_id": str(position.user_id),
            "token_symbol": position.token_symbol,
            "amount": position.amount,
            "multiplier": position.multiplier,
            "created_at": (
                position.created_at.isoformat() if position.created_at else None
            ),
            "start_price": position.start_price,
            "status": position.status,
        }

    def _get_user_by_wallet_id(self, wallet_id: str) -> User | None:
        """
        Retrieves a user by their wallet ID.
        :param wallet_id: str
        :return: User | None
        """
        return self.get_user_by_wallet_id(wallet_id)

    def get_positions_by_wallet_id(self, wallet_id: str) -> list:
        """
        Retrieves all positions for a user by their wallet ID
        and returns them as a list of dictionaries.
        :param wallet_id: str
        :return: list of dict
        """
        with self.Session() as db:
            user = self._get_user_by_wallet_id(wallet_id)
            if not user:
                return []

            try:
                positions = (
                    db.query(Position)
                    .filter(
                        Position.user_id == user.id,
                        Position.status == Status.OPENED.value,
                    )
                    .all()
                )

                # Convert positions to a list of dictionaries
                positions_dict = [
                    self._position_to_dict(position) for position in positions
                ]
                return positions_dict

            except SQLAlchemyError as e:
                logger.error(f"Failed to retrieve positions: {str(e)}")
                return []

    def has_opened_position(self, wallet_id: str) -> bool:
        """
        Checks if a user has any opened positions.
        :param wallet_id: str
        :return: bool
        """
        with self.Session() as db:
            user = self._get_user_by_wallet_id(wallet_id)
            if not user:
                return False

            try:
                position_exists = db.query(
                    db.query(Position)
                    .filter(
                        Position.user_id == user.id,
                        Position.status == Status.OPENED.value,
                    )
                    .exists()
                ).scalar()
                return position_exists

            except SQLAlchemyError as e:
                logger.error(f"Failed to check for opened positions: {str(e)}")
                return False

    def create_position(
        self, wallet_id: str, token_symbol: str, amount: str, multiplier: int
    ) -> Position:
        """
        Creates a new position in the database if it does not already exist for the wallet.
        If a position with status 'pending' exists, update its values.
        :param wallet_id: str
        :param token_symbol: str
        :param amount: str
        :param multiplier: int
        :return: Position
        """
        user = self._get_user_by_wallet_id(wallet_id)
        if not user:
            logger.error(f"User with wallet ID {wallet_id} not found")
            return None

        # Check if a position with status 'pending' already exists for this user
        with self.Session() as session:
            existing_position = (
                session.query(Position)
                .filter(
                    Position.user_id == user.id, Position.status == Status.PENDING.value
                )
                .one_or_none()
            )

            # If a pending position exists, update its values
            if existing_position:
                existing_position.token_symbol = token_symbol
                existing_position.amount = amount
                existing_position.multiplier = multiplier
                existing_position.start_price = PositionDBConnector.START_PRICE
                session.commit()  # Commit the changes to the database
                session.refresh(existing_position)  # Refresh to get updated values
                return existing_position

            # Create a new position since none with 'pending' status exists
            position = Position(
                user_id=user.id,
                token_symbol=token_symbol,
                amount=amount,
                multiplier=multiplier,
                status=Status.PENDING.value,  # Set status as 'pending' by default
                start_price=PositionDBConnector.START_PRICE,
            )

            # Write the new position to the database
            position = self.write_to_db(position)
            return position

    def get_position_id_by_wallet_id(self, wallet_id: str) -> str | None:
        """
        Retrieves the position ID by the wallet ID.
        :param wallet_id: wallet ID
        :return: Position ID
        """
        position = self.get_positions_by_wallet_id(wallet_id)
        if position:
            return position[0]["id"]
        return None

    def update_position(self, position: Position, amount: str, multiplier: int) -> None:
        """
        Updates a position in the database.
        :param position: Position
        :param amount: str
        :param multiplier: int
        :return: None
        """
        position.amount = amount
        position.multiplier = multiplier
        self.write_to_db(position)

    def delete_position(self, position: Position) -> None:
        """
        Deletes a position from the database.
        :param position: Position
        :return: None
        """
        self.delete_object_by_id(Position, position.id)

    def close_position(self, position_id: uuid) -> Position | None:
        """
        Retrieves a position by its contract address.
        :param position_id: str
        :return: Position | None
        """
        position = self.get_object(Position, position_id)
        if position:
            position.status = Status.CLOSED.value
            self.write_to_db(position)
        return position.status

    def open_position(self, position_id: uuid.UUID, current_prices: dict) -> str | None:
        """
        Opens a position by updating its status and creating an AirDrop claim.
        :param position_id: uuid.UUID
        :param current_prices: dict
        :return: str | None
        """
        position = self.get_object(Position, position_id)
        if position:
            position.status = Status.OPENED.value
            self.write_to_db(position)
            self.create_empty_claim(position.user_id)
            self.save_current_price(position, current_prices)
            return position.status
        else:
            logger.error(f"Position with ID {position_id} not found")
            return None

    def get_repay_data(self, wallet_id: str) -> tuple:
        """
        Retrieves the repay data for a user.
        :param wallet_id:
        :return:
        """
        with self.Session() as db:
            result = (
                db.query(
                    User.contract_address, Position.id, Position.token_symbol
                )
                .join(Position, Position.user_id == User.id)
                .filter(User.wallet_id == wallet_id)
                .first()
            )

            if not result:
                return None, None, None

            return result

    def get_total_amounts_for_open_positions(self) -> dict[str, Decimal]:
        """
        Calculates the amounts for all positions where status is 'OPENED',
        grouped by token symbol.

        :return: Dictionary of total amounts for each token in opened positions
        """
        with self.Session() as db:
            try:
                # Group by token symbol and sum amounts
                token_amounts = (
                    db.query(
                        Position.token_symbol,
                        func.sum(cast(Position.amount, Numeric)).label("total_amount"),
                    )
                    .filter(Position.status != Status.PENDING.value)
                    .group_by(Position.token_symbol)
                    .all()
                )
                # Convert to dictionary
                return {token: Decimal(str(amount)) for token, amount in token_amounts}

            except SQLAlchemyError as e:
                logger.error(f"Error calculating amounts for open positions: {e}")
                return {}

    def save_current_price(self, position: Position, price_dict: dict) -> None:
        """
        Saves current prices into db.
        :return: None
        """
        start_price = price_dict.get(position.token_symbol)
        try:
            position.start_price = start_price
            self.write_to_db(position)
        except SQLAlchemyError as e:
            logger.error(f"Error while saving current_price for position: {e}")

    def save_transaction(
        self, 
        position_id: uuid.UUID, 
        status: str, 
        transaction_hash: str
    ) -> bool:
        """
        Creates a new transaction record associated with a position.
        
        Args:
            position_id: UUID of the position
            status: Transaction status (opened/closed)
            transaction_hash: Blockchain transaction hash
            
        Returns:
            Transaction object if successful, None if failed
        """
        try:
            transaction = Transaction(
                position_id=position_id,
                status=status,
                transaction_hash=transaction_hash
            )
            return self.write_to_db(transaction)
        except SQLAlchemyError as e:
            logger.error(f"Failed to save transaction: {str(e)}")
            return None

    def liquidate_position(self, position_id: int) -> bool:
        """
        Marks a position as liquidated by setting `is_liquidated` to True
        and updating `datetime_liquidation` to the current timestamp.

        :param position_id: ID of the position to be liquidated.
        :return: True if the update was successful, False otherwise.
        """
        with self.Session() as db:
            try:
                # Fetch the position by ID
                position = db.query(Position).filter(Position.id == position_id).first()

                if not position:
                    logger.warning(f"Position with ID {position_id} not found.")
                    return False

                position.is_liquidated = True
                position.datetime_liquidation = datetime.now()

                self.write_to_db(position)
                logger.info(f"Position {position_id} successfully liquidated.")
                return True

            except SQLAlchemyError as e:
                logger.error(f"Error liquidating position {position_id}: {str(e)}")
                db.rollback()
                return False

    def get_all_liquidated_positions(self) -> list[dict]:
        """
        Retrieves all positions where `is_liquidated` is True.

        :return: A list of dictionaries containing the liquidated positions.
        """
        with self.Session() as db:
            try:
                liquidated_positions = (
                    db.query(Position).filter(Position.is_liquidated == True).all()
                ).scalar()

                # Convert ORM objects to dictionaries for return
                return [
                    {
                        "user_id": position.user_id,
                        "token_symbol": position.token_symbol,
                        "amount": position.amount,
                        "multiplier": position.multiplier,
                        "created_at": position.created_at,
                        "status": position.status.value,
                        "start_price": position.start_price,
                        "is_liquidated": position.is_liquidated,
                        "datetime_liquidation": position.datetime_liquidation,
                    }
                    for position in liquidated_positions
                ]

            except SQLAlchemyError as e:
                logger.error(f"Error retrieving liquidated positions: {str(e)}")
                return []

    def get_position_by_id(self, position_id: int) -> Position | None:
        """
        Retrieves a position by its ID.
        :param position_id: Position ID
        :return: Position | None
        """
        return self.get_object(Position, position_id)

    def delete_all_user_positions(self, user_id: uuid.UUID) -> None:
        """
        Deletes all positions for a user.
        :param user_id: User ID
        """
        with self.Session() as db:
            try:
                positions = db.query(Position).filter_by(user_id=user_id).all()
                for position in positions:
                    db.delete(position)
                db.commit()
            except SQLAlchemyError as e:
                logger.error(f"Error deleting positions for user {user_id}: {str(e)}")

    def add_extra_deposit_to_position(self, position: Position, amount: str) -> None:
        """
        Adds extra deposit to a position in the database.
        :param position: Position
        :param amount: str
        :return: None
        """
        position.amount = str(int(position.amount) + int(amount))
        self.write_to_db(position)
