"""
Core configuration settings for the application.
"""

import os
from sqlalchemy.engine.url import URL
import sys
from pydantic import Field, computed_field
from pydantic_settings import BaseSettings
from sqlalchemy import URL
from typing import Optional


class Settings(BaseSettings):
    """Configuration settings for the application."""

    # Application settings
    app_env: str = "development"
    secret_key: str = "SECRET_KEY"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    reset_password_expire_minutes: int = 15
    host: str = "localhost"
    forget_password_url: str = "/admin/reset-password"

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env.test" if "pytest" in sys.modules else ".env.dev")
        env_file_encoding = "utf-8"

    # Database settings
    db_driver: str = "postgresql+asyncpg"
    db_name: str = Field(default="db_name", alias="POSTGRES_DB")
    db_user: str = Field(default="user", alias="POSTGRES_USER")
    db_password: str = Field(default="password", alias="POSTGRES_PASSWORD")
    db_host: str = Field(default="localhost", alias="DB_HOST")
    db_port: int = Field(default=5432, alias="DB_PORT")

    # Email settings
    sendgrid_api_key: Optional[str] = None
    email_sender: Optional[str] = None
    email_sender_name: Optional[str] = None
    email_test_mode: bool = False

    # Google authentication settings
    google_client_id: str = Field(alias="GOOGLE_CLIENT_ID")
    google_client_secret: str = Field(alias="GOOGLE_CLIENT_SECRET")
    google_redirect_url: str = Field(alias="GOOGLE_REDIRECT_URI")

    @computed_field
    @property
    def db_url(self) -> URL:
        """
        Computed property to get SQLAlchemy URL, using env settings
        """
        return URL.create(
            drivername=self.db_driver,
            username=self.db_user,
            password=self.db_password,
            host=self.db_host,
            database=self.db_name,
            port=self.db_port,
        )


settings = Settings()
