"""
Unit tests for the FastAPI referral link creation endpoint.

Tests include:
- Successful creation of a referral link with a valid wallet ID.
- Missing wallet ID in the request.
- User not found in the database.

Uses pytest, unittest.mock for mocking, and FastAPI's TestClient for testing the API.
"""

import pytest
from fastapi.testclient import TestClient

from web_app.db.crud import UserDBConnector
from web_app.api.referal import app


@pytest.fixture
def client():
    """
    Returns a TestClient for the FastAPI app.
    """
    return TestClient(app)


@pytest.fixture
def mock_get_user_by_wallet_id(mocker):
    """
    Mocks the UserDBConnector's method for fetching a user by wallet_id.
    """
    return mocker.patch.object(UserDBConnector, "get_user_by_wallet_id")


def test_create_referral_link_for_existing_user(client, mock_get_user_by_wallet_id):
    """Positive Test Case: Test referral link creation for an existing user"""
    mock_get_user_by_wallet_id.return_value = {"wallet_id": "valid_wallet_id"}
    response = client.get("/api/create_referal_link?wallet_id=valid_wallet_id")

    assert response.status_code == 200
    assert "wallet_id" in response.json()
    assert "referral_code" in response.json()
    assert len(response.json()["referral_code"]) == 16


def test_create_referral_link_for_non_existent_user(client, mock_get_user_by_wallet_id):
    """Negative Test Case: Test referral link creation for a non-existent user"""
    mock_get_user_by_wallet_id.return_value = None
    response = client.get("/api/create_referal_link?wallet_id=non_existent_wallet_id")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "User with the provided wallet_id does not exist"
    }


def test_create_referral_link_with_empty_wallet_id(client):
    """Negative Test Case: Test referral link creation with an empty wallet ID"""
    response = client.get("/api/create_referal_link?wallet_id=")

    assert response.status_code == 400
    assert response.json() == {"detail": "Wallet ID cannot be empty"}


def test_create_referral_link_with_malformed_wallet_id(
    client, mock_get_user_by_wallet_id
):
    """Test referral link creation with malformed wallet ID"""
    mock_get_user_by_wallet_id.return_value = None
    response = client.get("/api/create_referal_link?wallet_id=@@!invalidwallet")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "User with the provided wallet_id does not exist"
    }


def test_create_referral_link_for_multiple_users(client, mock_get_user_by_wallet_id):
    """Test referral link creation with a random referral code for multiple users"""
    mock_get_user_by_wallet_id.return_value = {"wallet_id": "valid_wallet_id"}
    response1 = client.get("/api/create_referal_link?wallet_id=valid_wallet_id")
    referral_code1 = response1.json()["referral_code"]
    response2 = client.get("/api/create_referal_link?wallet_id=valid_wallet_id")
    referral_code2 = response2.json()["referral_code"]

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert referral_code1 != referral_code2


