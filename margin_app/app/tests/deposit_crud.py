"""
This module contains tests for the deposit CRUD functionality.
"""

import uuid
from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock
import pytest
from sqlalchemy.exc import SQLAlchemyError

from app.crud.deposit import DepositCRUD
from app.models.deposit import Deposit


@pytest.fixture
def deposit_crud():
    """Fixture to create an instance of DepositCRUD."""
    return DepositCRUD()


@pytest.fixture
def sample_deposit():
    """Create a sample deposit for testing."""
    return Deposit(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        token="NGN",
        amount=Decimal("1.5"),
        transaction_id="tx234"
    )


### Positive Test Cases ###

@pytest.mark.asyncio
async def test_create_deposit_success(deposit_crud):
    """Test successfully creating a new deposit."""
    user_id = uuid.uuid4()
    token = "NGN"
    amount = Decimal("1.5")
    transaction_id = "tx234"

    deposit_crud.write_to_db = AsyncMock(return_value=Deposit(
        id=uuid.uuid4(), user_id=user_id, token=token, amount=amount, transaction_id=transaction_id
    ))

    deposit = await deposit_crud.create_deposit(user_id, token, amount, transaction_id)

    # Confirm tests
    assert deposit.user_id == user_id
    assert deposit.token == token
    assert deposit.amount == amount
    assert deposit.transaction_id == transaction_id
    assert hasattr(deposit, "id")


@pytest.mark.asyncio
async def test_update_deposit_success(deposit_crud, sample_deposit):
    """Test successfully updating an existing deposit."""

    mock_session_obj = MagicMock()
    mock_session_obj.get = AsyncMock(return_value=sample_deposit)
    mock_session_obj.commit = AsyncMock()
    mock_session_obj.refresh = AsyncMock()

    mock_session_obj.__aenter__.return_value = mock_session_obj
    mock_session_obj.__aexit__.return_value = None

    deposit_crud.session = MagicMock(return_value=mock_session_obj)

    update_data = {"token": "SOL", "amount": Decimal("2.0"), "transaction_id": "tx365"}
    updated_deposit = await deposit_crud.update_deposit(sample_deposit.id, update_data)

    # Confirm tests
    mock_session_obj.get.assert_called_once()
    assert updated_deposit.token == "SOL"
    assert updated_deposit.amount == Decimal("2.0")
    assert updated_deposit.transaction_id == "tx365"


### Negative Test Cases ###

@pytest.mark.asyncio
async def test_create_deposit_failure(deposit_crud):
    """Test failure when creating a deposit."""
    deposit_crud.write_to_db = AsyncMock(side_effect=SQLAlchemyError("DB error"))

    with pytest.raises(Exception, match="Could not create deposit"):
        await deposit_crud.create_deposit(uuid.uuid4(), "ETH", Decimal("3.5"), "tx222")


@pytest.mark.asyncio
async def test_update_deposit_not_found(deposit_crud):
    """Test updating a deposit that does not exist."""

    mock_session_obj = MagicMock()
    mock_session_obj.get = AsyncMock(return_value=None)
    mock_session_obj.__aenter__.return_value = mock_session_obj
    mock_session_obj.__aexit__.return_value = None

    deposit_crud.session = MagicMock(return_value=mock_session_obj)

    result = await deposit_crud.update_deposit(uuid.uuid4(), {"token": "BTC"})
    assert result is None


@pytest.mark.asyncio
async def test_update_deposit_failure(deposit_crud, sample_deposit):
    """Test failure when updating a deposit due to commit error."""

    mock_session_obj = MagicMock()
    mock_session_obj.get = AsyncMock(return_value=sample_deposit)
    mock_session_obj.commit = AsyncMock(side_effect=SQLAlchemyError("Commit error"))
    mock_session_obj.__aenter__.return_value = mock_session_obj
    mock_session_obj.__aexit__.return_value = None

    deposit_crud.session = MagicMock(return_value=mock_session_obj)

    with pytest.raises(SQLAlchemyError, match="Commit error"):
        await deposit_crud.update_deposit(sample_deposit.id, {"token": "BTC"})
