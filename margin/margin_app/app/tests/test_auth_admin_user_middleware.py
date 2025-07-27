"""
Test suite for admin authentication middleware.
Covers all scenarios: missing/invalid/expired/malformed tokens, user not found, DB errors,
case-insensitive Bearer, unguarded routes, and all admin paths.
"""

import pytest
from unittest.mock import AsyncMock, patch
from fastapi import status

from app.services.auth.base import create_access_token
from app.tests.api.test_admin_api import (
    test_admin_object,
)
from types import SimpleNamespace

API_ADMIN_URL = "/api/admin"
ADMIN_ROUTE_TO_TEST = "/all"


def test_auth_admin_user_middleware_not_guarded_url(client):
    """
    Test that not guarded URL works without admin user authentication.
    """
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK


def test_auth_admin_user_middleware_guarded_url_missing_authorization_header(client):
    """
    Test that guarded URL return UNAUTHORIZED status code when missing authorization header.
    """
    response = client.get(API_ADMIN_URL + ADMIN_ROUTE_TO_TEST)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Missing authorization header." == response.json().get("detail")


@pytest.mark.parametrize(
    "auth_header_content, expected_error_message",
    [
        ("", "Missing authorization header."),
        ("gibberish", "Invalid authorization header format."),
        ("gibberish gibberish_token", "Invalid authentication scheme."),
        ("Bearer gibberish_token", "Authentication error."),
    ],
)
def test_auth_admin_user_middleware_guarded_url_invalid_authorization_header(
    client, auth_header_content, expected_error_message
):
    """
    Test that guarded URL return UNAUTHORIZED status code when authorization header is invalid
    with different scenarios.
    """
    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": auth_header_content},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert expected_error_message == response.json().get("detail")


@pytest.mark.asyncio
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
async def test_auth_admin_user_middleware_guarded_url_valid_authorization_header(
    mock_get_by_email, client
):
    """
    Test that guarded URL returns success with valid authorization header.
    """
    from app.services.auth.base import create_access_token

    test_email = "test@admin.com"
    test_token = create_access_token(test_email)
    mock_admin = SimpleNamespace(
        id="1", email=test_email, name="Test Admin", is_super_admin=True
    )
    mock_get_by_email.return_value = mock_admin

    response = client.get(
        "/api/admin/all",
        headers={"Authorization": f"Bearer {test_token}"},
    )
    assert response.status_code in (200, 201)


@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
def test_auth_admin_user_middleware_user_not_found(mock_get_admin_by_email, client):
    """
    Test that middleware returns authentication error when user is not found in database.
    """
    test_token = create_access_token("nonexistent@test.com")
    mock_get_admin_by_email.return_value = None

    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": f"Bearer {test_token}"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authentication error." == response.json().get("detail")


def test_auth_admin_user_middleware_expired_token(client):
    """
    Test that middleware returns authentication error when token is expired.
    """
    import jwt
    from datetime import datetime, timedelta, timezone
    from app.core.config import settings

    expire = datetime.now(timezone.utc) - timedelta(minutes=1)  # Expired 1 minute ago
    to_encode = {"sub": test_admin_object.get("email"), "exp": expire}
    expired_token = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.algorithm
    )

    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authentication error." == response.json().get("detail")


def test_auth_admin_user_middleware_malformed_token(client):
    """
    Test that middleware returns authentication error when token is malformed.
    """
    malformed_token = "invalid.jwt.token"

    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": f"Bearer {malformed_token}"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authentication error." == response.json().get("detail")


@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
def test_auth_admin_user_middleware_database_error(mock_get_admin_by_email, client):
    """
    Test that middleware handles database errors gracefully.
    """
    test_token = create_access_token(test_admin_object.get("email"))
    mock_get_admin_by_email.side_effect = Exception("Database connection error")

    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": f"Bearer {test_token}"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authentication error." == response.json().get("detail")


def test_auth_admin_user_middleware_case_insensitive_bearer(client):
    """
    Test that middleware works with case-insensitive Bearer scheme.
    """
    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": "bearer some_token"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authentication error." == response.json().get("detail")


def test_auth_admin_user_middleware_multiple_paths_covered(client):
    """
    Test that middleware only affects /api/admin paths and not other admin-related paths.
    """
    response = client.get("/api/admin/all")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.parametrize(
    "test_path",
    [
        "/api/admin",
        "/api/admin/",
        "/api/admin/all",
        "/api/admin/123e4567-e89b-12d3-a456-426614174000",
        "/api/admin/add",
    ],
)
def test_auth_admin_user_middleware_covers_all_admin_paths(client, test_path):
    """
    Test that middleware protects all admin API paths.
    """
    response = client.get(test_path)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Missing authorization header." == response.json().get("detail")
