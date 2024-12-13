"""
This module contains the tests for the user endpoints.
"""

from unittest.mock import MagicMock, patch
import pytest
from web_app.api.serializers.transaction import UpdateUserContractRequest
from web_app.api.serializers.user import SubscribeToNotificationResponse
from web_app.tests.conftest import client, mock_user_db_connector

@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id, expected_contract_address",
    [
        ("", ""),
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
        ),
        ("invalid_wallet_id", None),
        (123_456_789, None),
        (3.14, None),
        ({}, None),
    ],
)
async def test_get_user_contract(
    client: client,
    mock_user_db_connector: MagicMock,
    wallet_id: str,
    expected_contract_address: str,
) -> None:
    """
    Test get_user_contract endpoint
    :param client: fastapi.testclient.TestClient
    :param mock_user_db_connector: unittest.mock.MagicMock
    :param wallet_id: str[wallet_id]
    :param expected_contract_address: str[expected_contract_address]
    :return: None
    """
    response = client.get(
        url="/api/get-user-contract",
        params={
            "wallet_id": wallet_id,
        },
    )
    response_json = response.json()

    assert response.status_code == 200  # Ensure status code is 200 for success

    if expected_contract_address is None:
        assert isinstance(response_json, dict)
        assert response_json.get("detail") in (
            "User not found",
            "Contract not deployed",
        )
    else:
        assert isinstance(response_json, str)
        assert response_json == str(expected_contract_address)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id",
    [
        "",
        "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
        "invalid_wallet_id",
        123_456_789,
        3.14,
        {},
    ],
)
async def test_check_user(
    client: client, mock_user_db_connector: MagicMock, wallet_id: str
) -> None:
    """
    Test check_user endpoint
    :param client: fastapi.testclient.TestClient
    :param mock_user_db_connector: unittest.mock.MagicMock
    :param wallet_id: str[wallet_id]
    :return: None
    """
    response = client.get(
        url="/api/check-user",
        params={
            "wallet_id": wallet_id,
        },
    )
    response_json = response.json()

    assert response.status_code == 200  # Ensure status code is 200 for success
    assert isinstance(response_json, dict)
    assert isinstance(response_json.get("is_contract_deployed"), bool)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id, contract_address",
    [
        ("", ""),
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
        ),
        ("invalid_wallet_id", None),
        (123_456_789, None),
        (3.14, None),
        ({}, None),
    ],
)
async def test_change_user_contract(
    client: client,
    mock_user_db_connector: MagicMock,
    wallet_id: str,
    contract_address: str,
) -> None:
    """
    Test update_user_contract endpoint (not get_user_contract)
    :param client: fastapi.testclient.TestClient
    :param mock_user_db_connector: unittest.mock.MagicMock
    :param wallet_id: str[wallet_id]
    :param contract_address: str[contract_address]
    :return: None
    """
    data = UpdateUserContractRequest(
        wallet_id=str(wallet_id),
        contract_address=str(contract_address),
    )

    response = client.post(
        url="/api/update-user-contract",
        json=data.dict(),
    )
    response_json = response.json()

    assert response.status_code == 200  # Ensure status code is 200 for success
    assert isinstance(response_json, dict)
    assert response_json.get("is_contract_deployed") is True


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id, expected_contract_address",
    [
        ("", None),
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
        ),
        ("invalid_wallet_id", None),
        (123_456_789, None),
        (3.14, None),
        ({}, None),
    ],
)
async def test_get_user_contract_address(
    client: client,
    mock_user_db_connector: MagicMock,
    wallet_id: str,
    expected_contract_address: str,
) -> None:
    """
    Test get_user_contract_address endpoint
    :param client: fastapi.testclient.TestClient
    :param mock_user_db_connector: unittest.mock.MagicMock
    :param wallet_id: str[wallet_id]
    :param expected_contract_address: str[expected_contract_address]
    :return: None
    """
    response = client.get(
        url="/api/get-user-contract-address",
        params={
            "wallet_id": wallet_id,
        },
    )
    response_json = response.json()

    assert response.status_code == 200  # Ensure status code is 200 for success
    assert isinstance(response_json, dict)

    contract_address = response_json.get("contract_address")
    assert str(contract_address) == str(expected_contract_address)


@pytest.mark.asyncio
@patch("web_app.db.crud.TelegramUserDBConnector.allow_notification")
@patch("web_app.db.crud.UserDBConnector.get_user_by_wallet_id")
@pytest.mark.parametrize(
    "telegram_id, wallet_id, expected_status_code, expected_response, is_allowed_notification",
    [
        (
            "123456789",
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            200,
            {"detail": "User subscribed to notifications successfully"},
            True,
        ),
        (
            "123456789",
            "invalid_wallet_id",
            404,
            {"detail": "User not found"},
            False,
        ),
        (
            None,
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            422,
            None,
            False,
        ),
    ],
)
async def test_subscribe_to_notification(
    mock_get_user_by_wallet_id: MagicMock,
    mock_allow_notification: MagicMock,
    client,
    telegram_id: str,
    wallet_id: str,
    expected_status_code: int,
    expected_response: dict | None,
    is_allowed_notification: bool,
) -> None:
    """
    Test subscribe_to_notification endpoint with both positive and negative cases.
    :param client: fastapi.testclient.TestClient
    :param mock_get_user_by_wallet_id: unittest.mock.MagicMock for get_user_by_wallet_id
    :param mock_allow_notification: unittest.mock.MagicMock for allow_notification
    :param telegram_id: str[Telegram ID of the user]
    :param wallet_id: str[Wallet ID of the user]
    :param expected_status_code: int[Expected HTTP status code]
    :param expected_response: dict | None[Expected JSON response]
    :return: None
    """
    # Define the behavior of the mocks
    mock_allow_notification.return_value = is_allowed_notification

    if wallet_id == "invalid_wallet_id":
        mock_get_user_by_wallet_id.return_value = None
    else:
        mock_get_user_by_wallet_id.return_value = {"wallet_id": wallet_id}

    data = {"telegram_id": telegram_id, "wallet_id": wallet_id}

    response = client.post(
        url="/api/subscribe-to-notification",
        json=data,
    )
    response_json = response.json()

    assert response.status_code == expected_status_code

    if expected_response:
        assert response_json == expected_response
    elif expected_status_code == 422:
        assert "detail" in response_json
        assert isinstance(response_json["detail"], list)
    elif expected_status_code == 404:
        assert "detail" in response_json
        assert response_json["detail"] == "User not found"
