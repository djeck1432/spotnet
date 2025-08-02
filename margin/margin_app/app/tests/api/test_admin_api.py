"""
Unit tests for Admin API endpoints.

Comprehensive test suite covering admin management functionality including
user creation, password reset, and profile updates.
"""

import uuid
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace

import pytest
from fastapi import status
from app.services.auth.base import create_access_token
from app.tests.conftest import client
from decimal import Decimal


ADMIN_URL = "/api/admin/"

test_admin_object = {
    "name": f"test_name",
    "id": str(uuid.uuid4()),
    "email": f"email@test.com",
    "is_super_admin": True,
}

super_admin_obj = {
    "id": str(uuid.uuid4()),
    "email": "super@admin.com",
    "name": "Super Admin",
    "is_super_admin": True,
}
regular_admin_obj = {
    "id": str(uuid.uuid4()),
    "email": "regular@admin.com",
    "name": "Regular Admin",
    "is_super_admin": False,
}


def make_admin_obj(data):
    """
    Helper to convert a dictionary to an object with attribute access,
    for use in mocks where the code expects attribute-style access.
    """
    return SimpleNamespace(**data)


@pytest.fixture
def mock_admin_crud():
    """
    Mock the admin_crud object.
    """
    with patch("app.crud.admin.AdminCRUD", new_callable=AsyncMock) as mock:
        yield mock


@pytest.fixture
def patch_admin_get_by_email():
    """
    Patch admin_crud.get_by_email for authentication middleware.
    """
    with patch(
        "app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock
    ) as mock:
        yield mock


@pytest.fixture
def mock_get_admin_by_email():
    """
    Mock the get_by_email method of AdminCRUD.
    This will use the get_object_by_field from the base DBConnector class.
    """
    with patch(
        "app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock
    ) as mock:
        mock.return_value = make_admin_obj(test_admin_object)
        yield mock


@pytest.fixture
def mock_get_all_admin():
    """
    Mock the get_objects method of DBConnector to retrieve all admin records.
    """
    with patch("app.crud.base.DBConnector.get_objects", new_callable=AsyncMock) as mock:
        yield mock


