"""
test_positions.py
This module contains unit tests for the positions functionality within the web_app.
It verifies the creation, retrieval, updating, and deletion of positions, ensuring
that all edge cases and error scenarios are appropriately handled.


"""

import uuid
from datetime import datetime
from decimal import Decimal
from unittest.mock import Mock, patch

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from httpx import AsyncClient

from web_app.api.main import app
from web_app.api.position import add_extra_deposit

app.dependency_overrides.clear()


@pytest.mark.anyio
async def test_open_position_success(client: TestClient) -> None:
    """
    Test for successfully opening a position using a valid position ID.
    Args:
        client (TestClient): The test client for the FastAPI application.
    Returns:
        None
    """
    position_id = "valid_position_id"
    with patch(
        "web_app.db.crud.PositionDBConnector.open_position"
    ) as mock_open_position:
        mock_open_position.return_value = "Position successfully opened"
        response = client.get(f"/api/open-position?position_id={position_id}")
        assert response.is_success
        assert response.json() == "Position successfully opened"


@pytest.mark.anyio
async def test_open_position_missing_position_data(
    client: TestClient,
) -> None:
    """
    Test for missing position data, which should return a 404 error.
    Args:
        client (TestClient): The test client for the FastAPI application.
    Returns:
        None
    """
    response = client.get("/api/open-position?position_id=")
    assert response.status_code == 404
    assert response.json() == {"detail": "Position not found"}


@pytest.mark.anyio
async def test_close_position_success(client: TestClient) -> None:
    """
    Test for successfully closing a position using a valid position ID.
    Args:
        client (TestClient): The test client for the FastAPI application.
    Returns:
        None
    """
    position_id = str(uuid.uuid4())
    with patch(
        "web_app.db.crud.PositionDBConnector.close_position"
    ) as mock_close_position:
        mock_close_position.return_value = "Position successfully closed"
        response = client.get(f"/api/close-position?position_id={position_id}")
        assert response.is_success
        assert response.json() == "Position successfully closed"


@pytest.mark.anyio
async def test_close_position_invalid_position_id(
    client: TestClient,
) -> None:
    """
    Test for attempting to close a position using an invalid position ID,
    which should return a 404 error.
    Args:
        client (TestClient): The test client for the FastAPI application.
    Returns:
        None
    """
    invalid_position_id = "invalid_position_id"
    with patch(
        "web_app.db.crud.PositionDBConnector.close_position"
    ) as mock_close_position:
        mock_close_position.side_effect = HTTPException(
            status_code=404, detail="Position not Found"
        )
        response = client.get(f"/api/close-position?position_id={invalid_position_id}")
        assert response.status_code == 404
        assert response.json() == {"detail": "Position not Found"}


