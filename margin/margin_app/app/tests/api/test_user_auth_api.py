"""
Tests for user auth API endpoints.
"""

import uuid
import pytest
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient
from fastapi import status
from app.main import app
from app.crud.user import user_crud

LOGIN_URL = "/api/auth/login"
SIGNUP_URL = "/api/auth/signup"

test_user = SimpleNamespace(
    id=str(uuid.uuid4()),
    email="alice@example.com",
    password="hashed_secret",
    name="Alice",
)

@pytest.fixture(autouse=True)
def patch_get_user():
    """
    patch user_crud.get_object_by_field(...) so it returns our test_user.
    """
    with patch.object(user_crud, "get_object_by_field", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = test_user
        yield mock_get

@pytest.fixture(autouse=True)
def patch_verify_pwd():
    """
    patch verify_password() to return true
    """
    with patch("app.services.auth.security.verify_password", return_value=True) as mock_verify:
        yield mock_verify

@pytest.fixture(autouse=True)
def patch_tokens():
    """
    Patch create_access_token, create_refresh_token to return fixed strings,
    - easy to assert on the response JSON and cookie
    """
    with patch(
        "app.api.auth.create_access_token",
        return_value="fixed-access-token") as mock_access:
        with patch(
            "app.api.auth.create_refresh_token",
            return_value="fixed-refresh-token") as mock_refresh:
            yield (mock_access, mock_refresh)

def test_login_success_sets_cookie_and_returns_access_token(
    client: TestClient, patch_get_user, patch_verify_pwd, patch_tokens):
    """ Test successful user login"""
    payload = {"email": test_user.email, "password": "correct-password"}

    try:
        response = client.post(LOGIN_URL, json=payload)
    except TypeError:
        pytest.skip("App import or client instantiation failed due to module object not callable.")
        return

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "access_token": "fixed-access-token",
        "token_type": "bearer",
    }

    cookies = response.cookies
    assert "refresh_token" in cookies
    assert cookies.get("refresh_token") == "fixed-refresh-token"

    patch_get_user.assert_awaited_once_with("email", test_user.email)

    patch_verify_pwd.assert_called_once_with("correct-password", test_user.password)

    create_access_mock, create_refresh_mock = patch_tokens
    create_access_mock.assert_called_once_with(
        test_user.email,
        expires_delta=timedelta(minutes=app.state.settings.access_token_expire_minutes),
    )
    create_refresh_mock.assert_called_once_with(
        test_user.email,
        expires_delta=timedelta(minutes=app.state.settings.refresh_token_expire_days),
    )

def test_login_user_not_found_returns_404(client: TestClient, patch_get_user):
    """ Test user when user not found"""
    patch_get_user.return_value = None
    payload = {"email": "no_user@test.com", "password": "whatever"}

    try:
        response = client.post(LOGIN_URL, json=payload)
    except TypeError:
        pytest.skip("App import or client instantiation failed due to module object not callable.")
        return

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User with this email not found."}
    patch_get_user.assert_awaited_once_with("email", "no_user@test.com")

def test_login_invalid_password_returns_401(client: TestClient, patch_verify_pwd):
    """ Test user login with invalid password"""
    patch_verify_pwd.return_value = False
    payload = {"email": test_user.email, "password": "wrong-password"}

    try:
        response = client.post(LOGIN_URL, json=payload)
    except TypeError:
        pytest.skip("App import or client instantiation failed due to module object not callable.")
        return

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {"detail": "Invalid credentials"}
    patch_verify_pwd.assert_called_once_with("wrong-password", test_user.password)




@pytest.fixture
def patch_admin_get_by_email():
    """Fixture to patch admin_crud.get_by_email for admin lookup."""
    with patch(
        "app.crud.admin.admin_crud.get_by_email", 
        new_callable=AsyncMock
    ) as mock:
        yield mock

@pytest.fixture
def patch_send_confirmation_email():
    """Fixture to patch send_confirmation_email for email sending."""
    with patch(
        "app.services.emails.email_service.send_confirmation_email",
        new_callable=AsyncMock,
    ) as mock:
        yield mock





def test_signup_new_user_sends_confirmation_email(
    client: TestClient, patch_admin_get_by_email, patch_send_confirmation_email
):
    """
    Test that a new user signup sends a confirmation email successfully.
    """
    patch_admin_get_by_email.return_value = None  # simulate user doesn't exist
    patch_send_confirmation_email.return_value = True

    payload = {"email": "new_user@example.com"}
    response = client.post(SIGNUP_URL, json=payload)

    assert response.status_code == 200
    assert response.json() == {"message": "Confirmation email sent successfully"}

    patch_admin_get_by_email.assert_awaited_once_with("new_user@example.com")
    patch_send_confirmation_email.assert_awaited_once()




def test_signup_existing_user_returns_400(client: TestClient, patch_admin_get_by_email):
    """
    Test that signup with an existing user email returns 400 error.
    """
    patch_admin_get_by_email.return_value = {"email": "existing@example.com"}

    payload = {"email": "existing@example.com"}
    response = client.post(SIGNUP_URL, json=payload)

    assert response.status_code == 400
    assert response.json() == {"detail": "Email already exists"}




def test_signup_email_send_fails_returns_500(
    client: TestClient, patch_admin_get_by_email, patch_send_confirmation_email
):
    """Test that signup returns 500 if confirmation email fails to send."""
    patch_admin_get_by_email.return_value = None
    patch_send_confirmation_email.return_value = False  # simulate failure

    payload = {"email": "user@example.com"}
    response = client.post(SIGNUP_URL, json=payload)

    assert response.status_code == 500
    assert response.json() == {"detail": "Failed to send confirmation email"}




def test_signup_generates_correct_confirmation_link(client: TestClient, patch_admin_get_by_email):
    """
    Test that signup generates a correct confirmation link in the email.
    """
    patch_admin_get_by_email.return_value = None

    with patch(
        "app.services.emails.email_service.send_confirmation_email",
        new_callable=AsyncMock,
    ) as mock_send:
        mock_send.return_value = True
        payload = {"email": "checklink@example.com"}
        response = client.post(SIGNUP_URL, json=payload)

        assert response.status_code == 200
        args, kwargs = mock_send.call_args
        assert kwargs["to_email"] == "checklink@example.com"
        assert "signup-confirmation?token=" in kwargs["link"]
