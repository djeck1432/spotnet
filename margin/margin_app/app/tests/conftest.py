"""Conftest.py"""

from fastapi.testclient import TestClient
import pytest_asyncio
import pytest
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.models.base import Base
from app.main import app
import os
import faker

fake = faker.Faker()


def set_test_env_vars():
    """Sets environment variables for running tests."""
    print("Setting test environment variables...")
    os.environ.setdefault("GOOGLE_CLIENT_ID", "test-google-client-id")
    os.environ.setdefault("GOOGLE_CLIENT_SECRET", "test-google-client-secret")
    os.environ.setdefault("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/callback")


@pytest.hookimpl(tryfirst=True)
def pytest_configure():
    """Hook to configure pytest before tests run."""
    set_test_env_vars()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    """Fixture to create and teardown database migrations"""
    engine = create_async_engine(settings.db_url)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    try:
        yield
    finally:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="module")
def client():
    """
    A client mock fixture
    :return: TestClient
    """

    with TestClient(app=app) as test_client:
        yield test_client
