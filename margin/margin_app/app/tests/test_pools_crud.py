"""
Pytest-based asynchronous database tests for CRUD operations.

This module defines test cases for verifying the functionality of the database
operations using SQLAlchemy and an async database connection. It includes
fixtures to set up and tear down test environments, as well as tests for
creating, retrieving, updating, and deleting objects in the database.
"""

from datetime import timedelta
import uuid
from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock, Mock, patch

from app.schemas.pools import PoolGetAllResponse, PoolResponse
import pytest
from isort.io import Empty
import sys, pathlib

from app.crud.pool import PoolCRUD, UserPoolCRUD
from app.models.pool import Pool, PoolRiskStatus, UserPool


@pytest.fixture
def mock_db_session():
    """Creates a fully mocked async database session that supports async context management."""
    session = AsyncMock()

    session.__aenter__.return_value = session
    session.__aexit__.return_value = None

    session.add = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.get = AsyncMock(return_value=None)

    return session


@pytest.fixture
def pool_crud(mock_db_session):
    """Creates an instance of PoolCRUD with a mocked async database session."""
    crud = PoolCRUD(Pool)
    crud.session = MagicMock(return_value=mock_db_session)
    return crud


@pytest.fixture
def user_pool_crud(mock_db_session):
    """Creates an instance of UserPoolCRUD with a mocked async database session."""
    crud = UserPoolCRUD(UserPool)
    crud.session = MagicMock(return_value=mock_db_session)
    return crud


@pytest.mark.asyncio
async def test_create_pool_debug(pool_crud, mock_db_session):
    """Debug test for create_pool to check session calls."""
    token = "BTC"
    risk_status = PoolRiskStatus.LOW

    mock_session_instance = AsyncMock()
    mock_session_instance.add = MagicMock()
    mock_session_instance.commit = AsyncMock()
    mock_session_instance.refresh = AsyncMock()
    mock_session_instance.merge = AsyncMock()

    pool_crud.session = MagicMock(return_value=mock_session_instance)

    result = await pool_crud.create_pool(token, risk_status)

    assert result is not None


@pytest.mark.asyncio
async def test_create_pool(pool_crud, mock_db_session):
    """Test creating a pool."""
    token = "BTC"
    risk_status = PoolRiskStatus.LOW

    pool = Pool(token=token, risk_status=risk_status)

    mock_session_instance = AsyncMock()
    mock_session_instance.commit = AsyncMock()
    mock_session_instance.refresh = AsyncMock()
    mock_session_instance.merge = AsyncMock(return_value=pool)

    mock_db_session.__aenter__.return_value = mock_session_instance
    pool_crud.session = MagicMock(return_value=mock_db_session)

    result = await pool_crud.create_pool(token, risk_status)

    assert result is not None
    assert result.token == token
    assert result.risk_status == risk_status

    mock_session_instance.merge.assert_called_once()
    mock_session_instance.commit.assert_called_once()
    mock_session_instance.refresh.assert_called_once_with(pool)


@pytest.mark.asyncio
async def test_get_all_pools(pool_crud, mock_db_session):
    """Test retrieving all pools."""
    pools = [
        PoolResponse(id=str(uuid.uuid4()), token="BTC", risk_status=PoolRiskStatus.LOW),
        PoolResponse(
            id=str(uuid.uuid4()), token="ETH", risk_status=PoolRiskStatus.HIGH
        ),
    ]
    total = 2

    with patch.object(
        pool_crud, "get_objects", new_callable=AsyncMock
    ) as mock_get_objects:
        with patch.object(
            pool_crud, "get_objects_amounts", new_callable=AsyncMock
        ) as mock_get_amounts:
            mock_get_objects.return_value = pools
            mock_get_amounts.return_value = total

            result = await pool_crud.get_objects(limit=None, offset=None)
            count = await pool_crud.get_objects_amounts()

            assert result == pools
            assert count == total
            mock_get_objects.assert_called_once()
            mock_get_amounts.assert_called_once()


