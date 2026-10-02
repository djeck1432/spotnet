import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from margin_app.core.db import Base


@pytest.fixture
@pytest.mark.asyncio
async def async_session():
    """Create an in-memory SQLite async session for testing."""
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session_factory = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    session = async_session_factory()
    yield session
    await session.close()
    await engine.dispose()


@pytest.fixture
def mock_admin_user():
    """Create a mock admin user."""
    user = MagicMock()
    user.id = 1
    user.telegram_id = "123456789"
    user.is_admin = True
    return user
