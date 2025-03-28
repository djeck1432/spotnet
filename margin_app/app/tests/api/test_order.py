"""
Unit tests for Order API endpoints using function-based approach without async/await.
"""

import uuid
from unittest.mock import AsyncMock, MagicMock, patch

from app.schemas.order import UserOrderGetAllResponse
import pytest
from fastapi import FastAPI, status
from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError

from app.api.order import router
from app.models.user_order import UserOrder


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


@pytest.fixture
def mock_get_all():
    """
    Mock the get_all method of order_crud.
    """
    with patch("app.crud.order.order_crud.get_all", new_callable=AsyncMock) as mock:
        yield mock


def create_mock_order():
    """Helper function to create a mock Order instance"""
    order_id = uuid.uuid4()
    user_id = uuid.uuid4()
    position_id = uuid.uuid4()

    mock_order = MagicMock(spec=UserOrder)
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



def test_get_all_orders_success(client, mock_get_all):
    """Test get_all_orders successfully return all orders and total count"""
    total = 10
    orders = []
    for i in range(total):
        orders.append(
            {
                "id": str(uuid.uuid4()),
                "user_id": str(uuid.uuid4()),
                "price": "100.50",
                "token": "BTC",
                "position": str(uuid.uuid4()),
            }
        )
    mock_get_all.return_value = {"orders": orders, "total": total}
    response = client.get("/order/get_all_orders")
    assert response.status_code == 200
    assert response.json() == {"orders": orders, "total": total}


def test_get_order_success(client, mock_get_order):
    """Test successful order retrieval."""
    mock_order = create_mock_order()
    mock_get_order.return_value = mock_order

    response = client.get(f"/order/{mock_order.id}")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == str(mock_order.id)
    assert data["price"] == str(mock_order.price)
    assert data["token"] == mock_order.token
    mock_get_order.assert_called_once_with(mock_order.id)


def test_get_order_not_found(client, mock_get_order):
    """Test order retrieval when order doesn't exist."""
    mock_get_order.return_value = None
    order_id = uuid.uuid4()

    response = client.get(f"/order/{order_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Order not found" in response.json()["detail"]


def test_get_order_invalid_id(client):
    """Test order retrieval with invalid UUID."""
    response = client.get("/order/not-a-uuid")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.fixture
def mock_get_order():
    """Mock for order_crud.get_by_id method."""
    with patch("app.api.order.order_crud.get_by_id") as mock:
        yield mock
