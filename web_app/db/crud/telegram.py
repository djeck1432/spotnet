"""
This module contains the telegram database configuration.
"""

import logging
from typing import TypeVar

from sqlalchemy import update

from .base import DBConnector
from web_app.db.models import Base, TelegramUser

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


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
            self.delete_object_by_id(user, user.id)

    def set_notification_allowed(
        self, telegram_id: str = None, wallet_id: str = None
    ) -> TelegramUser:
        """
        Toggles or sets is_allowed_notification for a TelegramUser,
        creating a new user if none exists.
        Either telegram_id or wallet_id must be provided.

        :param telegram_id: str, optional
        :param wallet_id: str, optional
        :return: TelegramUser
        """
        if not telegram_id and not wallet_id:
            raise ValueError("Either telegram_id or wallet_id must be provided")

        with self.Session() as session:
            user = None
            if telegram_id:
                user = self.get_user_by_telegram_id(telegram_id)
            if not user and wallet_id:
                user = (
                    session.query(TelegramUser).filter_by(wallet_id=wallet_id).first()
                )

            if user:
                user.is_allowed_notification = not user.is_allowed_notification
                session.commit()
                session.refresh(user)
                return user
            else:
                user_data = {
                    "telegram_id": telegram_id,
                    "wallet_id": wallet_id,
                    "is_allowed_notification": True,
                }
                return self.create_telegram_user(user_data)

    def allow_notification(self, telegram_id: int) -> bool:
        """
        Update is_allowed_notification field to True for a specific telegram user

        Args:
            telegram_id: Telegram user ID

        Raises:
            ValueError: If the user with the given telegram_id is not found
        """
        with self.Session() as session:
            user = (
                session.query(TelegramUser).filter_by(telegram_id=telegram_id).first()
            )
            if not user:
                raise ValueError(f"User with telegram_id {telegram_id} not found")

            user.is_allowed_notification = True
            session.commit()
            return True
