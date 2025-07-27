"""
test_positions.py
This module contains unit tests for the positions functionality within the web_app.
It verifies the creation, retrieval, updating, and deletion of positions, ensuring
that all edge cases and error scenarios are appropriately handled.


"""

import uuid
from datetime import datetime
from unittest.mock import Mock, patch

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from httpx import AsyncClient

from web_app.api.main import app
from web_app.db.models import TransactionStatus
from web_app.tests.conftest import dict_to_object

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
    position_id = str(uuid.uuid4())
    transaction_hash = "valid_transaction_hash"
    with (
        patch(
            "web_app.db.crud.PositionDBConnector.open_position"
        ) as mock_open_position,
        patch(
            "web_app.db.crud.TransactionDBConnector.create_transaction"
        ) as mock_create_transaction,
    ):
        mock_open_position.return_value = "Position successfully opened"
        mock_create_transaction.return_value = {
            "position_id": position_id,
            "transaction_hash": transaction_hash,
            "status": TransactionStatus.OPENED.value,
        }
        response = client.get(
            f"/api/open-position?position_id={position_id}&transaction_hash={transaction_hash}"
        )
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
    response = client.get("/api/open-position?position_id=&transaction_hash=")
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
    transaction_hash = "0xabc123"
    with patch(
        "web_app.db.crud.PositionDBConnector.close_position"
    ) as mock_close_position:
        mock_close_position.return_value = "Position successfully closed"

        response = client.get(
            f"/api/close-position?position_id={position_id}&transaction_hash={transaction_hash}"
        )

        assert response.status_code == 200
        assert response.json() == "Position successfully closed"


