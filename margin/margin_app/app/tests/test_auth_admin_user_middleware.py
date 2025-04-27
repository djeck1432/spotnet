"""
Testing module for auth admin user middleware (app.main.auth_admin_user).
"""

import pytest
from fastapi import status, FastAPI, Request

from app.services.auth.base import create_access_token
from app.models.admin import Admin
from app.crud.admin import admin_crud
from app.tests.api.test_admin_api import (
    mock_get_all_admin,
    mock_get_admin_by_email,
    test_admin_object,
)

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
     with(different scenarios).
    """
    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": auth_header_content},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert expected_error_message == response.json().get("detail")


def test_auth_admin_user_middleware_guarded_url_valid_authorization_header(
    client, mock_get_admin_by_email, mock_get_all_admin
):
    """
    Test that middleware works properly when valid authorization header is provided.
    """
    test_token = create_access_token(test_admin_object.get("email"))
    mock_get_admin_by_email.return_value = test_admin_object
    mock_get_all_admin.return_value = [test_admin_object]
    response = client.get(
        API_ADMIN_URL + ADMIN_ROUTE_TO_TEST,
        headers={"Authorization": f"Bearer {test_token}"},
    )
    assert response.status_code == status.HTTP_200_OK
