"""
This module defines the Pydantic models for Telegram user data serialization.
"""

from pydantic import BaseModel


class TelegramUserCreate(BaseModel):
    """
    Pydantic model for creating a new Telegram user.

    Attributes:
        telegram_id (str): The unique identifier for the Telegram user.
        username (str | None): The username of the Telegram user.
        first_name (str | None): The first name of the Telegram user.
        last_name (str | None): The last name of the Telegram user.
        photo_url (str | None): The URL of the user's profile photo.
        wallet_id (str | None): The wallet ID associated with the user.
    """

    telegram_id: int
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    photo_url: str | None = None

    wallet_id: str | None = None


class TelegramUserAuth(BaseModel):
    """
    Pydantic model for Telegram user authentication data.

    Attributes:
        raw (str | dict): The raw authentication data received from Telegram.
        is_webapp (bool): Indicates if the request is from a web app.
    """

    raw: str | dict
    is_webapp: bool
