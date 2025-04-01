"""
Test auth services.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch
import uuid
import pytest
import jwt
from app.core.config import settings
from app.services.auth.base import create_access_token, get_current_user
from app.models.admin import Admin
from app.crud.admin import admin_crud

ALGORITHM = settings.algorithm


def test_create_access_token_with_expires_delta():
    """Test create_access_token jwt creation with expires_delta param"""

    email = "xyz@gmail.com"
    exception = timedelta(minutes=20)
    _time = int((datetime.now() + exception).timestamp())

    token = create_access_token(email, exception)

    payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    assert email == payload.get("sub")
    assert _time == payload.get("exp")


def test_create_access_token_without_expires_delta():
    """Test create_access_token jwt creation without expires_delta param"""
    email = "xyz@gmail.com"
    exception = timedelta(minutes=15)
    _time = int((datetime.now() + exception).timestamp())

    token = create_access_token(email)

    payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    assert email == payload.get("sub")
    assert _time == payload.get("exp")


@pytest.mark.asyncio
async def test_get_current_user_success():
    """Test successfully getting the current user by jwt"""
    email = "xyz@gmail.com"
    user_id = uuid.uuid4()

    return_value = {
        "id": str(user_id),
        "email": email,
        "name": "Alex",
        "password": "hash",
    }

    token = create_access_token(email)

    with patch.object(
        admin_crud, "get_object_by_field", new_callable=AsyncMock
    ) as get_object_by_field:
        get_object_by_field.return_value = return_value

        user = await get_current_user(token)
        assert user == return_value
        get_object_by_field.assert_awaited_once_with(field="email", value=email)


@pytest.mark.asyncio
async def test_get_current_user_fails_with_expired_jwt():
    """Test fails with expired jwt"""
    email = "xyz@gmail.com"

    to_encode = {
        "sub": email,
        "exp": datetime.now(timezone.utc) - timedelta(minutes=25),
    }
    token = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

    with pytest.raises(Exception, match="jwt expired"):
        await get_current_user(token)


@pytest.mark.asyncio
async def test_get_current_user_fails_with_invalid_jwt():
    """Test fails with invalid jwt"""

    to_encode = {"exp": datetime.now(timezone.utc) + timedelta(minutes=25)}
    token = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

    with pytest.raises(Exception, match="Invalid jwt"):
        await get_current_user(token)


@pytest.mark.asyncio
async def test_get_current_user_fails_if_usr_not_found():
    """Test fails with invalid jwt"""
    to_encode = {
        "sub": "xxx",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=25),
    }
    token = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

    with patch.object(
        admin_crud, "get_object_by_field", new_callable=AsyncMock
    ) as get_object_by_field:
        get_object_by_field.return_value = None
        with pytest.raises(Exception, match="User not found"):
            await get_current_user(token)
