"""
Tests for user API endpoints.
"""

from datetime import datetime
import json
import uuid
from decimal import Decimal
from unittest.mock import AsyncMock, patch, MagicMock

from app.models.margin_position import MarginPositionStatus
import pytest
from fastapi import status

from app.schemas.user import UserResponse
from app.crud.user import UserCRUD

USER_URL = "/api/user/"


@pytest.fixture
def mock_get_user():
    """
    Mock the create_user method of crud_create_user.
    """
    with patch(
        "app.crud.user.UserCRUD.get_object_by_field", new_callable=AsyncMock
    ) as mock:
        yield mock


@pytest.fixture
def mock_create_user():
    """
    Mock the create_user method of crud_create_user.
    """
    with patch("app.crud.user.UserCRUD.create_user", new_callable=AsyncMock) as mock:
        yield mock


@pytest.fixture
def mock_create_deposit():
    """
    Mock the create_deposit method of deposit_crud.
    """
    with patch("app.api.user.deposit_crud.create_deposit") as mock:
        yield mock


@pytest.fixture
def mock_add_margin_position():
    """
    Mock the add_margin_position method of UserCRUD.
    """
    with patch.object(UserCRUD, "add_margin_position") as mock:
        yield mock


@pytest.fixture
def mock_get_all():
    """
    Mock the get_all method of crud_create_user.
    """
    with patch("app.crud.user.UserCRUD.get_all", new_callable=AsyncMock) as mock:
        yield mock


def test_create_user_success(client, mock_create_user, mock_get_user):
    """Test successfully creating a user."""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    user_id = uuid.uuid4()

    mock_get_user.return_value = None
    mock_create_user.return_value = UserResponse(
        id=user_id,
        wallet_id=wallet_id,
    )

    response = client.post(USER_URL, json={"wallet_id": f"{wallet_id}"})

    assert response.status_code == status.HTTP_201_CREATED

    assert response.json() == {
        "id": str(user_id),
        "wallet_id": wallet_id,
        "deposit": [],
    }

    mock_create_user.assert_called_once_with(wallet_id)


def test_get_user_by_id(client, mock_get_user):
    """Test found by user_id response"""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    user_id = uuid.uuid4()

    mock_get_user.return_value = UserResponse(
        id=user_id,
        wallet_id=wallet_id,
    )

    response = client.get(USER_URL + "user_id/" + str(user_id))

    assert response.status_code == 200
    assert response.json() == {
        "id": str(user_id),
        "wallet_id": wallet_id,
        "deposit": [],
    }


def test_get_user_by_id_not_found(client):
    """Test not found response"""
    user_id = uuid.uuid4()
    response = client.get(USER_URL + "user_id/" + str(user_id))

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}


def test_get_user_by_wallet_id(client, mock_get_user):
    """Test found by wallet_id response"""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    user_id = uuid.uuid4()

    mock_get_user.return_value = UserResponse(
        id=user_id,
        wallet_id=wallet_id,
    )

    response = client.get(USER_URL + "wallet_id/" + wallet_id)

    assert response.status_code == 200
    assert response.json() == {
        "id": str(user_id),
        "wallet_id": wallet_id,
        "deposit": [],
    }


def test_get_user_by_wallet_id_not_found(client):
    """Test not found response"""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    response = client.get(USER_URL + "wallet_id/" + wallet_id)

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}


def test_create_user_error(client, mock_create_user, mock_get_user):
    """Test error handling when creating a user."""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    mock_create_user.side_effect = Exception("Database error")
    mock_get_user.return_value = None
    response = client.post(USER_URL, json={"wallet_id": wallet_id})

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json() == {"detail": "Something went wrong."}
    mock_create_user.assert_called_once_with(wallet_id)


