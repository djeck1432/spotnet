import pytest
import uuid
from unittest.mock import AsyncMock
from decimal import Decimal
from margin_app.app.crud.pool import PoolCRUD, UserPoolCRUD  # Ensure the correct module path is used
from app.models.pool import PoolRiskStatus

@pytest.fixture
def pool_crud() -> PoolCRUD:
    """Fixture to provide an instance of PoolCRUD with mocked database methods."""
    crud = PoolCRUD()
    crud.write_to_db = AsyncMock()
    return crud

@pytest.fixture
def user_pool_crud() -> UserPoolCRUD:
    """Fixture to provide an instance of UserPoolCRUD with mocked database methods."""
    crud = UserPoolCRUD()
    crud.session = AsyncMock()
    return crud

@pytest.fixture
def test_data():
    """Fixture to provide reusable test data."""
    return {
        "user_id": uuid.uuid4(),
        "pool_id": uuid.uuid4(),
        "amount": Decimal("100.00"),
    }

# -------------------- Positive Test Cases -------------------- #
@pytest.mark.asyncio
async def test_create_pool_success(pool_crud: PoolCRUD) -> None:
    """Test creating a pool successfully."""
    pool_crud.write_to_db.return_value = Pool(token="TEST123", risk_status=PoolRiskStatus.LOW)
    response = await pool_crud.create_pool(token="TEST123", risk_status=PoolRiskStatus.LOW)
    assert response is not None
    assert response.token == "TEST123"
    assert response.risk_status == PoolRiskStatus.LOW

@pytest.mark.asyncio
async def test_create_user_pool_success(user_pool_crud: UserPoolCRUD, test_data) -> None:
    """Test creating a user pool successfully."""
    user_pool_crud.session.return_value.get.return_value = None  # Mock DB get method
    response = await user_pool_crud.create_user_pool(**test_data)
    assert response is not None
    assert response.user_id == test_data["user_id"]
    assert response.pool_id == test_data["pool_id"]
    assert response.amount == test_data["amount"]

@pytest.mark.asyncio
async def test_update_user_pool_success(user_pool_crud: UserPoolCRUD, test_data) -> None:
    """Test updating a user pool successfully."""
    user_pool_crud.session.return_value.get.return_value = AsyncMock(amount=Decimal("100.00"))  # Mock existing entry
    response = await user_pool_crud.update_user_pool(user_pool_id=test_data["user_id"], amount=Decimal("200.00"))
    assert response is not None
    assert response.amount == Decimal("200.00")

# -------------------- Negative Test Cases -------------------- #
@pytest.mark.asyncio
async def test_create_user_pool_invalid_ids(user_pool_crud: UserPoolCRUD) -> None:
    """Test creating a user pool with invalid IDs should raise an exception."""
    with pytest.raises(Exception):
        await user_pool_crud.create_user_pool(user_id=uuid.uuid4(), pool_id=None, amount=Decimal("50.00"))

@pytest.mark.asyncio
async def test_update_nonexistent_user_pool(user_pool_crud: UserPoolCRUD) -> None:
    """Test updating a nonexistent user pool returns None with proper logging."""
    user_pool_crud.session.return_value.get.return_value = None  # Mock nonexistent entry
    response = await user_pool_crud.update_user_pool(user_pool_id=uuid.uuid4(), amount=Decimal("300.00"))
    assert response is None  # Ensure None is returned for nonexistent user pools