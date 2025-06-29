
"""Configuration for the Telegram bot using pydantic-settings."""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List

from pydantic_settings import SettingsConfigDict

class BotConfig(BaseSettings):
    """Bot configuration loaded from environment variables."""
    BOT_API_KEY: str = Field(..., alias="BOT_API_KEY")
    ADMINS: List[int] = Field(..., alias="ADMINS")

    model_config = SettingsConfigDict(
        env_file=".env.dev",
        case_sensitive=True,
        extra="ignore",
    )
