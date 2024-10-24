from unittest.mock import MagicMock
import pytest
from decimal import Decimal

from web_app.api.serializers.transaction import LoopLiquidityData, RepayTransactionDataResponse
from web_app.api.serializers.position import PositionFormData
from web_app.tests.conftest import client, mock_position_db_connector

# Test constants
VALID_WALLET_ID = "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49"
VALID_TOKEN_SYMBOL = "ETH"
VALID_POSITION_ID = "pos_0x123456789abcdef0123456789abcdef012345678"
VALID_CONTRACT_ADDRESS = "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0"
VALID_AMOUNT = "100"  
VALID_MULTIPLIER = "2"  

@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id, token_symbol, amount, multiplier, expected_status, expected_response",
    [
        (
            VALID_WALLET_ID,
            VALID_TOKEN_SYMBOL,
            VALID_AMOUNT,
            VALID_MULTIPLIER,
            422, 
            {"detail": [{"type": "value_error", "loc": ["body"], "msg": "Value error"}]},
        ),
        (
            "",
            VALID_TOKEN_SYMBOL,
            VALID_AMOUNT,
            VALID_MULTIPLIER,
            422,
            {"detail": [{"type": "value_error", "loc": ["body", "wallet_id"], "msg": "Field required"}]},
        ),
        (
            "invalid_wallet_id",
            VALID_TOKEN_SYMBOL,
            VALID_AMOUNT,
            VALID_MULTIPLIER,
            422,
            {"detail": [{"type": "value_error", "loc": ["body", "wallet_id"], "msg": "Invalid wallet ID format"}]},
        ),
        (
            VALID_WALLET_ID,
            "",
            VALID_AMOUNT,
            VALID_MULTIPLIER,
            422,
            {"detail": [{"type": "value_error", "loc": ["body", "token_symbol"], "msg": "Field required"}]},
        ),
        (
            VALID_WALLET_ID,
            VALID_TOKEN_SYMBOL,
            "0",
            VALID_MULTIPLIER,
            422,
            {"detail": [{"type": "value_error", "loc": ["body", "amount"], "msg": "Amount must be greater than 0"}]},
        ),
        (
            VALID_WALLET_ID,
            VALID_TOKEN_SYMBOL,
            VALID_AMOUNT,
            "-1",
            422,
            {"detail": [{"type": "value_error", "loc": ["body", "multiplier"], "msg": "Multiplier must be positive"}]},
        ),
    ],
)
async def test_create_position(
    client: client,
    mock_position_db_connector: MagicMock,
    wallet_id: str,
    token_symbol: str,
    amount: str,
    multiplier: str,
    expected_status: int,
    expected_response: dict,
) -> None:
    """
    Test create_position endpoint
    :param client: fastapi.testclient.TestClient
    :param mock_position_db_connector: unittest.mock.MagicMock
    :param wallet_id: str
    :param token_symbol: str
    :param amount: str
    :param multiplier: str
    :param expected_status: int
    :param expected_response: dict
    :return: None
    """
    form_data = {
        "wallet_id": wallet_id,
        "token_symbol": token_symbol,
        "amount": amount,
        "multiplier": multiplier
    }

    response = client.post("/api/create-position", json=form_data)
    assert response.status_code == expected_status
    
    response_json = response.json()
    assert "detail" in response_json
    if isinstance(response_json["detail"], list):
        assert any(
            expected_response["detail"][0]["msg"] in error["msg"]
            for error in response_json["detail"]
        )
    else:
        assert expected_response["detail"] in str(response_json["detail"])


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "form_data, expected_error_msg",
    [
        (
            {"token_symbol": VALID_TOKEN_SYMBOL, "amount": VALID_AMOUNT, "multiplier": VALID_MULTIPLIER},
            "Field required",
        ),
        (
            {"wallet_id": VALID_WALLET_ID, "amount": VALID_AMOUNT, "multiplier": VALID_MULTIPLIER},
            "Field required",
        ),
        (
            {"wallet_id": VALID_WALLET_ID, "token_symbol": VALID_TOKEN_SYMBOL, "multiplier": VALID_MULTIPLIER},
            "Field required",
        ),
        (
            {"wallet_id": VALID_WALLET_ID, "token_symbol": VALID_TOKEN_SYMBOL, "amount": VALID_AMOUNT},
            "Field required",
        ),
        (
            {"wallet_id": VALID_WALLET_ID, "token_symbol": VALID_TOKEN_SYMBOL, "amount": "invalid", "multiplier": VALID_MULTIPLIER},
            "Input should be a valid string",
        ),
        (
            {"wallet_id": VALID_WALLET_ID, "token_symbol": VALID_TOKEN_SYMBOL, "amount": VALID_AMOUNT, "multiplier": "invalid"},
            "Input should be a valid string",
        ),
    ],
)
async def test_create_position_validation(
    client: client,
    form_data: dict,
    expected_error_msg: str,
) -> None:
    """
    Test create_position endpoint validation
    :param client: fastapi.testclient.TestClient
    :param form_data: dict
    :param expected_error_msg: str
    :return: None
    """
    response = client.post("/api/create-position", json=form_data)
    assert response.status_code == 422
    
    response_json = response.json()
    assert "detail" in response_json
    assert isinstance(response_json["detail"], list)
    assert any(expected_error_msg in error["msg"] for error in response_json["detail"])


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "position_id, expected_status",
    [
        (VALID_POSITION_ID, 404), 
        ("", 404),
        ("invalid_position_id", 404),
        (123_456_789, 404),
        (3.14, 404),
        ({}, 404),
    ],
)
async def test_get_position(
    client: client,
    mock_position_db_connector: MagicMock,
    position_id: str,
    expected_status: int,
) -> None:
    """
    Test get_position endpoint
    :param client: fastapi.testclient.TestClient
    :param mock_position_db_connector: unittest.mock.MagicMock
    :param position_id: str
    :param expected_status: int
    :return: None
    """
    response = client.get(
        url="/api/get-position",
        params={"position_id": position_id},
    )
    assert response.status_code == expected_status

    if expected_status == 404:
        response_json = response.json()
        assert "detail" in response_json
        assert response_json["detail"] == "Position not found"