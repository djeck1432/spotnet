"""
Test auth services.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch
import uuid
import pytest
import jwt
from app.core.config import settings
from app.services.auth.base import (
    create_access_token,
    get_current_user,
    decode_signup_token,
)
from app.crud.admin import admin_crud
from types import SimpleNamespace

ALGORITHM = settings.algorithm


def make_admin_obj(data):
    """Helper to create admin object for mocking."""
    return SimpleNamespace(**data)


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
        admin_crud, "get_by_email", new_callable=AsyncMock
    ) as get_by_email:
        get_by_email.return_value = return_value

        user = await get_current_user(token)
        assert user == return_value
        get_by_email.assert_awaited_once_with(email)


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
        admin_crud, "get_by_email", new_callable=AsyncMock
    ) as get_by_email:
        get_by_email.return_value = None
        with pytest.raises(Exception, match="User not found"):
            await get_current_user(token)


def test_decode_signup_token_success():
    """Test successfully decoding signup token and extracting email"""
    email = "test@example.com"
    token = create_access_token(email)

    decoded_email = decode_signup_token(token)
    assert decoded_email == email


def test_decode_signup_token_invalid():
    """Test decoding invalid signup token"""
    to_encode = {"exp": datetime.now(timezone.utc) + timedelta(minutes=25)}
    token = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

    with pytest.raises(Exception, match="Invalid token"):
        decode_signup_token(token)


def test_decode_signup_token_expired():
    """Test decoding expired signup token"""
    email = "test@example.com"
    to_encode = {
        "sub": email,
        "exp": datetime.now(timezone.utc) - timedelta(minutes=25),
    }
    token = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

    with pytest.raises(Exception, match="Token expired"):
        decode_signup_token(token)


class TestAdminLogout:
    """Test cases for admin logout endpoint."""

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_successful_logout_clears_refresh_token_cookie_only(
        self, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that admin logout only clears refresh token cookie"""
        admin_email = "admin@test.com"
        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = mock_admin

        access_token = create_access_token(admin_email)

        response = client.post(
            "/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200
        assert response.json() == {"message": "Admin logged out successfully"}

        set_cookie_headers = response.headers.get_list("set-cookie")

        refresh_cookie_cleared = any(
            "refresh_token=" in header
            and ("Max-Age=0" in header or "expires=" in header.lower())
            for header in set_cookie_headers
        )

        access_cookie_cleared = any(
            "access_token=" in header for header in set_cookie_headers
        )

        assert refresh_cookie_cleared, (
            f"Refresh token cookie should be cleared. Headers: {set_cookie_headers}"
        )
        assert not access_cookie_cleared, (
            f"Access token should NOT be in cookies. Headers: {set_cookie_headers}"
        )

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_logout_with_authorization_header_only(
        self, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test logout works with token in Authorization header (normal flow)."""
        admin_email = "admin@test.com"
        access_token = create_access_token(admin_email)

        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = mock_admin

        response = client.post(
            "/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200
        assert response.json() == {"message": "Admin logged out successfully"}

    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_logout_with_admin_from_state(self, mock_get_admin_state, client):
        """Test logout works when admin is already in request state (from middleware)."""
        admin_email = "admin@test.com"
        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = mock_admin

        response = client.post("/api/auth/logout")

        assert response.status_code == 200
        assert response.json() == {"message": "Admin logged out successfully"}

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_logout_uses_secure_cookie_parameters(
        self, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that logout clears refresh token cookie with proper security parameters."""
        admin_email = "admin@test.com"
        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = mock_admin

        access_token = create_access_token(admin_email)

        response = client.post(
            "/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"}
        )

        set_cookie_headers = response.headers.get_list("set-cookie")

        for header in set_cookie_headers:
            if "refresh_token=" in header:
                assert "HttpOnly" in header, f"Cookie should be HttpOnly: {header}"
                assert "Path=/" in header, f"Cookie should have Path=/: {header}"
                assert "SameSite=lax" in header, (
                    f"Cookie should have SameSite=lax: {header}"
                )
                assert "Secure" in header, f"Cookie should be Secure: {header}"

    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_logout_without_authentication_fails(self, mock_get_admin_state, client):
        """Test that logout fails when no Authorization header is provided."""
        mock_get_admin_state.return_value = None

        response = client.post("/api/auth/logout")

        assert response.status_code == 401
        assert "No authentication token found" in response.json()["detail"]

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    @patch("app.api.auth.decode_signup_token")
    def test_logout_with_invalid_token_fails(
        self, mock_decode_token, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that logout fails with invalid authentication token."""
        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = None

        mock_decode_token.side_effect = Exception("Invalid token")

        response = client.post(
            "/api/auth/logout", headers={"Authorization": "Bearer invalid_token"}
        )

        assert response.status_code == 401
        assert "Invalid or expired token" in response.json()["detail"]

    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_logout_with_malformed_authorization_header_fails(
        self, mock_get_admin_state, client
    ):
        """Test that logout fails with malformed Authorization header."""
        mock_get_admin_state.return_value = None

        malformed_headers = [
            {"Authorization": "invalid_format"},
            {"Authorization": "Basic some_token"},
            {"Authorization": "Bearer"},
            {"Authorization": ""},
        ]

        for headers in malformed_headers:
            response = client.post("/api/auth/logout", headers=headers)
            assert response.status_code == 401
            assert "No authentication token found" in response.json()["detail"]

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    @patch("app.api.auth.decode_signup_token")
    def test_logout_with_expired_token_fails(
        self, mock_decode_token, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that logout fails with expired authentication token."""
        mock_get_admin_state.return_value = None

        mock_decode_token.side_effect = Exception("Token expired")

        response = client.post(
            "/api/auth/logout", headers={"Authorization": "Bearer expired_token"}
        )

        assert response.status_code == 401
        assert "Invalid or expired token" in response.json()["detail"]

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    @patch("app.api.auth.decode_signup_token")
    def test_logout_with_token_missing_email_fails(
        self, mock_decode_token, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that logout fails when decoded token doesn't contain email."""
        mock_get_admin_state.return_value = None

        mock_decode_token.return_value = None

        response = client.post(
            "/api/auth/logout", headers={"Authorization": "Bearer token_without_email"}
        )

        assert response.status_code == 401
        assert "Invalid or expired token" in response.json()["detail"]

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    @patch("app.api.auth.decode_signup_token")
    def test_logout_with_nonexistent_admin_fails(
        self, mock_decode_token, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that logout fails when admin doesn't exist in database."""
        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = None
        mock_decode_token.return_value = "nonexistent@admin.com"

        response = client.post(
            "/api/auth/logout", headers={"Authorization": "Bearer valid_token"}
        )

        assert response.status_code == 401
        assert "Admin not found" in response.json()["detail"]

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_subsequent_requests_with_old_tokens_fail_after_logout(
        self, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that after logout, old access tokens cannot be reused for protected endpoints."""
        admin_email = "admin@test.com"
        access_token = create_access_token(admin_email)

        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = mock_admin

        logout_response = client.post(
            "/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"}
        )
        assert logout_response.status_code == 200

        mock_get_by_email.return_value = None

        protected_response = client.get(
            "/api/admin/all", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert protected_response.status_code == 401

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    @patch("app.api.auth.logger")
    def test_logout_logs_success(
        self, mock_logger, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that successful logout is properly logged."""
        admin_email = "admin@test.com"
        access_token = create_access_token(admin_email)

        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = mock_admin

        response = client.post(
            "/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200
        mock_logger.info.assert_called_with(
            f"Admin {admin_email} logged out successfully"
        )

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    def test_refresh_token_cookie_is_removed_on_logout(
        self, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that the refresh_token cookie is specifically removed on logout."""
        admin_email = "admin@test.com"
        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = mock_admin

        access_token = create_access_token(admin_email)

        response = client.post(
            "/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200

        set_cookie_headers = response.headers.get_list("set-cookie")

        refresh_cookie_cleared = any(
            "refresh_token=" in header
            and ("Max-Age=0" in header or "expires=" in header.lower())
            for header in set_cookie_headers
        )

        assert refresh_cookie_cleared, (
            f"refresh_token cookie should be removed. Headers: {set_cookie_headers}"
        )

    def test_logout_endpoint_is_post_not_get(self, client):
        """Test that logout endpoint requires POST method for security."""
        get_response = client.get("/api/auth/logout")
        assert get_response.status_code == 405

        post_response = client.post("/api/auth/logout")
        assert post_response.status_code == 401

    @patch("app.api.auth.admin_crud.get_by_email", new_callable=AsyncMock)
    @patch("app.api.auth.get_admin_user_from_state", new_callable=AsyncMock)
    @patch("app.api.auth.decode_signup_token")
    def test_cookie_is_removed_on_logout(
        self, mock_decode_token, mock_get_admin_state, mock_get_by_email, client
    ):
        """Test that the specific cookies mentioned in task are removed on logout."""
        admin_email = "admin@test.com"
        mock_admin = make_admin_obj(
            {
                "id": "123",
                "email": admin_email,
                "name": "Test Admin",
                "is_super_admin": True,
            }
        )

        mock_get_admin_state.return_value = None
        mock_get_by_email.return_value = mock_admin
        mock_decode_token.return_value = admin_email

        access_token = create_access_token(admin_email)

        response = client.post(
            "/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200

        set_cookie_headers = response.headers.get_list("set-cookie")

        refresh_cookie_cleared = any(
            "refresh_token=" in header
            and ("Max-Age=0" in header or "expires=" in header.lower())
            for header in set_cookie_headers
        )

        assert refresh_cookie_cleared, "refresh_token cookie should be removed"
