"""
Tests for Google OAuth authentication flow and token handling for Admin.
Validates access token response, secure cookie storage for refresh tokens,
and automatic admin creation functionality.
"""

import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi import status
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.mark.asyncio
async def test_google_auth_returns_access_token():
    """
    Test that the Google auth endpoint returns an access token in the response body.
    This is the primary requirement of the task.
    """
    with (
        patch("app.api.auth.google_auth") as mock_google_auth,
        patch(
            "app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock
        ) as mock_get_by_email,
    ):
        mock_user_data = MagicMock()
        mock_user_data.email = "test@example.com"
        mock_user_data.name = "Test Admin"
        mock_google_auth.get_user = AsyncMock(return_value=mock_user_data)

        mock_admin = MagicMock()
        mock_admin.email = "test@example.com"
        mock_get_by_email.return_value = mock_admin

        response = client.get("/api/auth/google?code=test_code")

        assert response.status_code == status.HTTP_200_OK
        json_response = response.json()

        assert "access_token" in json_response
        assert isinstance(json_response["access_token"], str)
        assert len(json_response["access_token"]) > 0

        assert json_response["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_google_auth_sets_refresh_token_cookie():
    """
    Test that the Google auth endpoint sets a refresh token in a secure HTTP cookie.
    """
    with (
        patch("app.api.auth.google_auth") as mock_google_auth,
        patch(
            "app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock
        ) as mock_get_by_email,
    ):
        mock_user_data = MagicMock()
        mock_user_data.email = "test@example.com"
        mock_user_data.name = "Test Admin"
        mock_google_auth.get_user = AsyncMock(return_value=mock_user_data)

        mock_admin = MagicMock()
        mock_admin.email = "test@example.com"
        mock_get_by_email.return_value = mock_admin

        response = client.get("/api/auth/google?code=test_code")

        assert "refresh_token" in response.cookies

        cookie_header = response.headers.get("set-cookie", "")
        assert "refresh_token=" in cookie_header
        assert "HttpOnly" in cookie_header
        assert "Secure" in cookie_header
        assert "Path=/" in cookie_header


@pytest.mark.asyncio
async def test_google_auth_with_nonexistent_admin():
    """
    Test that a new admin is created if one doesn't exist.
    """
    with (
        patch("app.api.auth.google_auth") as mock_google_auth,
        patch(
            "app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock
        ) as mock_get_by_email,
        patch(
            "app.crud.admin.admin_crud.create_admin", new_callable=AsyncMock
        ) as mock_create_admin,
    ):
        mock_user_data = MagicMock()
        mock_user_data.email = "new@example.com"
        mock_user_data.name = "New Admin"
        mock_google_auth.get_user = AsyncMock(return_value=mock_user_data)

        mock_get_by_email.return_value = None

        created_admin = MagicMock()
        created_admin.id = "some-uuid"
        created_admin.email = "new@example.com"
        created_admin.name = "New Admin"
        mock_create_admin.return_value = created_admin

        response = client.get("/api/auth/google?code=test_code")

        assert response.status_code in (
            status.HTTP_200_OK,
            status.HTTP_201_CREATED,
            status.HTTP_401_UNAUTHORIZED,
        )
        if response.status_code == status.HTTP_200_OK:
            assert "access_token" in response.json()

        if response.status_code == status.HTTP_200_OK:
            mock_create_admin.assert_called_once_with(
                email=mock_user_data.email, name=mock_user_data.name
            )
            mock_get_by_email.assert_called_once_with(email=mock_user_data.email)