@pytest.mark.anyio
async def test_close_position_invalid_position_id(client: TestClient) -> None:
    """
    Test for attempting to close a position using an invalid position ID,
    which should return a 404 error.
    Args:
        client (TestClient): The test client for the FastAPI application.
    Returns:
        None
    """
    invalid_position_id = str(uuid.uuid4())
    with patch(
        "web_app.db.crud.PositionDBConnector.close_position"
    ) as mock_close_position:
        mock_close_position.side_effect = HTTPException(
            status_code=404, detail="Position not Found"
        )
        response = client.get(
            f"/api/close-position?position_id={invalid_position_id}&transaction_hash=0xabc123"
        )
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
        # New test case for kSTRK
        (
            "valid_wallet_id_4",
            "kSTRK",
            "800",
            4,
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
        assert response.is_success, (
            f"Expected status code 200 but got {response.status_code}"
        )
        assert response.json() == expected_response, (
            "Response JSON does not match expected response"
        )


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
    mock_total_count = len(mock_positions)

    with (
        patch(
            "web_app.db.crud.PositionDBConnector.get_all_positions_by_wallet_id"
        ) as mock_get_positions,
        patch(
            "web_app.db.crud.PositionDBConnector.get_count_positions_by_wallet_id"
        ) as mock_get_count_positions,
    ):
        mock_get_positions.return_value = mock_positions
        mock_get_count_positions.return_value = mock_total_count

        response = client.get(f"/api/user-positions/{wallet_id}")

        assert response.status_code == 200
        data = response.json()
        assert len(data["positions"]) == len(mock_positions)
        assert data["total_count"] == mock_total_count
        assert data["positions"][0]["token_symbol"] == mock_positions[0]["token_symbol"]
        assert data["positions"][0]["amount"] == mock_positions[0]["amount"]


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
        assert data == {"positions": [], "total_count": 0}


@pytest.mark.parametrize(
    "position_id, amount, token_symbol, mock_position, expected_response",
    [
        (
            "520e8441-de08-463b-864a-deccf517f0ce",
            "3.1",
            "ETH",
            {
                "id": "520e8441-de08-463b-864a-deccf517f0ce",
                "token_symbol": "ETH",
                "amount": "4",
                "status": "opened",
            },
            {
                "deposit_data": {
                    "token_address": "0x049d36570d4e46f48",
                    "token_amount": 3.1 * 10**18,
                }
            },
        ),
        (
            "0ae52807-6a32-4a68-b9b5-7d3b002b7189",
            "50.5",
            "USDC",
            {
                "id": "0ae52807-6a32-4a68-b9b5-7d3b002b7189",
                "token_symbol": "USDC",
                "amount": "500",
                "status": "opened",
            },
            {
                "deposit_data": {
                    "token_address": "0x053c91253bc9682c0492",
                    "token_amount": 50.5 * 10**6,
                }
            },
        ),
        (
            "579af7e9-6759-4285-b346-f3461dc42b1d",
            "75.25",
            "STRK",
            {
                "id": "579af7e9-6759-4285-b346-f3461dc42b1d",
                "token_symbol": "STRK",
                "amount": "750",
                "status": "opened",
            },
            {
                "deposit_data": {
                    "token_address": "0x04718f5a0fc34cc1af1",
                    "token_amount": 75.25 * 10**18,
                }
            },
        ),
    ],
)
@pytest.mark.anyio
async def test_add_extra_deposit_success(
    client: TestClient,
    position_id: str,
    amount: str,
    token_symbol: str,
    mock_position: dict,
    expected_response: dict,
) -> None:
    """
    Test successful extra deposit for various scenarios.
    """
    with (
        patch(
            "web_app.db.crud.PositionDBConnector.get_position_by_id"
        ) as mock_get_position,
        patch(
            "web_app.contract_tools.constants.TokenParams.get_token_address"
        ) as mock_get_token_address,
        patch(
            "web_app.contract_tools.constants.TokenParams.get_token_decimals"
        ) as mock_get_token_decimals,
    ):
        mock_get_position.return_value = dict_to_object(mock_position)
        mock_get_token_address.return_value = expected_response["deposit_data"][
            "token_address"
        ]
        if token_symbol == "ETH" or token_symbol == "STRK":
            mock_get_token_decimals.return_value = 18
        else:
            mock_get_token_decimals.return_value = 6

        response = client.get(
            f"/api/get-add-deposit-data/{position_id}",
            params={"amount": amount, "token_symbol": token_symbol},
        )

        assert response.status_code == 200
        assert response.json() == expected_response


@pytest.mark.parametrize(
    "position_id, amount, token_symbol, error_status, error_detail",
    [
        (None, "100.0", "ETH", 404, "Position not found"),
        ("579af7e9-6759-4285-b346-f3461dc42b1d", "", "ETH", 400, "Amount is required"),
        (
            "0ae52807-6a32-4a68-b9b5-7d3b002b7189",
            "invalid",
            "ETH",
            400,
            "Amount is not a number",
        ),
        (
            "520e8441-de08-463b-864a-deccf517f0ce",
            "100.0",
            "",
            400,
            "Token symbol is required",
        ),
    ],
)
@pytest.mark.anyio
async def test_add_extra_deposit_failure(
    client: TestClient,
    position_id: str,
    amount: str,
    token_symbol: str,
    error_status: int,
    error_detail: str,
) -> None:
    """
    Test failure scenarios for extra deposit.
    """
    with patch(
        "web_app.db.crud.PositionDBConnector.get_position_by_id"
    ) as mock_get_position:
        if position_id is not None:
            mock_get_position.return_value = dict_to_object(
                {"id": position_id, "token_symbol": token_symbol}
            )
        else:
            position_id = str(uuid.uuid4())
            mock_get_position.return_value = None

        response = client.get(
            f"/api/get-add-deposit-data/{position_id}",
            params={"amount": amount, "token_symbol": token_symbol},
        )

        assert response.status_code == error_status
        assert error_detail in response.json()["detail"]


@pytest.mark.parametrize(
    "position_id, data, mock_position, expected_response",
    [
        (
            "520e8441-de08-463b-864a-deccf517f0ce",
            {
                "amount": "100.0",
                "token_symbol": "ETH",
                "transaction_hash": "0x123456789abcdef",
            },
            {
                "id": "520e8441-de08-463b-864a-deccf517f0ce",
                "token_symbol": "ETH",
                "amount": "1000",
                "status": "opened",
            },
            {"detail": "Successfully added extra deposit"},
        ),
        (
            "0ae52807-6a32-4a68-b9b5-7d3b002b7189",
            {
                "amount": "50.5",
                "token_symbol": "USDC",
                "transaction_hash": "0xabcdef123456789",
            },
            {
                "id": "0ae52807-6a32-4a68-b9b5-7d3b002b7189",
                "token_symbol": "USDC",
                "amount": "500",
                "status": "opened",
            },
            {"detail": "Successfully added extra deposit"},
        ),
        (
            "579af7e9-6759-4285-b346-f3461dc42b1d",
            {
                "amount": "75.25",
                "token_symbol": "STRK",
                "transaction_hash": "0xdef123456789abc",
            },
            {
                "id": "579af7e9-6759-4285-b346-f3461dc42b1d",
                "token_symbol": "STRK",
                "amount": "750",
                "status": "opened",
            },
            {"detail": "Successfully added extra deposit"},
        ),
    ],
)
@pytest.mark.anyio
async def test_add_extra_deposit_transaction_success(
    client: TestClient,
    position_id: str,
    data: dict,
    mock_position: dict,
    expected_response: dict,
) -> None:
    """
    Test successful extra deposit transaction for various scenarios.
    """
    with (
        patch(
            "web_app.db.crud.PositionDBConnector.get_position_by_id"
        ) as mock_get_position,
        patch(
            "web_app.db.crud.PositionDBConnector.add_extra_deposit_to_position"
        ) as mock_add_extra_deposit,
        patch(
            "web_app.db.crud.TransactionDBConnector.create_transaction"
        ) as mock_create_transaction,
    ):
        mock_position_obj = dict_to_object(mock_position)
        mock_get_position.return_value = mock_position_obj
        mock_add_extra_deposit.return_value = None
        mock_create_transaction.return_value = None

        response = client.post(f"/api/add-extra-deposit/{position_id}", json=data)

        assert response.status_code == 200
        assert response.json() == expected_response

        mock_add_extra_deposit.assert_called_once_with(
            mock_position_obj, data["token_symbol"], data["amount"]
        )
        mock_create_transaction.assert_called_once_with(
            uuid.UUID(mock_position["id"]),
            data["transaction_hash"],
            status=TransactionStatus.EXTRA_DEPOSIT.value,
        )


@pytest.mark.parametrize(
    "position_id, data, error_status, error_detail",
    [
        (
            None,
            {
                "amount": "100.0",
                "token_symbol": "ETH",
                "transaction_hash": "0x123456789abcdef",
            },
            404,
            "Position not found",
        ),
        (
            "579af7e9-6759-4285-b346-f3461dc42b1d",
            {
                "amount": "",
                "token_symbol": "ETH",
                "transaction_hash": "0x123456789abcdef",
            },
            400,
            "Amount is required",
        ),
        (
            "0ae52807-6a32-4a68-b9b5-7d3b002b7189",
            {"amount": "100.0", "token_symbol": "ETH", "transaction_hash": ""},
            400,
            "Transaction hash is required",
        ),
    ],
)
@pytest.mark.anyio
async def test_add_extra_deposit_transaction_failure(
    client: TestClient,
    position_id: str,
    data: dict,
    error_status: int,
    error_detail: str,
) -> None:
    """
    Test failure scenarios for extra deposit transaction.
    """
    with patch(
        "web_app.db.crud.PositionDBConnector.get_position_by_id"
    ) as mock_get_position:
        if position_id is not None:
            mock_get_position.return_value = dict_to_object(
                {"id": position_id, "token_symbol": "ETH"}
            )
        else:
            position_id = str(uuid.uuid4())
            mock_get_position.return_value = None

        response = client.post(f"/api/add-extra-deposit/{position_id}", json=data)

        assert response.status_code == error_status
        assert error_detail in response.json()["detail"]