@pytest.mark.parametrize(
    "supply_token, wallet_id, mock_repay_data",
    [
        (
            "valid_supply_token",
            "valid_wallet_id",
            {
                "supply_token": "mock_supply_token",
                "debt_token": "mock_debt_token",
                "pool_key": {
                    "token0": "mock_token0",
                    "token1": "mock_token1",
                    "fee": "mock_fee",
                    "tick_spacing": "mock_tick_spacing",
                    "extension": "mock_extension",
                },
                "supply_price": "100",
                "debt_price": "200",
                "ekubo_limits": {"mock_key": "mock_value"},
                "borrow_portion_percent": 1,
            },
        ),
        (
            "invalid_supply_token",
            "valid_wallet_id",
            {
                "supply_token": "mock_supply_token",
                "debt_token": "mock_debt_token",
                "pool_key": {
                    "token0": "mock_token0",
                    "token1": "mock_token1",
                    "fee": "mock_fee",
                    "tick_spacing": "mock_tick_spacing",
                    "extension": "mock_extension",
                },
                "supply_price": "0",
                "debt_price": "0",
                "ekubo_limits": {"mock_key": "mock_value"},
                "borrow_portion_percent": 1,
            },
        ),
        (
            "valid_supply_token",
            "valid_wallet_id",
            {
                "supply_token": "mock_supply_token",
                "debt_token": "mock_debt_token",
                "pool_key": {
                    "token0": "mock_token0",
                    "token1": "mock_token1",
                    "fee": "mock_fee",
                    "tick_spacing": "mock_tick_spacing",
                    "extension": "mock_extension",
                },
                "supply_price": "0",
                "debt_price": "0",
                "ekubo_limits": {"mock_key": "mock_value"},
                "borrow_portion_percent": 1,
            },
        ),
    ],
)
@pytest.mark.anyio
async def test_get_repay_data_success(
    client: TestClient,
    supply_token,
    wallet_id,
    mock_repay_data,
    mock_position_db_connector,
) -> None:
    """
    Test for successfully retrieving repayment data for
    different combinations of
    wallet ID and supply token.
    Args:
        client (TestClient): The test client for the FastAPI application.
        supply_token (str): The token used for supply.
        wallet_id (str): The wallet ID of the user.
        mock_repay_data (dict): Mocked repayment data.
    Returns:
        None
    """
    with (
        patch(
            "web_app.contract_tools.mixins.deposit.DepositMixin.get_repay_data"
        ) as mock_get_repay_data,
        patch(
            "web_app.db.crud.PositionDBConnector.get_contract_address_by_wallet_id"
        ) as mock_get_contract_address,
        patch(
            "web_app.db.crud.PositionDBConnector.get_position_id_by_wallet_id"
        ) as mock_get_position_wallet_id,
        patch(
            "web_app.api.position.position_db_connector.get_repay_data"
        ) as mock_position_db_connector_get_repay_data,
        patch(
            "web_app.contract_tools.mixins.position.PositionMixin.is_opened_position"
        ) as mock_is_opened_position,
    ):
        mock_get_repay_data.return_value = mock_repay_data
        mock_get_contract_address.return_value = "34702534789504389704385"
        mock_get_position_wallet_id.return_value = 123
        mock_get_repay_data.return_value = mock_repay_data
        mock_position_db_connector_get_repay_data.return_value = (
            mock_get_contract_address.return_value,
            mock_get_position_wallet_id.return_value,
            supply_token,
        )
        mock_is_opened_position.return_value = True
        response = client.get(
            f"/api/get-repay-data?supply_token={supply_token}&wallet_id={wallet_id}"
        )
        expected_response = {
            **mock_repay_data,
            "contract_address": "34702534789504389704385",
            "position_id": "123",
        }
        assert response.is_success
        assert response.json() == expected_response


@pytest.mark.anyio
async def test_get_repay_data_missing_wallet_id(
    client: AsyncClient,
) -> None:
    """
    Test for missing wallet ID when attempting to retrieve repayment data,
    which should return a 404 error.
    Args:
        client (AsyncClient): The test client for the FastAPI application.
    Returns:
        None
    """
    supply_token = "valid_supply_token"
    wallet_id = ""
    with (
        patch(
            "web_app.contract_tools.mixins.deposit.DepositMixin.get_repay_data"
        ) as mock_get_repay_data,
        patch(
            "web_app.db.crud.PositionDBConnector.get_contract_address_by_wallet_id"
        ) as mock_get_contract_address,
        patch(
            "web_app.db.crud.PositionDBConnector.get_position_id_by_wallet_id"
        ) as mock_get_position_id,
    ):
        mock_get_repay_data.return_value = None
        mock_get_contract_address.side_effect = None
        mock_get_position_id.side_effect = None
        response = client.get(
            f"/api/get-repay-data?supply_token={supply_token}&wallet_id={wallet_id}"
        )
        assert response.status_code == 404
        assert response.json() == {"detail": "Wallet not found"}


