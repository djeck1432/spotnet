"""
Unit tests for Admin API endpoints using function-based approach without async/await.
"""

import uuid
from unittest.mock import AsyncMock, patch

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


@pytest.fixture
def mock_admin_crud():
    """
    Mock the admin_crud object.
    """
    with patch("app.crud.admin.AdminCRUD", new_callable=AsyncMock) as mock:
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
        mock.return_value = test_admin_object
        yield mock


@pytest.fixture
def mock_get_all_admin():
    """
    Mock the get_objects method of DBConnector to retrieve all admin records.
    """
    with patch("app.crud.base.DBConnector.get_objects", new_callable=AsyncMock) as mock:
        yield mock


@pytest.mark.asyncio
@patch("app.api.common.GetAllMediator.__call__", new_callable=AsyncMock)
async def test_get_all_admins(mock_mediator_call, mock_get_admin_by_email, client):
    """
    Test successfully return all admins using the GetAllMediator.
    """

    admins = [
        {
            "name": f"name{str(i)}",
            "id": str(uuid.uuid4()),
            "email": f"email{str(i)}@test.com",
        }
        for i in range(5)
    ]

    mock_mediator_call.return_value = {"items": admins, "total": len(admins)}
    token = create_access_token(test_admin_object["email"])
    response = client.get(
        ADMIN_URL + "all", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json() == {"items": admins, "total": 5}

    mock_mediator_call.assert_called_once()


@pytest.mark.asyncio
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.get_object", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
async def test_update_admin_success(mock_write_to_db, mock_get_object, mock_get_by_email, client):
    """Test successful admin name update."""

    mock_get_by_email.return_value = test_admin_object
    
    mock_admin = type('MockAdmin', (), {
        'id': test_admin_object['id'],
        'name': test_admin_object['name'],
        'email': test_admin_object['email']
    })()
    mock_get_object.return_value = mock_admin
    
    updated_admin = type('MockAdmin', (), {
        'id': test_admin_object['id'],
        'name': 'Updated Name',
        'email': test_admin_object['email']
    })()
    mock_write_to_db.return_value = updated_admin

    token = create_access_token(test_admin_object["email"])
    response = client.post(
        f"{ADMIN_URL}{test_admin_object['id']}",
        json={"name": "Updated Name"},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["id"] == test_admin_object['id']
    assert data["email"] == test_admin_object['email']


@pytest.mark.asyncio
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.get_object", new_callable=AsyncMock)
async def test_update_admin_not_found(mock_get_object, mock_get_by_email, client):
    """Test update admin when admin not found."""

    mock_get_by_email.return_value = test_admin_object
    mock_get_object.return_value = None

    token = create_access_token(test_admin_object["email"])
    response = client.post(
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
 
    mock_get_email.return_value = test_admin_object
    
    mock_admin = type('MockAdmin', (), {
        'id': test_admin_object['id'],
        'name': test_admin_object['name'],
        'email': test_admin_object['email']
    })()
    mock_get_object.return_value = mock_admin
    mock_write_to_db.return_value = mock_admin

    token = create_access_token(test_admin_object["email"])
    response = client.post(
        f"{ADMIN_URL}{test_admin_object['id']}",
        json={"name": ""},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200