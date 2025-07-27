"""
This module contains the user database configuration.
"""

import logging
from typing import List, Tuple, TypeVar

from sqlalchemy.exc import SQLAlchemyError

from web_app.db.models import Base, Position, Status, TelegramUser, User

from .base import DBConnector

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class UserDBConnector(DBConnector):
    """
    Provides database connection and operations management for the User model.
    """

    def get_users_for_notifications(self) -> List[Tuple[str, str]]:
        """
        Retrieves the contract_address of users with an OPENED position status and
        the telegram_id of Telegram users with notifications enabled.

        :return: List of tuples (contract_address, telegram_id)
        """
        with self.Session() as db:
            try:
                results = (
                    db.query(User.contract_address, TelegramUser.telegram_id)
                    .join(Position, Position.user_id == User.id)
                    .join(TelegramUser, TelegramUser.wallet_id == User.wallet_id)
                    .filter(
                        Position.status == Status.OPENED.value,
                        TelegramUser.is_allowed_notification,
                    )
                    .distinct()
                    .all()
                )
                return results
            except SQLAlchemyError as e:
                logger.error(f"Error retrieving users with OPENED positions: {e}")
                return []

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

    def fetch_user_history(self, user_id: int) -> List[dict]:
        """
        Fetches all positions for a user with the specified fields:
        - status
        - created_at
        - start_price
        - amount
        - multiplier

        ### Parameters:
        - `user_id` (int): Unique identifier of the user.

        ### Returns:
        - A list of dictionaries containing position details.
        """
        with self.Session() as db:
            try:
                # Query positions matching the user_id
                positions = (
                    db.query(
                        Position.status,
                        Position.created_at,
                        Position.start_price,
                        Position.amount,
                        Position.multiplier,
                    )
                    .filter(Position.user_id == user_id)
                    .all()
                )

                # Transform the query result into a list of dictionaries
                return [
                    {
                        "status": position.status,
                        "created_at": position.created_at,
                        "start_price": position.start_price,
                        "amount": position.amount,
                        "multiplier": position.multiplier,
                    }
                    for position in positions
                ]

            except SQLAlchemyError as e:
                logger.error(
                    f"Failed to fetch user history for user_id={user_id}: {str(e)}"
                )
                return []

    def delete_user_by_wallet_id(self, wallet_id: str) -> None:
        """
        Deletes a user from the database by their wallet ID.
        Rolls back the transaction if the operation fails.

        :param wallet_id: str
        :return: None
        :raises SQLAlchemyError: If the operation fails
        """
        with self.Session() as session:
            try:
                user = session.query(User).filter(User.wallet_id == wallet_id).first()
                if user:
                    session.delete(user)
                    session.commit()
                    logger.info(
                        f"User with wallet_id {wallet_id} deleted successfully."
                    )
                else:
                    logger.warning(f"No user found with wallet_id {wallet_id}.")
            except SQLAlchemyError as e:
                session.rollback()
                logger.error(f"Failed to delete user with wallet_id {wallet_id}: {e}")
                raise e
