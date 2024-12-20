"""
This module contains the tests for the user endpoints.
"""

from unittest.mock import MagicMock, patch

import pytest

from web_app.api.serializers.transaction import UpdateUserContractRequest
from web_app.db.models import TelegramUser, User
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

    if response.is_success:
        assert isinstance(response_json, str)
        assert response_json == str(expected_contract_address)
    else:
        assert isinstance(response_json, dict)
        assert response_json.get("detail") in (
            "User not found",
            "Contract not deployed",
        )


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

    assert response.is_success
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
    Test get_user_contract endpoint
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

    assert response.is_success
    assert isinstance(response_json, dict)
    assert response_json.get("is_contract_deployed")


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

    assert response.is_success
    assert isinstance(response_json, dict)

    contract_address = response_json.get("contract_address")
    assert str(contract_address) == str(expected_contract_address)


@pytest.mark.asyncio
@patch("web_app.db.crud.TelegramUserDBConnector.set_allow_notification")
@patch("web_app.db.crud.TelegramUserDBConnector.get_telegram_user_by_wallet_id")
@patch("web_app.db.crud.UserDBConnector.get_user_by_wallet_id")
@pytest.mark.parametrize(
    "telegram_id, wallet_id, user_telegram_id, expected_status_code, expected_response",
    [
        (
            "123456789",
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "123456789",
            200,
            {"detail": "User subscribed to notifications successfully"},
        ),
        (
            None,
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "123456789",
            200,
            {"detail": "User subscribed to notifications successfully"},
        ),
        (
            "123456789", 
            "invalid_wallet_id",
            None,
            404,
            {"detail": "User not found"},
        ),
        (
            None,
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            None,
            400,
            {"detail": "Failed to subscribe user to notifications"},
        ),
    ],
)
async def test_subscribe_to_notification(
    mock_get_user_by_wallet_id: MagicMock,
    mock_get_telegram_user_by_wallet_id: MagicMock,
    mock_set_allow_notification: MagicMock,
    client,
    telegram_id: str | None,
    wallet_id: str,
    user_telegram_id: str | None,
    expected_status_code: int,
    expected_response: dict,
) -> None:
    """
    Test subscribe_to_notification endpoint with both positive and negative cases.

    :param client: fastapi.testclient.TestClient
    :param mock_get_user_by_wallet_id: unittest.mock.MagicMock for get_user_by_wallet_id
    :param mock_get_telegram_user_by_wallet_id: unittest.mock.MagicMock 
                                             for get_telegram_user_by_wallet_id
    :param mock_set_allow_notification: unittest.mock.MagicMock for set_allow_notification
    :param telegram_id: str[Telegram ID of the user]
    :param wallet_id: str[Wallet ID of the user] 
    :param user_telegram_id: str[Telegram ID of the db user]
    :param expected_status_code: int[Expected HTTP status code]
    :param expected_response: dict[Expected JSON response]
    :return: None
    """
    # Define the behavior of the mocks
    mock_set_allow_notification.return_value = True
    
    mock_get_user_by_wallet_id.return_value = None
    if wallet_id != "invalid_wallet_id":
        mock_get_user_by_wallet_id.return_value = User(
            wallet_id=wallet_id,
            is_contract_deployed=True,
        )
    
    mock_get_telegram_user_by_wallet_id.return_value = None
    if user_telegram_id:
        tg_user = TelegramUser(
            telegram_id=user_telegram_id,
            wallet_id=wallet_id,
        )
        mock_get_telegram_user_by_wallet_id.return_value = tg_user

    data = {"telegram_id": telegram_id, "wallet_id": wallet_id}
    
    response = client.post(
        url="/api/subscribe-to-notification",
        json=data,
    )
    
    assert response.status_code == expected_status_code
    if expected_response:
        assert response.json() == expected_response


@pytest.mark.asyncio
@patch("web_app.contract_tools.blockchain_call.CLIENT.withdraw_all")
@patch("web_app.api.user.user_db.get_contract_address_by_wallet_id")
@pytest.mark.parametrize(
    "wallet_id, contract_address, withdrawal_results, expected_status_code, expected_response",
    [
        # Positive case - successful withdrawal
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
            {"ETH": "success", "USDT": "success"},
            200,
            {
                "detail": "Successfully initiated withdrawals for all tokens",
                "results": {"ETH": "success", "USDT": "success"}
            }
        ),
        # Negative case - contract not found
        (
            "invalid_wallet_id",
            None,
            None,
            404,
            {"detail": "Contract not found"}
        ),
        # Negative case - empty wallet_id
        (
            "",
            None,
            None,
            404,
            {"detail": "Contract not found"}
        ),
        # Edge case - valid wallet but no tokens to withdraw
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
            {},
            200,
            {
                "detail": "Successfully initiated withdrawals for all tokens",
                "results": {}
            }
        ),
    ],
)
async def test_withdraw_all(
    mock_get_contract_address: MagicMock,
    mock_withdraw_all: MagicMock,
    client: client,
    wallet_id: str,
    contract_address: str,
    withdrawal_results: dict,
    expected_status_code: int,
    expected_response: dict,
) -> None:
    """
    Test withdraw_all endpoint with various scenarios
    
    :param mock_get_contract_address: Mock for get_contract_address_by_wallet_id
    :param mock_withdraw_all: Mock for CLIENT.withdraw_all
    :param client: FastAPI test client
    :param wallet_id: Wallet ID to test
    :param contract_address: Expected contract address
    :param withdrawal_results: Mock results from withdrawal operation
    :param expected_status_code: Expected HTTP status code
    :param expected_response: Expected response body
    :return: None
    """
    # Configure mocks
    mock_get_contract_address.return_value = contract_address
    if withdrawal_results is not None:
        mock_withdraw_all.return_value = withdrawal_results

    response = client.post(
        url="/api/withdraw-all",
        params={"wallet_id": wallet_id},
    )

    assert response.status_code == expected_status_code
    assert response.json() == expected_response

    mock_get_contract_address.assert_called_once_with(wallet_id)
    if contract_address:
        mock_withdraw_all.assert_called_once_with(contract_address)