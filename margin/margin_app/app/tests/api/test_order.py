"""
Unit tests for Order API endpoints using function-based approach without async/await.
"""

import uuid
from unittest.mock import AsyncMock, MagicMock, patch

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
def mock_update_order():
    """
    Mock the update_order method of order_crud.
    """
    with patch("app.api.order.order_crud.update_order") as mock:
        yield mock


@pytest.fixture
def mock_get_object():
    """Mock for order_crud.get_object method."""
    with patch("app.api.order.order_crud.get_object") as mock:
        yield mock


@pytest.fixture
def mock_get_all():
    """
    Mock the GetAllMediator __call__ method.
    """
    with patch(
        "app.api.common.GetAllMediator.__call__", new_callable=AsyncMock
    ) as mock:
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
    orders = []
    for i in range(10):
        orders.append(
            {
                "id": str(uuid.uuid4()),
                "user_id": str(uuid.uuid4()),
                "price": "100.50",
                "token": "BTC",
                "position": str(uuid.uuid4()),
            }
        )

    mock_get_all.return_value = {"items": orders[:3], "total": 3}

    response = client.get("/order/all?limit=3")
    assert response.status_code == 200
    assert response.json() == {"items": orders[:3], "total": 3}

    mock_get_all.return_value = {"items": orders[-3:], "total": 3}

    response = client.get("/order/all?limit=3&offset=7")
    assert response.status_code == 200
    assert response.json() == {"items": orders[-3:], "total": 3}


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


def test_update_order_success(client, mock_update_order, mock_get_object):
    """Test successful order update."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.price = 150.50
    mock_updated_order.token = "ETH"
    mock_update_order.return_value = mock_updated_order

    update_data = {"price": 150.50, "token": "ETH"}
    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == str(order_id)
    assert data["price"] == "150.5"
    assert data["token"] == "ETH"

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_not_found(client, mock_get_object):
    """Test updating non-existent order."""
    order_id = uuid.uuid4()
    mock_get_object.return_value = None

    update_data = {"price": 150.50}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Order not found" in response.json()["detail"]
    mock_get_object.assert_called_once_with(order_id)


def test_update_order_with_all_fields(client, mock_update_order, mock_get_object):
    """Test updating order with all fields."""
    order_id = uuid.uuid4()
    new_user_id = uuid.uuid4()
    new_position_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.user_id = new_user_id
    mock_updated_order.price = 200.75
    mock_updated_order.token = "BTC"
    mock_updated_order.position = new_position_id

    mock_update_order.return_value = mock_updated_order

    update_data = {
        "user_id": str(new_user_id),
        "price": 200.75,
        "token": "BTC",
        "position": str(new_position_id),
    }

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == str(order_id)
    assert data["user_id"] == str(new_user_id)
    assert data["price"] == "200.75"
    assert data["token"] == "BTC"
    assert data["position"] == str(new_position_id)

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_partial_update(client, mock_update_order, mock_get_object):
    """Test updating order with only some fields."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.price = 99.99
    mock_updated_order.token = "USDC"

    mock_update_order.return_value = mock_updated_order

    update_data = {"price": 99.99, "token": "USDC"}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["price"] == "99.99"
    assert data["token"] == "USDC"

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_invalid_uuid(client):
    """Test updating order with invalid UUID format."""
    invalid_id = "not-a-uuid"

    update_data = {"price": 100.00}

    response = client.post(f"/order/{invalid_id}", json=update_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_update_order_database_error(client, mock_get_object):
    """Test handling database errors during update."""
    order_id = uuid.uuid4()
    mock_get_object.side_effect = SQLAlchemyError("Database connection failed")

    update_data = {"price": 100.00}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    data = response.json()
    assert "Failed to update order" in data["detail"]


def test_update_order_empty_body(client, mock_update_order, mock_get_object):
    """Test updating order with empty request body."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_update_order.return_value = mock_updated_order

    response = client.post(f"/order/{order_id}", json={})

    assert response.status_code == status.HTTP_200_OK

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_invalid_price(client):
    """Test updating order with invalid price format."""
    order_id = uuid.uuid4()

    update_data = {"price": "not-a-number"}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_update_order_zero_price(client, mock_update_order, mock_get_object):
    """Test updating order with zero price."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.price = 0.00

    mock_update_order.return_value = mock_updated_order

    update_data = {"price": 0.00}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["price"] == "0.0"

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_negative_price(client, mock_update_order, mock_get_object):
    """Test updating order with negative price."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.price = -10.50

    mock_update_order.return_value = mock_updated_order

    update_data = {"price": -10.50}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["price"] == "-10.5"

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_very_large_price(client, mock_update_order, mock_get_object):
    """Test updating order with very large price value."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    large_price = 999999999999.99
    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.price = large_price

    mock_update_order.return_value = mock_updated_order

    update_data = {"price": large_price}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["price"] == str(large_price)

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_invalid_user_id(client):
    """Test updating order with invalid user_id format."""
    order_id = uuid.uuid4()

    update_data = {"user_id": "not-a-uuid", "price": 100.00}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_update_order_invalid_position_id(client):
    """Test updating order with invalid position_id format."""
    order_id = uuid.uuid4()

    update_data = {"position": "not-a-uuid", "price": 100.00}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_update_order_empty_token(client, mock_update_order, mock_get_object):
    """Test updating order with empty token string."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.token = ""

    mock_update_order.return_value = mock_updated_order

    update_data = {"token": ""}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["token"] == ""

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()


def test_update_order_long_token_name(client, mock_update_order, mock_get_object):
    """Test updating order with very long token name."""
    order_id = uuid.uuid4()

    existing_order = create_mock_order()
    existing_order.id = order_id
    mock_get_object.return_value = existing_order

    long_token = "A" * 100
    mock_updated_order = create_mock_order()
    mock_updated_order.id = order_id
    mock_updated_order.token = long_token

    mock_update_order.return_value = mock_updated_order

    update_data = {"token": long_token}

    response = client.post(f"/order/{order_id}", json=update_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["token"] == long_token

    mock_get_object.assert_called_once_with(order_id)
    mock_update_order.assert_called_once()
