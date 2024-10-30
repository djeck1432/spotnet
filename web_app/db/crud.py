"""
This module contains the CRUD operations for the database.
"""

import logging
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Type, TypeVar

from sqlalchemy import create_engine, update, func, cast, Numeric
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker

from web_app.db.database import SQLALCHEMY_DATABASE_URL
from web_app.db.models import AirDrop, Base, Position, Status, User, TelegramUser

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class DBConnector:
    """
    Provides database connection and operations management using SQLAlchemy
    in a FastAPI application context.

    Methods:
    - write_to_db: Writes an object to the database.
    - get_object: Retrieves an object by its ID in the database.
    - remove_object: Removes an object by its ID from the database.
    """

    def __init__(self, db_url: str = SQLALCHEMY_DATABASE_URL):
        """
        Initialize the database connection and session factory.
        :param db_url: str = None
        """
        self.engine = create_engine(db_url)
        self.session_factory = sessionmaker(bind=self.engine)
        self.Session = scoped_session(self.session_factory)

    def write_to_db(self, obj: Base = None) -> Base:
        """
        Writes an object to the database. Rolls back the transaction if there's an error.
        Refreshes the object to keep it attached to the session.
        :param obj: Base = None
        :raise SQLAlchemyError: If the database operation fails.
        :return: Base - the updated object
        """
        with self.Session() as session:
            try:
                session.add(obj)
                session.commit()
                session.refresh(obj)
                return obj

            except SQLAlchemyError as e:
                session.rollback()
                raise e

    def get_object(
        self, model: Type[ModelType] = None, obj_id: uuid = None
    ) -> ModelType | None:
        """
        Retrieves an object by its ID from the database.
        :param: model: type[Base] = None
        :param: obj_id: uuid = None
        :return: Base | None
        """
        db = self.Session()
        try:
            return db.query(model).filter(model.id == obj_id).first()
        finally:
            db.close()

    def get_object_by_field(
        self, model: Type[ModelType] = None, field: str = None, value: str = None
    ) -> ModelType | None:
        """
        Retrieves an object by a specified field from the database.
        :param model: type[Base] = None
        :param field: str = None
        :param value: str = None
        :return: Base | None
        """
        db = self.Session()
        try:
            return db.query(model).filter(getattr(model, field) == value).first()
        finally:
            db.close()

    def delete_object(self, model: Type[Base] = None, obj_id: uuid = None) -> None:
        """
        Delete an object by its ID from the database. Rolls back if the operation fails.
        :param model: type[Base] = None
        :param obj_id: uuid = None
        :return: None
        :raise SQLAlchemyError: If the database operation fails
        """
        db = self.Session()

        try:
            obj = db.query(model).filter(model.id == obj_id).first()
            if obj:
                db.delete(obj)
                db.commit()

            db.rollback()

        except SQLAlchemyError as e:
            db.rollback()
            raise e

        finally:
            db.close()

    def create_empty_claim(self, user_id: uuid.UUID) -> AirDrop:
        """
        Creates a new empty AirDrop instance for the given user_id.
        :param user_id: uuid.UUID
        :return: AirDrop
        """
        airdrop = AirDrop(user_id=user_id)
        self.write_to_db(airdrop)
        return airdrop


class UserDBConnector(DBConnector):
    """
    Provides database connection and operations management for the User model.
    """

    def get_user_by_wallet_id(self, wallet_id: str) -> User | None:
        """
        Retrieves a user by their wallet ID.
        :param wallet_id: str
        :return: User | None
        """
        return self.get_object_by_field(User, "wallet_id", wallet_id)

    def get_contract_address_by_wallet_id(self, wallet_id: str) -> str:
        """
        Retrieves the contract address of a user by their wallet ID.
        :param wallet_id: str
        :return: str
        """
        user = self.get_user_by_wallet_id(wallet_id)
        return user.contract_address if user else None

    def create_user(self, wallet_id: str) -> User:
        """
        Creates a new user in the database.
        :param wallet_id: str
        :return: User
        """
        user = User(wallet_id=wallet_id)
        self.write_to_db(user)
        return user

    def update_user_contract(self, user: User, contract_address: str) -> None:
        """
        Updates the contract of a user in the database.
        :param user: User
        :param contract_address: str
        :return: None
        """
        user.is_contract_deployed = not user.is_contract_deployed
        user.contract_address = contract_address
        self.write_to_db(user)

    def get_unique_users_count(self) -> int:
        """
        Retrieves the number of unique users in the database.
        :return: The count of unique users.
        """
        with self.Session() as db:
            try:
                # Query to count distinct users based on wallet ID
                unique_users_count = db.query(User.wallet_id).distinct().count()
                return unique_users_count

            except SQLAlchemyError as e:
                logger.error(f"Failed to retrieve unique users count: {str(e)}")
                return 0


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
        self.delete_object(Position, position.id)

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

    async def get_total_amounts_for_open_positions(self) -> dict:
        """
        Calculates the total value for all open positions based on current token prices.

        :return: A dictionary mapping token symbols to the total value of open positions in that token.
        """
        with self.Session() as db:
            try:
                open_positions = (
                    db.query(Position)
                    .filter(Position.status == Status.OPENED.value)
                    .all()
                )
                current_prices = await self.get_current_prices()

                total_amounts = {}
                for position in open_positions:
                    token_symbol = position.token_symbol
                    current_price = Decimal(current_prices.get(token_symbol, 0))
                    total_amounts[token_symbol] = (
                        total_amounts.get(token_symbol, 0)
                        + Decimal(position.amount) * current_price
                    )
                return total_amounts
            except SQLAlchemyError as e:
                logger.error(f"Error calculating total amounts for open positions: {e}")
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


