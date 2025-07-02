"""
Unit tests for Admin API endpoints using function-based approach without async/await.
"""

import uuid
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace

import pytest
from fastapi import status
from app.services.auth.base import create_access_token

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
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Admin not found."


@pytest.mark.asyncio
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.get_object", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
async def test_update_admin_empty_name(mock_write_to_db, mock_get_object, mock_get_email, client):
    """Test update admin with empty name."""
  
    mock_get_email.return_value = make_admin_obj(test_admin_object)
    
    mock_admin = make_admin_obj(test_admin_object)
    mock_get_object.return_value = mock_admin
    mock_write_to_db.return_value = mock_admin

    token = create_access_token(test_admin_object["email"])
    response = client.put(
        f"{ADMIN_URL}{test_admin_object['id']}",
        json={"name": ""},
        headers={"Authorization": f"Bearer {token}"}
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


# Tests for the new asset statistics endpoint
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
@patch("app.contract_tools.mixins.admin.AdminMixin.get_asset_statistics", new_callable=AsyncMock)
def test_get_asset_statistics_success(
    mock_get_asset_statistics, mock_get_admin_user, mock_get_by_email, client
):
    """
    Test successful retrieval of asset statistics.
    """
    # Mock middleware authentication (admin_crud.get_by_email)
    mock_get_by_email.return_value = make_admin_obj(test_admin_object)
    
    # Mock admin authentication
    mock_get_admin_user.return_value = make_admin_obj(test_admin_object)
    
    # Mock asset statistics data
    mock_asset_data = [
        {
            "token": "ETH",
            "total_amount": "15.5",
            "total_value": "31000.0"
        },
        {
            "token": "STRK", 
            "total_amount": "100.0",
            "total_value": "150.0"
        }
    ]
    mock_get_asset_statistics.return_value = mock_asset_data
    
    token = create_access_token(test_admin_object["email"])
    response = client.get(
        ADMIN_URL + "statistic/assets",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    response_data = response.json()
    assert "assets" in response_data
    assert "total_portfolio_value" in response_data
    assert len(response_data["assets"]) == 2
    assert response_data["total_portfolio_value"] == "31150.0"  # 31000 + 150


@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
def test_get_asset_statistics_unauthorized(mock_get_admin_user, client):
    """
    Test that unauthenticated users cannot access asset statistics.
    """
    mock_get_admin_user.return_value = None
    
    token = create_access_token("nouser@example.com")
    response = client.get(
        ADMIN_URL + "statistic/assets",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication error."


@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
@patch("app.contract_tools.mixins.admin.AdminMixin.get_asset_statistics", new_callable=AsyncMock)
def test_get_asset_statistics_empty_data(
    mock_get_asset_statistics, mock_get_admin_user, mock_get_by_email, client
):
    """
    Test asset statistics endpoint with no data available.
    """
    # Mock middleware authentication
    mock_get_by_email.return_value = make_admin_obj(test_admin_object)
    
    mock_get_admin_user.return_value = make_admin_obj(test_admin_object)
    mock_get_asset_statistics.return_value = []
    
    token = create_access_token(test_admin_object["email"])
    response = client.get(
        ADMIN_URL + "statistic/assets",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["assets"] == []
    assert response_data["total_portfolio_value"] == "0"


@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
@patch("app.contract_tools.mixins.admin.AdminMixin.get_asset_statistics", new_callable=AsyncMock)
def test_get_asset_statistics_error_handling(
    mock_get_asset_statistics, mock_get_admin_user, mock_get_by_email, client
):
    """
    Test asset statistics endpoint error handling.
    """
    # Mock middleware authentication
    mock_get_by_email.return_value = make_admin_obj(test_admin_object)
    
    mock_get_admin_user.return_value = make_admin_obj(test_admin_object)
    mock_get_asset_statistics.side_effect = Exception("Database connection failed")
    
    token = create_access_token(test_admin_object["email"])
    response = client.get(
        ADMIN_URL + "statistic/assets",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 500
    assert "Error calculating asset statistics" in response.json()["detail"]


@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.api.admin.get_admin_user_from_state", new_callable=AsyncMock)
@patch("app.contract_tools.mixins.admin.AdminMixin.get_asset_statistics", new_callable=AsyncMock)
def test_get_asset_statistics_single_token(
    mock_get_asset_statistics, mock_get_admin_user, mock_get_by_email, client
):
    """
    Test asset statistics with a single token.
    """
    # Mock middleware authentication
    mock_get_by_email.return_value = make_admin_obj(test_admin_object)
    
    mock_get_admin_user.return_value = make_admin_obj(test_admin_object)
    
    mock_asset_data = [
        {
            "token": "ETH",
            "total_amount": "10.0", 
            "total_value": "20000.0"
        }
    ]
    mock_get_asset_statistics.return_value = mock_asset_data
    
    token = create_access_token(test_admin_object["email"])
    response = client.get(
        ADMIN_URL + "statistic/assets",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data["assets"]) == 1
    assert response_data["assets"][0]["token"] == "ETH"
    assert response_data["assets"][0]["total_amount"] == "10.0"
    assert response_data["assets"][0]["total_value"] == "20000.0"
    assert response_data["total_portfolio_value"] == "20000.0"


def test_get_asset_statistics_no_auth_header(client):
    """
    Test asset statistics endpoint without authorization header.
    """
    response = client.get(ADMIN_URL + "statistic/assets")
    
    # Should return 401 or 422 depending on auth middleware implementation
    assert response.status_code in [401, 422]