@pytest.mark.asyncio
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.get_object", new_callable=AsyncMock)
async def test_update_admin_not_found(mock_get_object, mock_get_by_email, client):
    """Test update admin when admin not found."""

    mock_get_by_email.return_value = make_admin_obj(test_admin_object)
    mock_get_object.return_value = None

    token = create_access_token(test_admin_object["email"])
    response = client.put(
        f"{ADMIN_URL}{test_admin_object['id']}",
        json={"name": "Updated Name"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Admin not found."


@pytest.mark.asyncio
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.get_object", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
async def test_update_admin_empty_name(
    mock_write_to_db, mock_get_object, mock_get_email, client
):
    """Test update admin with empty name."""

    mock_get_email.return_value = make_admin_obj(test_admin_object)

    mock_admin = make_admin_obj(test_admin_object)
    mock_get_object.return_value = mock_admin
    mock_write_to_db.return_value = mock_admin

    token = create_access_token(test_admin_object["email"])
    response = client.put(
        f"{ADMIN_URL}{test_admin_object['id']}",
        json={"name": ""},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200


@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.create_admin", new_callable=AsyncMock)
def test_superadmin_can_create_admin(
    mock_create_admin, mock_get_admin_user, patch_admin_get_by_email, client
):
    """
    Test that a superadmin can successfully create a new admin.
    """
    mock_get_admin_user.return_value = make_admin_obj(super_admin_obj)
    mock_create_admin.return_value = make_admin_obj(
        {
            "id": str(uuid.uuid4()),
            "email": "new@admin.com",
            "name": "New Admin",
            "is_super_admin": False,
        }
    )
    patch_admin_get_by_email.return_value = make_admin_obj(super_admin_obj)
    token = create_access_token(super_admin_obj["email"])
    response = client.post(
        ADMIN_URL + "add",
        json={"email": "new@admin.com", "name": "New Admin"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201


@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
def test_regular_admin_cannot_create_admin(
    mock_get_admin_user, patch_admin_get_by_email, client
):
    """
    Test that a regular admin (non-superadmin) cannot create new admin users.
    """
    mock_get_admin_user.return_value = make_admin_obj(regular_admin_obj)
    patch_admin_get_by_email.return_value = make_admin_obj(regular_admin_obj)
    token = create_access_token(regular_admin_obj["email"])
    response = client.post(
        ADMIN_URL + "add",
        json={"email": "new@admin.com", "name": "New Admin"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
def test_unauthenticated_user_cannot_create_admin(
    mock_get_admin_user, patch_admin_get_by_email, client
):
    """
    Test that unauthenticated users cannot create admin users.
    """
    mock_get_admin_user.return_value = None
    patch_admin_get_by_email.return_value = None
    token = create_access_token("nouser@example.com")
    response = client.post(
        ADMIN_URL + "add",
        json={"email": "new@admin.com", "name": "New Admin"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 401


@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
def test_only_allowed_fields_processed(
    mock_get_admin_user, patch_admin_get_by_email, client
):
    """
    Test that the endpoint only accepts allowed fields (email and name)
    and rejects requests with additional fields.
    """
    mock_get_admin_user.return_value = make_admin_obj(super_admin_obj)
    patch_admin_get_by_email.return_value = make_admin_obj(super_admin_obj)
    token = create_access_token(super_admin_obj["email"])
    response = client.post(
        ADMIN_URL + "add",
        json={
            "email": "new@admin.com",
            "name": "New Admin",
            "role": "admin",
            "permissions": ["read", "write"],
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
def test_email_required(mock_get_admin_user, patch_admin_get_by_email, client):
    """
    Test that email field is required in the request.
    """
    mock_get_admin_user.return_value = make_admin_obj(super_admin_obj)
    patch_admin_get_by_email.return_value = make_admin_obj(super_admin_obj)
    token = create_access_token(super_admin_obj["email"])
    response = client.post(
        ADMIN_URL + "add",
        json={"name": "New Admin"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.create_admin", new_callable=AsyncMock)
def test_name_optional(
    mock_create_admin, mock_get_admin_user, patch_admin_get_by_email, client
):
    """
    Test that name field is optional in the request.
    """
    mock_get_admin_user.return_value = make_admin_obj(super_admin_obj)
    patch_admin_get_by_email.return_value = make_admin_obj(super_admin_obj)
    mock_create_admin.return_value = make_admin_obj(
        {
            "id": str(uuid.uuid4()),
            "email": "new@admin.com",
            "name": None,
            "is_super_admin": False,
        }
    )
    token = create_access_token(super_admin_obj["email"])
    response = client.post(
        ADMIN_URL + "add",
        json={"email": "new@admin.com"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
def test_reset_password_success(mock_write_to_db, mock_get_current_user, client):
    """Test successful password reset with valid token."""
    mock_admin = make_admin_obj(test_admin_object)
    mock_get_current_user.return_value = mock_admin
    mock_write_to_db.return_value = mock_admin

    response = client.post(
        f"{ADMIN_URL}reset_password/valid_token?new_password=newSecurePassword123!"
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Password was successfully reset"
    mock_get_current_user.assert_called_once_with("valid_token")
    mock_write_to_db.assert_called_once()


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
def test_reset_password_invalid_token(mock_get_current_user, client):
    """Test password reset with invalid token."""
    mock_get_current_user.side_effect = Exception("Invalid jwt")

    response = client.post(
        f"{ADMIN_URL}reset_password/invalid_token?new_password=newSecurePassword123!"
    )

    assert response.status_code == 400
    assert "Invalid reset token" in response.json()["detail"]


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
def test_reset_password_expired_token(mock_get_current_user, client):
    """
    Test password reset with expired token.
    """
    mock_get_current_user.side_effect = Exception("jwt expired")

    response = client.post(
        f"{ADMIN_URL}reset_password/expired_token?new_password=newSecurePassword123!"
    )

    assert response.status_code == 400
    assert "Reset token has expired" in response.json()["detail"]


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
def test_reset_password_admin_not_found(mock_get_current_user, client):
    """
    Test password reset when admin is not found for valid token.
    """
    mock_get_current_user.return_value = None

    response = client.post(
        f"{ADMIN_URL}reset_password/valid_token?new_password=newSecurePassword123!"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Admin not found"


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
def test_reset_password_database_error(mock_write_to_db, mock_get_current_user, client):
    """
    Test password reset when database write fails.
    """
    mock_admin = make_admin_obj(test_admin_object)
    mock_get_current_user.return_value = mock_admin
    mock_write_to_db.side_effect = Exception("Database error")

    response = client.post(
        f"{ADMIN_URL}reset_password/valid_token?new_password=newSecurePassword123!"
    )

    assert response.status_code == 500
    assert "An error occurred while resetting the password" in response.json()["detail"]


def test_reset_password_missing_new_password(client):
    """Test password reset without providing new_password field."""
    response = client.post(f"{ADMIN_URL}reset_password/valid_token")

    assert response.status_code == 422


def test_reset_password_empty_new_password(client):
    """Test password reset with empty new_password."""
    response = client.post(f"{ADMIN_URL}reset_password/valid_token?new_password=")

    assert response.status_code == 422


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
@patch("app.api.admin.get_password_hash")
def test_reset_password_password_hashing(
    mock_get_password_hash, mock_write_to_db, mock_get_current_user, client
):
    """Test that password is properly hashed during reset."""
    mock_admin = make_admin_obj(test_admin_object)
    mock_get_current_user.return_value = mock_admin
    mock_write_to_db.return_value = mock_admin
    mock_get_password_hash.return_value = "hashed_password"

    new_password = "newSecurePassword123!"
    response = client.post(
        f"{ADMIN_URL}reset_password/valid_token?new_password={new_password}"
    )

    assert response.status_code == 200
    mock_get_password_hash.assert_called_once_with(new_password)
    assert mock_admin.password == "hashed_password"


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
def test_reset_password_extra_fields_ignored(
    mock_write_to_db, mock_get_current_user, client
):
    """Test that reset password endpoint ignores extra query parameters."""
    mock_admin = make_admin_obj(test_admin_object)
    mock_get_current_user.return_value = mock_admin
    mock_write_to_db.return_value = mock_admin

    base_url = f"{ADMIN_URL}reset_password/valid_token"
    query_params = "?new_password=newSecurePassword123!&extra_field=ignored&another=param"
    
    response = client.post(f"{base_url}{query_params}")

    assert response.status_code == 200
    assert response.json()["message"] == "Password was successfully reset"


@patch("app.api.admin.get_current_user", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
def test_reset_password_different_admin_tokens(
    mock_write_to_db, mock_get_current_user, client
):
    """Test password reset works for different admin users."""
    admin1 = make_admin_obj(
        {
            "id": str(uuid.uuid4()),
            "email": "admin1@test.com",
            "name": "Admin One",
            "is_super_admin": False,
        }
    )

    mock_get_current_user.return_value = admin1
    mock_write_to_db.return_value = admin1

    response = client.post(
        f"{ADMIN_URL}reset_password/token1?new_password=newPassword1"
    )

    assert response.status_code == 200

    admin2 = make_admin_obj(
        {
            "id": str(uuid.uuid4()),
            "email": "admin2@test.com",
            "name": "Admin Two",
            "is_super_admin": True,
        }
    )

    mock_get_current_user.return_value = admin2
    mock_write_to_db.return_value = admin2

    response = client.post(
        f"{ADMIN_URL}reset_password/token2?new_password=newPassword2"
    )

    assert response.status_code == 200

@patch("app.contract_tools.admin_mixin.AdminMixin.get_current_prices")
async def test_get_asset_statistics(mock_prices, auth_token):
    # Mock prices
    mock_prices.return_value = {
        "BTC": Decimal('40000'),
        "ETH": Decimal('2500'),
        "SOL": Decimal('100')
    }
    
    # Mock database response
    with patch("app.services.statistics.StatisticsService._get_token_amounts") as mock_amounts:
        mock_amounts.return_value = {
            "BTC": Decimal('1.5'),
            "ETH": Decimal('10'),
            "SOL": Decimal('100')
        }
        
        response = client.get(
            "/admin/statistic/assets",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_value"] == 1.5*40000 + 10*2500 + 100*100
        assert len(data["assets"]) == 3