class AirDropDBConnector(DBConnector):
    """
    Provides database connection and operations management for the AirDrop model.
    """

    def save_claim_data(self, airdrop_id: uuid.UUID, amount: Decimal) -> None:
        """
        Updates the AirDrop instance with claim data.
        :param airdrop_id: uuid.UUID
        :param amount: Decimal
        """
        airdrop = self.get_object(AirDrop, airdrop_id)
        if airdrop:
            airdrop.amount = amount
            airdrop.is_claimed = True
            airdrop.claimed_at = datetime.now()
            self.write_to_db(airdrop)
        else:
            logger.error(f"AirDrop with ID {airdrop_id} not found")

    def get_all_unclaimed(self) -> List[AirDrop]:
        """
        Returns all unclaimed AirDrop instances (where is_claimed is False).

        :return: List of unclaimed AirDrop instances
        """
        with self.Session() as db:
            try:
                unclaimed_instances = (
                    db.query(AirDrop).filter_by(is_claimed=False).all()
                )
                return unclaimed_instances
            except SQLAlchemyError as e:
                logger.error(
                    f"Failed to retrieve unclaimed AirDrop instances: {str(e)}"
                )
                return []


class TelegramUserDBConnector(DBConnector):
    """
    Provides database connection and operations management for the TelegramUser model.
    """

    def get_user_by_telegram_id(self, telegram_id: str) -> TelegramUser | None:
        """
        Retrieves a TelegramUser by their Telegram ID.
        :param telegram_id: str
        :return: TelegramUser | None
        """
        return self.get_object_by_field(TelegramUser, "telegram_id", telegram_id)

    def get_wallet_id_by_telegram_id(self, telegram_id: str) -> str | None:
        """
        Retrieves the wallet ID of a TelegramUser by their Telegram ID.
        :param telegram_id: str
        :return: str | None
        """
        user = self.get_user_by_telegram_id(telegram_id)
        return user.wallet_id if user else None

    def create_telegram_user(self, user_data: dict) -> TelegramUser:
        """
        Creates a new TelegramUser in the database.
        :param user_data: dict
        :return: TelegramUser
        """
        telegram_user = TelegramUser(**user_data)
        return self.write_to_db(telegram_user)

    def update_telegram_user(self, telegram_id: str, user_data: dict) -> None:
        """
        Updates a TelegramUser in the database.
        :param telegram_id: str
        :param user_data: dict
        :return: None
        """
        with self.Session() as session:
            stmt = (
                update(TelegramUser)
                .where(TelegramUser.telegram_id == telegram_id)
                .values(**user_data)
            )
            session.execute(stmt)
            session.commit()

    def save_or_update_user(self, user_data: dict) -> TelegramUser:
        """
        Saves a new TelegramUser or updates an existing one.
        :param user_data: dict
        :return: TelegramUser
        """
        telegram_id = user_data.get("telegram_id")
        existing_user = self.get_user_by_telegram_id(telegram_id)

        if existing_user:
            self.update_telegram_user(telegram_id, user_data)
            return self.get_user_by_telegram_id(telegram_id)
        else:
            return self.create_telegram_user(user_data)

    def delete_telegram_user(self, telegram_id: str) -> None:
        """
        Deletes a TelegramUser from the database.
        :param telegram_id: str
        :return: None
        """
        user = self.get_user_by_telegram_id(telegram_id)
        if user:
            self.delete_object(user, user.id)