def test_add_user_deposit_success(client, mock_create_deposit):
    """Test successfully adding a user deposit."""
    user_id = uuid.uuid4()
    deposit_id = uuid.uuid4()

    request_data = {
        "user_id": str(user_id),
        "token": "ETH",
        "amount": "1.5",
        "transaction_id": "0xabcdef1234567890",
    }

    mock_deposit = MagicMock()
    mock_deposit.id = deposit_id
    mock_create_deposit.return_value = mock_deposit

    response = client.post(USER_URL + "add_user_deposit", json=request_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json() == {"deposit_id": str(deposit_id)}
    mock_create_deposit.assert_called_once_with(
        user_id=user_id,
        token="ETH",
        amount=Decimal("1.5"),
        transaction_id="0xabcdef1234567890",
    )


def test_add_user_deposit_error(client, mock_create_deposit):
    """Test error handling when adding a user deposit."""
    user_id = uuid.uuid4()

    request_data = {
        "user_id": str(user_id),
        "token": "ETH",
        "amount": "1.5",
        "transaction_id": "0xabcdef1234567890",
    }

    mock_create_deposit.side_effect = Exception("User not found")

    response = client.post(USER_URL + "add_user_deposit", json=request_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "User not found"}
    mock_create_deposit.assert_called_once()


def test_add_margin_position_success(client, mock_add_margin_position):
    """Test successfully adding a margin position."""
    user_id = uuid.uuid4()
    position_id = uuid.uuid4()
    liquidated_at = datetime.now()
    positionStatus = MarginPositionStatus.OPEN

    request_data = {
        "user_id": str(user_id),
        "borrowed_amount": "100.0",
        "multiplier": 5,
        "token": "BTC",
        "transaction_id": "0x9876543210abcdef",
    }

    mock_position = MagicMock()
    mock_position.id = position_id
    mock_position.user_id = user_id
    mock_position.multiplier = request_data["multiplier"]
    mock_position.borrowed_amount = request_data["borrowed_amount"]
    mock_position.transaction_id = request_data["transaction_id"]
    mock_position.liquidated_at = liquidated_at
    mock_position.status = (positionStatus)    

    mock_add_margin_position.return_value = mock_position

    response = client.post(USER_URL + "add_margin_position", json=request_data)
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json() =={
        "margin_position_id": str(position_id),
        "user_id": str(user_id),
        "multiplier": request_data["multiplier"],
        "borrowed_amount": request_data["borrowed_amount"],
        "transaction_id": request_data["transaction_id"],
        "liquidated_at": (liquidated_at.isoformat()),
        "status": "Open"
        }
    
    mock_add_margin_position.assert_called_once_with(
        user_id=user_id,
        borrowed_amount=Decimal("100.0"),
        multiplier=5,
        transaction_id="0x9876543210abcdef",
    )


def test_add_margin_position_error(client, mock_add_margin_position):
    """Test error handling when adding a margin position."""
    user_id = uuid.uuid4()

    request_data = {
        "user_id": str(user_id),
        "borrowed_amount": "100.0",
        "multiplier": 5,
        "token": "BTC",
        "transaction_id": "0x9876543210abcdef",
    }

    mock_add_margin_position.side_effect = ValueError(
        "Insufficient funds for margin position"
    )

    response = client.post(USER_URL + "add_margin_position", json=request_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Insufficient funds for margin position"}
    mock_add_margin_position.assert_called_once()


def test_create_user_invalid_wallet(client):
    """Test invalid wallet format when creating a user."""

    response = client.post(USER_URL, json={})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_add_user_deposit_invalid_amount(client):
    """Test invalid amount format when adding a user deposit."""
    user_id = uuid.uuid4()

    request_data = {
        "user_id": str(user_id),
        "token": "ETH",
        "amount": "invalid-amount",
        "transaction_id": "0xabcdef1234567890",
    }

    response = client.post(USER_URL + "add_user_deposit", json=request_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_add_margin_position_invalid_multiplier(client):
    """Test invalid multiplier format when adding a margin position."""
    user_id = uuid.uuid4()

    request_data = {
        "user_id": str(user_id),
        "borrowed_amount": "100.0",
        "multiplier": "invalid-multiplier",
        "token": "BTC",
        "transaction_id": "0x9876543210abcdef",
    }

    response = client.post(USER_URL + "add_margin_position", json=request_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_get_all_users(client, mock_get_all):
    """Test successfully return all users with limit and offset applied."""
    users = []
    for i in range(10):
        users.append({
            "wallet_id": str(i),
            "id": str(uuid.uuid4()),
            "deposit": [],
        })
        
    mock_get_all.return_value = {"users": users[:3], "total": 3}  
    response = client.get(USER_URL + "all" + f"?limit=3")
    assert response.status_code == 200
    assert response.json() == {"users": users[:3], "total": 3} 

    mock_get_all.return_value = {"users": users[-3:], "total": 3}  
    response = client.get(USER_URL + "all" + f"?limit=3&offset=7")
    assert response.status_code == 200
    assert response.json() =={"users": users[-3:], "total": 3}
    
    mock_get_all.return_value ={"users":  users[-5:], "total": 5} 
    response = client.get(USER_URL + "all" + f"?offset=5")
    assert response.status_code == 200
    assert response.json() =={"users":  users[-5:], "total": 5} 



def test_get_all_users_invalid_params(client, mock_get_all):
    """Test fails when limit < 1 or offset < 0"""
    invalid_params = [
        {"limit": 0, "offset": 0},
        {"limit": -1, "offset": 0},
        {"limit": 0, "offset": -1},
        {"limit": -1, "offset": -1},
    ]

    for params in invalid_params:
        limit = f"limit={params["limit"]}"
        offset = f"offset={params["offset"]}"
        response = client.get(USER_URL + "all" + f"?{limit}&{offset}")
        assert response.status_code == 422
