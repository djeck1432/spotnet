import uuid
from unittest.mock import Mock, patch

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from httpx import AsyncClient
from web_app.api.main import app
from web_app.contract_tools.mixins.deposit import DepositMixin

client = TestClient(app)
app.dependency_overrides.clear()


@pytest.mark.anyio
async def test_open_position_success(client: AsyncClient) -> None:
    """
    Test for successfully opening a position using a valid position ID.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    position_id = "valid_position_id"
    with patch(
        "web_app.db.crud.PositionDBConnector.open_position"
    ) as mock_open_position:
        mock_open_position.return_value = "Position successfully opened"
        response = client.get(f"/api/open-position?position_id={position_id}")
        assert response.ok
        assert response.json() == "Position successfully opened"


@pytest.mark.anyio
async def test_open_position_missing_position_data(client: AsyncClient) -> None:
    """
    Test for missing position data, which should return a 404 error.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    response = client.get("/api/open-position?position_id=")
    assert response.status_code == 404
    assert response.json() == {"detail": "Position not found"}


@pytest.mark.anyio
async def test_close_position_success(client: AsyncClient) -> None:
    """
    Test for successfully closing a position using a valid position ID.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    position_id = str(uuid.uuid4())
    with patch(
        "web_app.db.crud.PositionDBConnector.close_position"
    ) as mock_close_position:
        mock_close_position.return_value = "Position successfully closed"
        response = client.get(f"/api/close-position?position_id={position_id}")
        assert response.ok
        assert response.json() == "Position successfully closed"


@pytest.mark.anyio
async def test_close_position_invalid_position_id(client: AsyncClient) -> None:
    """
    Test for attempting to close a position using an invalid position ID, which should return a 404 error.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

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
                "supply_price": 100,
                "debt_price": 200,
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
                "supply_price": 0,
                "debt_price": 0,
            },
        ),
        (
            "valid_supply_token",
            "invalid_wallet_id",
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
                "supply_price": 0,
                "debt_price": 0,
            },
        ),
    ],
)
@pytest.mark.anyio
async def test_get_repay_data_success(
    client: AsyncClient, supply_token, wallet_id, mock_repay_data
) -> None:
    """
    Test for successfully retrieving repayment data for different combinations of wallet ID and supply token.

    Args:
        client (AsyncClient): The test client for the FastAPI application.
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
        ) as mock_get_position_id,
    ):
        mock_get_repay_data.return_value = mock_repay_data
        mock_get_contract_address.return_value = "mock_contract_address"
        mock_get_position_id.return_value = 123
        mock_get_repay_data.return_value = mock_repay_data
        DepositMixin.get_repay_data = mock_get_repay_data
        response = client.get(
            f"/api/get-repay-data?supply_token={supply_token}&wallet_id={wallet_id}"
        )
        mock_get_contract_address.assert_called_once_with(wallet_id)
        mock_get_position_id.assert_called_once_with(wallet_id)
        mock_get_repay_data.assert_called_once_with(supply_token)
        expected_response = {
            **mock_repay_data,
            "contract_address": "mock_contract_address",
            "position_id": "123",
        }
        assert response.ok
        assert response.json() == expected_response


@pytest.mark.parametrize(
    "supply_token, wallet_id, expected_status, expected_response",
    [
        ("valid_supply_token", "", 404, {"detail": "Wallet not found"}),
        ("valid_supply_token", None, 404, {"detail": "Wallet not found"}),
        (
            "valid_supply_token",
            "invalid_wallet_id",
            404,
            {"detail": "Wallet not found"},
        ),
    ],
)
@pytest.mark.anyio
async def test_get_repay_data_missing_wallet_id(
    client: AsyncClient, supply_token, wallet_id, expected_status, expected_response
) -> None:
    """
    Test for missing or invalid wallet ID when attempting to retrieve repayment data, which should return a 404 error.

    Args:
        client (AsyncClient): The test client for the FastAPI application.
        supply_token (str): The supply token used for repayment.
        wallet_id (str): The wallet ID of the user.
        expected_status (int): Expected HTTP status code.
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
        ) as mock_get_position_id,
    ):
        mock_get_repay_data.return_value = None
        mock_get_contract_address.side_effect = None
        mock_get_position_id.side_effect = None
        response = client.get(
            f"/api/get-repay-data?supply_token={supply_token}&wallet_id={wallet_id}"
        )
        assert response.status_code == expected_status
        assert response.json() == expected_response


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
                "caller": "mock_caller",
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
                    "multiplier": "mock_multiplier",
                },
            },
        ),
        (
            "valid_wallet_id_2",
            "BTC",
            "500",
            1,
            {
                "contract_address": "mock_contract_address",
                "position_id": "123",
                "caller": "mock_caller",
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
                    "multiplier": "mock_multiplier",
                },
            },
        ),
        (
            "valid_wallet_id_3",
            "SOL",
            "1500",
            3,
            {
                "contract_address": "mock_contract_address",
                "position_id": "123",
                "caller": "mock_caller",
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
                    "multiplier": "mock_multiplier",
                },
            },
        ),
    ],
)
@pytest.mark.anyio
async def test_create_position_success(
    client: AsyncClient, wallet_id, token_symbol, amount, multiplier, expected_response
) -> None:
    """
    Test for successfully creating a position with valid form data.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    mock_position = Mock()
    mock_position.id = 123
    mock_deposit_data = {
        "caller": "mock_caller",
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
            "multiplier": "mock_multiplier",
        },
        "contract_address": "mock_contract_address",
        "position_id": "123",
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
        response = await client.post("/api/create-position-with-transaction-data",data={"wallet_id": wallet_id,"token_symbol": token_symbol,"amount": amount,"multiplier": multiplier,},)
        assert response.ok
        assert response.json() == expected_response


@pytest.mark.parametrize(
    "wallet_id, token_symbol, amount, multiplier, expected_status",
    [
        ("valid_wallet_id", "ETH", 100, 2, 200),
        (None, "ETH", 100, 2, 422),
        ("valid_wallet_id", "", 100, 2, 422),
        ("valid_wallet_id", None, 100, 2, 422),
        ("valid_wallet_id", "BTC", "invalid_amount", 2, 422),
        ("valid_wallet_id", "BTC", -50, 2, 422),
        ("valid_wallet_id", "BTC", None, 2, 422),
        ("valid_wallet_id", "BTC", "50", 2, 422),
        ("valid_wallet_id", "BTC", 100, "invalid_multiplier", 422),
        ("valid_wallet_id", "BTC", 100, None, 422),
        ("valid_wallet_id", "BTC", 100, "1.5", 422),
        ("valid_wallet_id", "BTC", 100, -1, 422),
    ],
)
@pytest.mark.anyio
async def test_create_position_invalid(
    client: AsyncClient, wallet_id, token_symbol, amount, multiplier, expected_status
) -> None:
    """
    Test for attempting to create a position with various valid and invalid input data.
    Should return 422 for invalid data and 200 for valid data.

    Args:
        client (AsyncClient): The test client for the FastAPI application.
        wallet_id: The wallet ID of the user.
        token_symbol: The symbol of the token.
        amount: The amount to be used.
        multiplier: The multiplier value.
        expected_status: The expected HTTP status code.

    Returns:
        None
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
