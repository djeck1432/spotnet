"""Tests for auth API."""
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from app.main import app

client = TestClient(app)


@pytest.mark.asyncio
@patch("app.services.auth.base.decode_signup_token", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
@patch("app.services.auth.security.get_password_hash", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.write_to_db", new_callable=AsyncMock)
async def test_reset_password_success(
    mock_write_to_db,
    mock_get_password_hash,
    mock_get_by_email,
    mock_decode_token,
):
    """
    Test successful password reset.
    """
    mock_decode_token.return_value = "test@example.com"
    mock_get_by_email.return_value = {"email": "test@example.com"}
    mock_get_password_hash.return_value = "hashed_password"

    response = client.post(
        "/api/auth/reset_password",
        json={"token": "valid_token", "new_password": "new_password123"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Password was changed successfully"}
    mock_write_to_db.assert_called_once()


@pytest.mark.asyncio
@patch("app.services.auth.base.decode_signup_token", new_callable=AsyncMock)
async def test_reset_password_invalid_token(mock_decode_token):
    """
    Test password reset with an invalid token.
    """
    mock_decode_token.side_effect = Exception("Invalid token")

    response = client.post(
        "/api/auth/reset_password",
        json={"token": "invalid_token", "new_password": "new_password123"},
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid token" in response.json()["detail"]


@pytest.mark.asyncio
@patch("app.api.auth.decode_signup_token", new_callable=AsyncMock)
@patch("app.crud.admin.admin_crud.get_by_email", new_callable=AsyncMock)
async def test_reset_password_admin_not_found(
    mock_get_by_email,
    mock_decode_token,
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