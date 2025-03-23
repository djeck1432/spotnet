"""
Core configuration settings for the application.
"""
from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings
from sqlalchemy import URL


# Secret Key & Algorithm
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Settings(BaseSettings):
    """Configuration settings for the application."""
    # Application settings
    app_env: str = "development"
    secret_key: str = "SECRET_KEY"
    access_token_expire_minutes: int = 30

    # Database settings
    db_driver: str = "postgresql+asyncpg"
    db_name: str = Field(default="db_name", alias="POSTGRES_DB")
    db_user: str = Field(default="user", alias="POSTGRES_USER")
    db_password: str = Field(default="password", alias="POSTGRES_PASSWORD")
    db_host: str = Field(default="localhost", alias="DB_HOST")
    db_port: int = 5432

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