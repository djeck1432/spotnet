"""Tests for auth API."""
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock

from app.main import app
from jwt.exceptions import InvalidTokenError

client = TestClient(app)


@pytest.mark.asyncio
@patch("app.api.auth.admin_crud.write_to_db", new_callable=AsyncMock)
@patch("app.api.auth.get_password_hash")
@patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.api.auth.decode_signup_token")
async def test_reset_password_success(
    mock_decode_token,
    mock_get_by_email,
    mock_get_password_hash,
    mock_write_to_db,
):
    """
    Test successful password reset.
    """
    mock_decode_token.return_value = "test@example.com"

    mock_admin_instance = MagicMock()
    mock_admin_instance.email = "test@example.com"
    mock_get_by_email.return_value = mock_admin_instance

    mock_get_password_hash.return_value = "hashed_password"

    response = client.post(
        "/api/auth/reset_password",
        json={"token": "valid_token", "new_password": "new_password123"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Password was changed successfully"}

    mock_write_to_db.assert_called_once_with(mock_admin_instance)
    assert mock_admin_instance.password == "hashed_password"


@pytest.mark.asyncio
@patch("app.api.auth.decode_signup_token")
async def test_reset_password_invalid_token(mock_decode_token):
    """
    Test password reset with an invalid token.
    """
    mock_decode_token.side_effect = InvalidTokenError("Custom invalid token message")

    response = client.post(
        "/api/auth/reset_password",
        json={"token": "invalid_token", "new_password": "new_password123"},
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid token: Custom invalid token message" in response.json()["detail"]


@pytest.mark.asyncio
@patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.api.auth.decode_signup_token")
async def test_reset_password_admin_not_found(
    mock_decode_token,
    mock_get_by_email,
):
    """
    Test password reset for a non-existent admin.
    """
    mock_decode_token.return_value = "nonexistent@example.com"
    mock_get_by_email.return_value = None

    response = client.post(
        "/api/auth/reset_password",
        json={"token": "valid_token", "new_password": "new_password123"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Admin with this email was not found" in response.json()["detail"]