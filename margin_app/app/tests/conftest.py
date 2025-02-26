"""Conftest.py"""

import pytest_asyncio

from app.crud.base import DBConnector
from app.models.base import BaseModel


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
