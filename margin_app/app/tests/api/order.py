"""
Unit tests for Order API endpoints using function-based approach without async/await.
"""

import uuid
from unittest.mock import MagicMock, patch

import pytest
from fastapi import FastAPI, status
from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError

from app.api.order import router
from app.models.order import Order


@pytest.fixture
def app():
    """
    Create a FastAPI app for testing.
    """
    test_app = FastAPI()
    test_app.include_router(router, prefix="/order")
    return test_app


@pytest.fixture
def client(app):
    """
    Create a test client for the app.
    """
    return TestClient(app)


@pytest.fixture
def mock_add_new_order():
    """
    Mock the add_new_order method of order_crud.
    """
    with patch("app.api.order.order_crud.add_new_order") as mock:
        yield mock


def create_mock_order():
    """Helper function to create a mock Order instance"""
    order_id = uuid.uuid4()
    user_id = uuid.uuid4()
    position_id = uuid.uuid4()

    mock_order = MagicMock(spec=Order)
    mock_order.id = order_id
    mock_order.user_id = user_id
    mock_order.price = 100.50
    mock_order.token = "BTC"
    mock_order.position = position_id

    return mock_order


def test_create_order_success(client, mock_add_new_order):
    """Test successful order creation"""
    mock_order = create_mock_order()
    mock_add_new_order.return_value = mock_order

    response = client.post(
        "/order/create_order",
        json={
            "user_id": str(mock_order.user_id),
            "price": mock_order.price,
            "token": mock_order.token,
            "position": str(mock_order.position),
        },
    )

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["price"] == str(mock_order.price)
    assert data["token"] == mock_order.token
    assert data["user_id"] == str(mock_order.user_id)
    assert data["position"] == str(mock_order.position)

    mock_add_new_order.assert_called_once_with(
        user_id=mock_order.user_id,
        price=mock_order.price,
        token=mock_order.token,
        position=mock_order.position,
    )


def test_create_order_invalid_data(client, mock_add_new_order):
    """Test order creation with invalid data"""
    response = client.post(
        "/order/create_order",
        json={
            "user_id": "not-a-uuid",
            "price": 100.50,
            "token": "BTC",
            "position": str(uuid.uuid4()),
        },
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    data = response.json()
    assert "detail" in data


def test_create_order_database_error(client, mock_add_new_order):
    """Test order creation with database error"""
    mock_add_new_order.side_effect = SQLAlchemyError("Database error")
    user_id = uuid.uuid4()
    position_id = uuid.uuid4()

    response = client.post(
        "/order/create_order",
        json={
            "user_id": str(user_id),
            "price": 100.50,
            "token": "BTC",
            "position": str(position_id),
        },
    )

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    data = response.json()
    assert "detail" in data
    assert "Failed to create order" in data["detail"]
