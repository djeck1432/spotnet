"""Conftest.py"""

from fastapi.testclient import TestClient
import pytest_asyncio
import pytest
from app.crud.base import DBConnector
from app.models.base import BaseModel
from app.main import app


@pytest_asyncio.fixture
async def db_connector():
    """Fixture to create a database connection for testing."""
    db = DBConnector()
    async with db.engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    try:
        yield db
    finally:
        async with db.engine.begin() as conn:
            await conn.run_sync(BaseModel.metadata.drop_all)


@pytest.fixture(scope="module")
def client():
    """
    A client mock fixture
    :return: TestClient
    """

    with TestClient(app=app) as test_client:
        yield test_client