@pytest.mark.parametrize(
    "wallet_id, token_symbol, amount, multiplier, expected_response",
    [
        (
            "valid_wallet_id",
            "ETH",
            "1000",
            2,
            {
                "contract_address": "mock_contract_address",
                "position_id": "123",
                "pool_price": 100,
                "pool_key": {
                    "token0": "mock_token0",
                    "token1": "mock_token1",
                    "fee": "mock_fee",
                    "tick_spacing": "mock_tick_spacing",
                    "extension": "mock_extension",
                },
                "deposit_data": {
                    "token": "mock_token",
                    "amount": "mock_amount",
                    "multiplier": "1",
                    "borrow_portion_percent": 0,
                },
                "ekubo_limits": {"mock_key": "mock_value"},
            },
        ),
        (
            "valid_wallet_id_2",
            "ETH",
            "500",
            1,
            {
                "contract_address": "mock_contract_address",
                "position_id": "123",
                "pool_price": 100,
                "pool_key": {
                    "token0": "mock_token0",
                    "token1": "mock_token1",
                    "fee": "mock_fee",
                    "tick_spacing": "mock_tick_spacing",
                    "extension": "mock_extension",
                },
                "deposit_data": {
                    "token": "mock_token",
                    "amount": "mock_amount",
                    "multiplier": "1",
                    "borrow_portion_percent": 0,
                },
                "ekubo_limits": {"mock_key": "mock_value"},
            },
        ),
        (
            "valid_wallet_id_3",
            "ETH",
            "1500",
            3,
            {
                "contract_address": "mock_contract_address",
                "position_id": "123",
                "pool_price": 100,
                "pool_key": {
                    "token0": "mock_token0",
                    "token1": "mock_token1",
                    "fee": "mock_fee",
                    "tick_spacing": "mock_tick_spacing",
                    "extension": "mock_extension",
                },
                "deposit_data": {
                    "token": "mock_token",
                    "amount": "mock_amount",
                    "multiplier": "1",
                    "borrow_portion_percent": 0,
                },
                "ekubo_limits": {"mock_key": "mock_value"},
            },
        ),
    ],
)
@pytest.mark.anyio
async def test_create_position_success(
    client: TestClient, wallet_id, token_symbol, amount, multiplier, expected_response
) -> None:
    """
    Test for successfully creating a position with valid form data.
    """
    mock_position = Mock()
    mock_position.id = 123
    mock_deposit_data = {
        "pool_price": 100,
        "pool_key": {
            "token0": "mock_token0",
            "token1": "mock_token1",
            "fee": "mock_fee",
            "tick_spacing": "mock_tick_spacing",
            "extension": "mock_extension",
        },
        "deposit_data": {
            "token": "mock_token",
            "amount": "mock_amount",
            "multiplier": "1",
            "borrow_portion_percent": 0,
        },
        "contract_address": "mock_contract_address",
        "position_id": "123",
        "ekubo_limits": {"mock_key": "mock_value"},
    }

    with (
        patch(
            "web_app.db.crud.PositionDBConnector.create_position"
        ) as mock_create_position,
        patch(
            "web_app.contract_tools.mixins.deposit.DepositMixin.get_transaction_data"
        ) as mock_get_transaction_data,
        patch(
            "web_app.db.crud.PositionDBConnector.get_contract_address_by_wallet_id"
        ) as mock_get_contract_address,
    ):

        mock_create_position.return_value = mock_position
        mock_get_transaction_data.return_value = mock_deposit_data
        mock_get_contract_address.return_value = "mock_contract_address"

        response = client.post(
            "/api/create-position",
            json={
                "wallet_id": wallet_id,
                "token_symbol": token_symbol,
                "amount": amount,
                "multiplier": multiplier,
            },
        )
        assert (
            response.is_success
        ), f"Expected status code 200 but got {response.status_code}"
        assert (
            response.json() == expected_response
        ), f"Response JSON does not match expected response"


@pytest.mark.parametrize(
    "wallet_id, token_symbol, amount, multiplier, expected_status",
    [
        (None, "ETH", 100, 2, 422),
        (12345, "", 100, 2, 422),
        (12345, None, 100, 2, 422),
        (12345, "ETH", -50, 2, 422),
        (12345, "ETH", None, 2, 422),
        (12345, "ETH", "50", 2, 422),
        (12345, "ETH", 100, "0.01", 422),
        (12345, "ETH", 100, "1.5", 422),
    ],
)
def test_create_position_invalid(
    client: TestClient, wallet_id, token_symbol, amount, multiplier, expected_status
):
    """
    Test for attempting to create a position with various valid and invalid input data.
    Should return 422 for invalid data and 200 for valid data.
    """
    response = client.post(
        "/api/create-position",
        json={
            "wallet_id": wallet_id,
            "token_symbol": token_symbol,
            "amount": amount,
            "multiplier": multiplier,
        },
    )
    assert response.status_code == expected_status
    if expected_status == 422:
        assert "detail" in response.json()


