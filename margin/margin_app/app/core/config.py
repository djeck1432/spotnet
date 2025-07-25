"""
Core configuration settings for the application.
"""

from typing import Optional

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings
from sqlalchemy import URL


class Settings(BaseSettings):
    """Configuration settings for the application."""

    # Application settings
    app_env: str = "development"
    secret_key: str = "SECRET_KEY"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    refresh_token_expire_days: int = 7
    reset_password_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    host: str = "localhost"
    app_base_url: str = "http://localhost:8000"  # Added app_base_url
    forget_password_url: str = "/auth/reset_password"

    # Database settings
    db_driver: str = "postgresql+asyncpg"
    db_name: str = Field(default="postgres", alias="POSTGRES_DB")
    db_user: str = Field(default="postgres", alias="POSTGRES_USER")
    db_password: str = Field(default="admin", alias="POSTGRES_PASSWORD")
    db_host: str = "db"
    db_port: int = 5432

    # Email settings
    sendgrid_api_key: Optional[str] = None
    email_sender: Optional[str] = None
    email_sender_name: Optional[str] = None
    email_test_mode: bool = False

    # Google authentication settings
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    google_redirect_url: str = f"{host}/api/auth/google"

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

    @computed_field
    @property
    def refresh_token_expire_seconds(self) -> int:
        """
        Computed property to get refresh token expiration time in seconds
        """
        return self.refresh_token_expire_days * 24 * 60 * 60


settings = Settings()