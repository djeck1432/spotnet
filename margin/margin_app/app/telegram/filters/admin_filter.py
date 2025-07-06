"""Custom filter to check if a Telegram user is an admin based on config."""

from aiogram.filters import BaseFilter
from aiogram.types import Message

from app.telegram.config import BotConfig

config = BotConfig()


class AdminFilter(BaseFilter):
    """Filter that checks if the user is an admin based on their Telegram ID."""

    is_admin: bool = True

    async def __call__(self, message: Message) -> bool:
        """
        Checks if the user is in the list of configured admin IDs.

        Args:
            message (Message): The incoming Telegram message.

        Returns:
            bool: True if the user is an admin and `is_admin` is True; False otherwise.
        """
        return (message.from_user.id in config.ADMINS) == self.is_admin
