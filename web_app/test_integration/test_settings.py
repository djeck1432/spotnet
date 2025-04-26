"""Test settings configuration."""
from pydantic import Field
from pydantic_settings import BaseSettings


class TestSettings(BaseSettings):
    """Test configuration settings."""
    
    # Database settings
    db_driver: str = "postgresql+asyncpg"
    db_name: str = Field(default="spotnet_test", alias="POSTGRES_DB")
    db_user: str = Field(default="postgres", alias="POSTGRES_USER")
    db_password: str = Field(default="password", alias="POSTGRES_PASSWORD")
    db_host: str = Field(default="db_test", alias="DB_HOST")
    db_port: int = Field(default=5432, alias="DB_PORT")

    class Config:
        env_file = ".env.test"
        env_file_encoding = "utf-8"

    @property
    def database_url(self) -> str:
        """Get the database URL for testing."""
        return f"{self.db_driver}://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


settings = TestSettings()
