"""
This is the test module for the UserCRUD class.
"""

import uuid
import pytest
import pytest_asyncio
from decimal import Decimal
from app.crud.user import UserCRUD
from app.models.user import User


@pytest_asyncio.fixture
async def user_crud() -> UserCRUD:
    """Create instance of UserCRUD"""
    return UserCRUD()

@pytest.mark.asyncio
async def test_test_connection(user_crud: UserCRUD) -> None:
    """
    Positive test for test_connection method.
    """
    result = await user_crud.test_connection()
    assert "PostgreSQL version:" in result

@pytest.mark.asyncio
async def test_create_user_happy_path(user_crud: UserCRUD) -> None:
    """
    Happy Path for create_user method
    """
    user = await user_crud.create_user(wallet_id = "wallet_123")
    assert user.id is not None # Ensure the user has a valid id

@pytest.mark.asyncio
async def test_update_user_happy_path(user_crud: UserCRUD) -> None:
    """
    Happy path for update_user method
    """
    user = await user_crud.create_user(wallet_id = "wallet_111")
    updated_user = await user_crud.update_user(user.id, wallet_id = "wallet_456")
    assert updated_user.wallet_id == "wallet_456"


@pytest.mark.asyncio
async def test_update_user_non_existent(user_crud: UserCRUD) -> None:
    """
    Negative test for update_user method: non-existent user
    """
    non_existent_id = uuid.uuid4()
    result = await user_crud.update_user(non_existent_id, wallet_id = "wallet_444")
    assert result is None

@pytest.mark.asyncio
async def test_delete_user_happy_path(user_crud: UserCRUD) -> None:
    """
    Positive test for delete_user method.
    """
    user = await user_crud.create_user(wallet_id = "wallet_789")

    # verify user exists before deletion
    pre_delete_check = await user_crud.get_object(User, user.id)
    assert pre_delete_check is not None

    # Perform deletion
    await user_crud.delete_user(user.id)
    post_delete_check = await user_crud.get_object(User, user.id)
    assert post_delete_check is None

@pytest.mark.asyncio
async def test_delete_user_non_existent(user_crud: UserCRUD) -> None:
    """
    Negative test for delete_user method: non-existent user
    """
    non_existent_id = uuid.uuid4()
    non_existent_check = await user_crud.delete_user(non_existent_id)
    assert non_existent_check is None

@pytest.mark.asyncio
async def test_add_deposit_happy_path(user_crud: UserCRUD) -> None:
    """
    Positive test for add_deposit method
    """
    user = await user_crud.create_user(wallet_id = "wallet_903")
    deposit = await user_crud.add_deposit(user.id, 
                                    amount=Decimal("100.00"),
                                    token = "USDT",
                                    transaction_id = "tx323")
    assert deposit.user_id == user.id
    assert deposit.amount == Decimal("100.00")

@pytest.mark.asyncio
async def test_add_deposit_non_existent_user(user_crud: UserCRUD) -> None:
    """
    Negative test for add_deposit method: Non-existent user
    """
    non_existent_id = uuid.uuid4()
    with pytest.raises(ValueError, match=f"User {non_existent_id} does not exist"):
        await user_crud.add_deposit(non_existent_id, 
                                    amount=Decimal("100.00"),
                                    token = "USDT",
                                    transaction_id = "tx923")

@pytest.mark.asyncio
async def test_add_margin_position_happy_path(user_crud: UserCRUD) -> None:
    """
    Positive test for add_margin position method.
    """
    user = await user_crud.create_user(wallet_id = "wallet_222")
    margin_position = await user_crud.add_margin_position(
        user.id, 
        borrowed_amount=Decimal("100.00"), 
        multiplier=5,
        transaction_id = "tx523")
    assert margin_position.user_id == user.id
    assert margin_position.borrowed_amount == Decimal("100.00")

@pytest.mark.asyncio
async def test_add_margin_position_non_existent_user(user_crud: UserCRUD) -> None:
    """
    Negative test for add_margin_position method: Non-existent User
    """
    non_existent_id = uuid.uuid4()
    with pytest.raises(ValueError, match=f"User {non_existent_id} does not exist"):
        await user_crud.add_margin_position(
            non_existent_id, 
            borrowed_amount=Decimal("100.00"), 
            multiplier=5,
            transaction_id = "tx123")