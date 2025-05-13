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
async def test_get_all_admins(mock_mediator_call, client):
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
