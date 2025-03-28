"""
Unit tests for Admin API endpoints using function-based approach without async/await.
"""

import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.services.auth import create_access_token

ADMIN_URL = "/api/admin/"

test_admin_object = {
    "name": f"test_name",
    "id": str(uuid.uuid4()),
    "email": f"email@test.com",
    "is_super_admin": True,
}


@pytest.fixture
def mock_get_all_admin():
    """
    Mock the get_all method of crud_get_all.
    """
    with patch("app.crud.admin.AdminCRUD.get_all", new_callable=AsyncMock) as mock:
        yield mock


@pytest.fixture
def mock_get_admin_by_email():
    """
    Mock the get_all method of crud_get_all.
    """
    with patch(
        "app.crud.admin.AdminCRUD.get_object_by_field", new_callable=AsyncMock
    ) as mock:
        yield mock


@pytest.mark.parametrize(
    "limit, offset",
    [
        (5, 0),
        (5, 5),
        (5, 10),
    ],
)
def test_get_all_admins(
    client, mock_get_all_admin, mock_get_admin_by_email, limit, offset
):
    """Test successfully return all admins with limit and offset applied."""
    admins = []
    for i in range(10):
        admins.append(
            {
                "name": f"name{str(i)}",
                "id": str(uuid.uuid4()),
                "email": f"email{str(i)}@test.com",
            }
        )

    mock_get_all_admin.return_value = admins[:3]

    test_token = create_access_token(test_admin_object.get("email"))
    mock_get_admin_by_email.return_value = test_admin_object

    response = client.get(
        url=ADMIN_URL + "all" + f"?limit={limit}&offset={offset}",
        headers={"Authorization": f"Bearer {test_token}"},
    )

    assert response.status_code == 200
    assert response.json() == admins[:3]