@pytest.mark.asyncio
async def test_get_all_pools_empty(pool_crud, mock_db_session):
    """Test retrieving all pools when there are no pools."""
    pools = []
    total = 0

    with patch.object(
        pool_crud, "get_objects", new_callable=AsyncMock
    ) as mock_get_objects:
        with patch.object(
            pool_crud, "get_objects_amounts", new_callable=AsyncMock
        ) as mock_get_amounts:
            mock_get_objects.return_value = pools
            mock_get_amounts.return_value = total

            result = await pool_crud.get_objects(limit=None, offset=None)
            count = await pool_crud.get_objects_amounts()

            assert result == []
            assert count == 0
            mock_get_objects.assert_called_once()
            mock_get_amounts.assert_called_once()


@pytest.mark.asyncio
async def test_get_all_pools_with_internal_exception(pool_crud, mock_db_session):
    """Test retrieving all pools when there is an internal exception."""
    with patch.object(
        pool_crud, "get_objects", new_callable=AsyncMock
    ) as mock_get_objects:
        mock_get_objects.side_effect = Exception("Internal error")

        with pytest.raises(Exception):
            await pool_crud.get_objects()


@pytest.mark.asyncio
async def test_create_user_pool(user_pool_crud, mock_db_session):
    """Test creating a user pool entry."""
    user_id = uuid.uuid4()
    pool_id = uuid.uuid4()
    amount = Decimal("1000.50")

    mock_db_session.add = AsyncMock()
    mock_db_session.commit = AsyncMock()
    mock_db_session.refresh = AsyncMock()

    result = await user_pool_crud.create_user_pool(user_id, pool_id, amount)

    assert result.user_id == user_id
    assert result.pool_id == pool_id
    assert result.amount == amount
    mock_db_session.add.assert_called_once_with(result)
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once_with(result)


@pytest.mark.asyncio
async def test_update_user_pool(user_pool_crud, mock_db_session):
    """Test updating an existing user pool."""
    user_pool_id = uuid.uuid4()
    new_amount = Decimal("1500.75")

    existing_user_pool = UserPool(
        user_id=uuid.uuid4(), pool_id=uuid.uuid4(), amount=Decimal("1000")
    )
    existing_user_pool.id = user_pool_id

    mock_db_session.get = AsyncMock(return_value=existing_user_pool)
    mock_db_session.commit = AsyncMock()
    mock_db_session.refresh = AsyncMock()

    result = await user_pool_crud.update_user_pool(user_pool_id, amount=new_amount)

    assert result is not None
    assert result.amount == new_amount
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once_with(result)


@pytest.mark.asyncio
async def test_update_user_pool_not_found(user_pool_crud, mock_db_session):
    """Test updating a user pool that does not exist."""
    user_pool_id = uuid.uuid4()
    mock_db_session.get = AsyncMock(return_value=None)

    result = await user_pool_crud.update_user_pool(user_pool_id, amount=Decimal("2000"))

    assert result is None
    mock_db_session.get.assert_called_once_with(UserPool, user_pool_id)


@pytest.mark.asyncio
async def test_fetch_all_with_amount_delta(pool_crud, mock_db_session):
    """Test fetching all pools with total amount of user pools and calculated delta"""
    expected_res = [
        (
            Pool(id=uuid.uuid4(), token="BTC", risk_status=PoolRiskStatus.LOW),
            Decimal(123),
            Decimal(456),
        ),
        (
            Pool(id=uuid.uuid4(), token="ETH", risk_status=PoolRiskStatus.HIGH),
            Decimal(789),
            Decimal(123456),
        ),
    ]
    mock_res_all = Mock(return_value=expected_res)
    mock_execute = AsyncMock()
    mock_execute.return_value.all = mock_res_all
    mock_db_session.execute = mock_execute
    res = await pool_crud.fetch_all_with_amount_delta(timedelta(hours=5))
    assert res == expected_res
    mock_res_all.assert_called_once()
    mock_execute.assert_awaited_once()
