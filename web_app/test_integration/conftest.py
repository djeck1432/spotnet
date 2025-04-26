"""Integration test configuration."""
import asyncio
import pytest
import pytest_asyncio
from web_app.db.crud import UserDBConnector, PositionDBConnector, AirDropDBConnector
from web_app.db.models import Base
from sqlalchemy.ext.asyncio import create_async_engine
from web_app.test_integration.test_settings import settings

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="session")
async def db_engine():
    """Create a test database engine."""
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=True,
        future=True
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest_asyncio.fixture
async def db_session(db_engine):
    """Create a test database session."""
    async with db_engine.connect() as connection:
        await connection.begin()
        yield connection
        await connection.rollback()

@pytest.fixture
def user_db():
    """Create a UserDBConnector instance."""
    return UserDBConnector()

@pytest.fixture
def position_db():
    """Create a PositionDBConnector instance."""
    return PositionDBConnector()

@pytest.fixture
def airdrop_db():
    """Create an AirDropDBConnector instance."""
    return AirDropDBConnector()