@pytest.mark.asyncio
async def test_get_user_positions_success(client: TestClient) -> None:
    """
    Test successfully retrieving user positions.
    """
    wallet_id = "test_wallet_id"
    mock_positions = [
        {
            "id": str(uuid.uuid4()),
            "token_symbol": "ETH",
            "amount": "100",
            "multiplier": 2.0,
            "status": "opened",
            "created_at": datetime.now(),
            "start_price": 1800.0,
            "is_liquidated": False,
        }
    ]

    with patch(
        "web_app.db.crud.PositionDBConnector.get_positions_by_wallet_id"
    ) as mock_get_positions:
        mock_get_positions.return_value = mock_positions
        response = client.get(f"/api/user-positions/{wallet_id}")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == len(mock_positions)
        assert data[0]["token_symbol"] == mock_positions[0]["token_symbol"]
        assert data[0]["amount"] == mock_positions[0]["amount"]


@pytest.mark.asyncio
async def test_get_user_positions_empty_wallet_id(client: AsyncClient) -> None:
    """
    Test retrieving positions with empty wallet ID.
    """
    response = client.get("/api/user-positions/")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_user_positions_no_positions(client: AsyncClient) -> None:
    """
    Test retrieving positions for wallet with no positions.
    """
    wallet_id = "wallet_with_no_positions"
    with patch(
        "web_app.db.crud.PositionDBConnector.get_positions_by_wallet_id"
    ) as mock_get_positions:
        mock_get_positions.return_value = []
        response = client.get(f"/api/user-positions/{wallet_id}")

        assert response.status_code == 200
        data = response.json()
        assert data == []

@pytest.mark.parametrize(
    "position_id, amount, mock_position, expected_response",
    [
        (
            1,
            "100.0",
            {
                "id": 1,
                "token_symbol": "ETH",
                "amount": "1000",
                "status": "opened"
            },
            {"detail": "Successfully added extra deposit"}
        ),
        (
            123,
            "50.5",
            {
                "id": 123,
                "token_symbol": "ETH",
                "amount": "500",
                "status": "opened"
            },
            {"detail": "Successfully added extra deposit"}
        ),
        (
            999,
            "75.25",
            {
                "id": 999,
                "token_symbol": "ETH",
                "amount": "750",
                "status": "opened"
            },
            {"detail": "Successfully added extra deposit"}
        ),
    ],
)
@pytest.mark.anyio
async def test_add_extra_deposit_success(
    client: TestClient,
    position_id: int,
    amount: str,
    mock_position: dict,
    expected_response: dict,
) -> None:
    """
    Test for successfully adding extra deposit to a position.
    
    """
    with (
        patch(
            "web_app.db.crud.PositionDBConnector.get_position_by_id"
        ) as mock_get_position,
        patch(
            "web_app.db.crud.PositionDBConnector.add_extra_deposit_to_position"
        ) as mock_add_deposit,
    ):
        mock_get_position.return_value = mock_position
        mock_add_deposit.return_value = None
        
        response = client.post(
            f"/api/add-extra-deposit/{position_id}?amount={amount}"
        )
        
        assert response.status_code == 200
        assert response.json() == expected_response
        mock_get_position.assert_called_once_with(position_id)
        mock_add_deposit.assert_called_once_with(mock_position, amount)


@pytest.mark.parametrize(
    "position_id, amount, error_status, error_detail",
    [
        (
            None,
            "100.0",
            422,
            "Position ID is required"
        ),
        (
            1,
            "",
            404,
            "Amount is required"
        ),
        (
            999,
            "100.0",
            404,
            "Position not found"
        ),
        (
            "invalid",
            "100.0",
            422,
            "Invalid position ID format"
        ),
    ],
)
@pytest.mark.anyio
async def test_add_extra_deposit_failure(
    client: TestClient,
    position_id: int,
    amount: str,
    error_status: int,
    error_detail: str,
) -> None:
    """
    Test various failure scenarios when adding extra deposit to a position.
    
    """
    with patch(
        "web_app.db.crud.PositionDBConnector.get_position_by_id"
    ) as mock_get_position:
        if error_detail == "Position not found":
            mock_get_position.return_value = None
            
        response = client.post(
            f"/api/add-extra-deposit/{position_id}?amount={amount}"
        )
        
        assert response.status_code == error_status