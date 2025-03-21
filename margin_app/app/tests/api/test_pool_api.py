"""The module contains tests for `margin_app/app/api/pools.py`"""

import uuid
from http import HTTPStatus
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient
from starlette import status

from app.schemas.pools import (
    PoolResponse,
    PoolRiskStatus,
    UserPoolResponse,
    UserPoolUpdateResponse,
)

POOL_URL = "api/pool"


def test_create_pool(client):
    """
    Test the create_pool endpoint.

    This test patches the create_pool CRUD function to return a mocked PoolResponse.
    It sends a POST request with query parameters and verifies that the response returns
    the expected 'name' value and a 201 status code.
    """
    with patch(
        "app.crud.pool.pool_crud.create_pool", new_callable=AsyncMock
    ) as mock_create_pool:
        mock_pool = PoolResponse(
            id=str(uuid.uuid4()), token="TEST", risk_status=PoolRiskStatus("low")
        )
        mock_create_pool.return_value = mock_pool.model_dump()
        response = client.post(POOL_URL + "/create_pool?token=TEST&risk_status=low")
        assert response.status_code == 201
        assert response.json().get("token") == "TEST"


@pytest.mark.asyncio
@patch("app.crud.pool.pool_crud.get_all_pools", new_callable=AsyncMock)
async def test_get_all_pools(mock_get_all_pools, client):
    """
    Test the functionality of retrieving all pools through an API endpoint.

    API Response should be a valid JSON object with a list of pools.
    """
    first_id = str(uuid.uuid4())
    second_id = str(uuid.uuid4())

    mock_response = [
        PoolResponse(id=first_id, token="BTC", risk_status=PoolRiskStatus.LOW),
        PoolResponse(id=second_id, token="ETH", risk_status=PoolRiskStatus.HIGH),
    ]

    mock_get_all_pools.return_value = mock_response
    response = client.get(POOL_URL + "/get_all_pools")

    response_data = response.json()
    assert isinstance(response_data, list)
    assert len(response_data) == len(mock_response)
    assert response.status_code == HTTPStatus.OK

    for i, pool in enumerate(response_data):
        assert pool["id"] == str(mock_response[i].id)
        assert pool["token"] == mock_response[i].token
        assert pool["risk_status"] == mock_response[i].risk_status.value

    mock_get_all_pools.assert_called_once()


@pytest.mark.asyncio
@patch("app.crud.pool.pool_crud.get_all_pools", new_callable=AsyncMock)
async def test_get_all_pools_no_records_exist(mock_get_all_pools, client):
    """
    Test the 'get_all_pools' endpoint when no records exist in the database.

    API Response should be an empty list.
    """
    mock_response = []

    mock_get_all_pools.return_value = mock_response

    response = client.get(POOL_URL + "/get_all_pools")
    response_data = response.json()

    assert isinstance(response_data, list)
    assert len(response_data) == 0
    assert response.status_code == status.HTTP_200_OK

    mock_get_all_pools.assert_called_once()


@pytest.mark.asyncio
@patch("app.crud.pool.pool_crud.get_all_pools", new_callable=AsyncMock)
async def test_get_all_pools_internal_error(mock_get_all_pools, client):
    """
    Tests the scenario where an internal server error occurs during the execution
    of `get_all_pools` endpoint. The case emulates the scenario where the
    internal server encounters a problem and raises an HTTPException with a
    status code of 500.
    """
    mock_response = [
        PoolResponse(id=str(uuid.uuid4()), token="BTC", risk_status=PoolRiskStatus.LOW),
        PoolResponse(
            id=str(uuid.uuid4()), token="ETH", risk_status=PoolRiskStatus.HIGH
        ),
    ]

    mock_get_all_pools.return_value = mock_response
    mock_get_all_pools.side_effect = Exception("Internal error")

    response = client.get(POOL_URL + "/get_all_pools")

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    mock_get_all_pools.assert_called_once()


@pytest.mark.asyncio
@patch("app.crud.pool.user_pool_crud.create_user_pool", new_callable=AsyncMock)
async def test_create_user_pool(mock_create_user_pool, client):
    """
    Test the create_user_pool endpoint.

    This test patches the create_user_pool CRUD function to return a mocked UserPoolResponse.
    It sends a POST request with a JSON body containing user_id, pool_id, and amount.
    The test verifies that the response returns a 201 status code and that the returned user_id
    matches the expected value.
    """
    user_id, pool_id = str(uuid.uuid4()), str(uuid.uuid4())
    mock_create_user_pool.return_value = UserPoolResponse(
        id=str(uuid.uuid4()),
        user_id=user_id,
        pool_id=pool_id,
        amount=1000,
        created_at="2024-01-01T00:00:00Z",
    ).model_dump()
    response = client.post(
        POOL_URL + "/create_user_pool",
        json={"user_id": user_id, "pool_id": pool_id, "amount": 1000},
    )
    assert response.status_code == 201
    assert response.json()["user_id"] == user_id


@pytest.mark.asyncio
@patch("app.crud.pool.user_pool_crud.update_user_pool", new_callable=AsyncMock)
async def test_update_user_pool(mock_update_user_pool, client):
    """
    Test the update_user_pool endpoint.

    This test patches the update_user_pool CRUD function to return a mocked UserPoolUpdateResponse.
    It sends a POST request with a JSON body containing user_pool_id and amount.
    The test verifies that the response returns a 200 status code and that the returned amount,
    when converted to an integer, matches the expected value.
    """
    user_pool_id = str(uuid.uuid4())
    mock_response = UserPoolUpdateResponse(
        id=str(uuid.uuid4()),
        user_id=str(uuid.uuid4()),
        pool_id=str(uuid.uuid4()),
        user_pool_id=user_pool_id,
        amount=2000,
        updated_at="2024-01-01T00:00:00Z",
    ).model_dump()
    mock_update_user_pool.return_value = mock_response
    response = client.post(
        POOL_URL + "/update_user_pool",
        json={"user_pool_id": user_pool_id, "amount": 2000},
    )
    assert response.status_code == 200
    assert int(response.json()["amount"]) == 2000


def test_update_user_pool_not_found(client):
    """
    Test the update_user_pool endpoint when the specified user pool entry is not found.

    This test patches the update_user_pool CRUD function to simulate a "not found" scenario
    by returning None. A TestClient instance with raise_server_exceptions set to False is used so
    that the HTTPException is captured as a response. The test verifies that the response returns a
    500 status code and that the response body is empty.
    """
    client_local = TestClient(client, raise_server_exceptions=False)
    with patch(
        "app.crud.pool.user_pool_crud.update_user_pool", new_callable=AsyncMock
    ) as mock_update_user_pool:
        mock_update_user_pool.return_value = None
        user_pool_id = str(uuid.uuid4())
        response = client_local.post(
            POOL_URL + "/update_user_pool",
            json={"user_pool_id": user_pool_id, "amount": 2000},
        )
        assert response.status_code == 500
        assert response.content == b""
