"""
Tests for margin position API endpoints.
"""

import uuid
from unittest.mock import patch

import pytest

from app.models import MarginPosition
from app.models.margin_position import MarginPositionStatus
from app.schemas.margin_position import MarginPositionResponse

MARGIN_POSITION_URL = "api/margin"


@pytest.fixture
def mock_open_margin_position():
    """
    Mock the open_margin_position method of margin_position_crud.
    """
    with patch(
        "app.api.margin_position.margin_position_crud.open_margin_position"
    ) as mock:
        yield mock


@pytest.fixture
def mock_close_margin_position():
    """
    Mock the close_margin_position method of margin_position_crud.
    """
    with patch(
        "app.api.margin_position.margin_position_crud.close_margin_position"
    ) as mock:
        yield mock


@pytest.fixture
def valid_position_data():
    """
    Create valid position data for testing.
    """
    return {
        "user_id": str(uuid.uuid4()),
        "borrowed_amount": 1000.00,
        "multiplier": 5,
        "transaction_id": "txn_123456789",
    }


@pytest.fixture
def mock_get_object():
    """
    Mock the get_object method of margin_position_crud.
    """
    with patch("app.api.margin_position.margin_position_crud.get_object") as mock:
        yield mock


def test_open_margin_position_success(
    client, valid_position_data, mock_open_margin_position
):
    """Test successfully opening a margin position."""
    data = valid_position_data
    valid_position_response = MarginPositionResponse(
        id=str(uuid.uuid4()), status="Open", liquidated_at=None, **data
    )
    mock_open_margin_position.return_value = valid_position_response

    response = client.post(MARGIN_POSITION_URL + "/open", json=data)
    assert response.status_code == 200
    assert response.json()["user_id"] == data["user_id"]
    assert response.json()["borrowed_amount"] == str(data["borrowed_amount"])
    assert response.json()["multiplier"] == data["multiplier"]
    assert response.json()["status"] == "Open"
    mock_open_margin_position.assert_called_once()


def test_close_margin_position_success(client, mock_close_margin_position):
    """Test successfully closing a margin position."""
    position_id = uuid.uuid4()
    mock_close_margin_position.return_value = MarginPositionStatus.CLOSED

    response = client.post(f"{MARGIN_POSITION_URL}/close/{position_id}")

    assert response.status_code == 200
    assert response.json()["position_id"] == str(position_id)
    assert response.json()["status"] == "Closed"
    mock_close_margin_position.assert_called_once_with(position_id)


def test_open_margin_position_invalid_data(client):
    """Test opening a margin position with invalid data."""
    invalid_data = {
        # Missing user_id
        "borrowed_amount": 1000.00,
        "multiplier": 5,
        "transaction_id": "txn_123456789",
    }

    response = client.post(MARGIN_POSITION_URL + "/open", json=invalid_data)

    assert response.status_code == 422


def test_open_margin_position_invalid_multiplier(client, mock_open_margin_position):
    """Test opening a margin position with an invalid multiplier (outside range 1-20)."""
    invalid_data = {
        "user_id": str(uuid.uuid4()),
        "borrowed_amount": 1000.00,
        "multiplier": 25,
        "transaction_id": "txn_123456789",
    }

    mock_open_margin_position.side_effect = ValueError(
        "Multiplier must be between 1 and 20"
    )

    response = client.post(MARGIN_POSITION_URL + "/open", json=invalid_data)

    assert response.status_code == 400
    assert "Multiplier" in response.json()["detail"]
    mock_open_margin_position.assert_called_once()


def test_close_margin_position_not_found(client, mock_close_margin_position):
    """Test closing a non-existent margin position."""
    position_id = uuid.uuid4()
    mock_close_margin_position.return_value = None

    response = client.post(f"{MARGIN_POSITION_URL}/close/{position_id}")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
    mock_close_margin_position.assert_called_once_with(position_id)


def test_close_margin_position_invalid_uuid(client):
    """Test closing a margin position with invalid UUID format."""
    invalid_id = "not-a-uuid"

    response = client.post(f"{MARGIN_POSITION_URL}/close/{invalid_id}")

    assert response.status_code == 422


def test_get_margin_by_id_success(client, valid_position_data, mock_get_object):
    """Test successfully getting a margin position by ID."""

    position_id = uuid.uuid4()
    data = valid_position_data
    valid_position_response = MarginPositionResponse(
        id=position_id, status="Open", liquidated_at=None, **data
    )
    mock_get_object.return_value = valid_position_response

    response = client.get(f"{MARGIN_POSITION_URL}/{position_id}")

    assert response.status_code == 200
    assert response.json()["id"] == str(position_id)
    assert response.json()["status"] == "Open"
    assert response.json()["borrowed_amount"] == str(1000.00)
    assert response.json()["multiplier"] == 5
    assert response.json()["liquidated_at"] is None

    mock_get_object.assert_called_once_with(position_id)


def test_get_margin_by_id_not_found(client, mock_get_object):
    """Test getting a non-existent margin position by ID."""
    position_id = uuid.uuid4()
    mock_get_object.return_value = None

    response = client.get(f"{MARGIN_POSITION_URL}/{position_id}")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

    mock_get_object.assert_called_once_with(position_id)


def test_get_margin_by_id_invalid_uuid(client):
    """Test getting a margin position with invalid UUID format."""
    invalid_id = "not-a-uuid"

    response = client.get(f"{MARGIN_POSITION_URL}/{invalid_id}")

    assert response.status_code == 422
    assert "Input should be a valid UUID" in response.json()["detail"][0]["msg"]
