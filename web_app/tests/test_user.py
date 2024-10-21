from web_app.api.serializers.transaction import UpdateUserContractRequest
from web_app.api.main import app

import pytest

from fastapi.testclient import TestClient

client = TestClient(app=app)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id, expected_contract_address",
    [
        ("", ""),
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
        ),
    ],
)
async def test_get_user_contract(wallet_id: str, expected_contract_address: str):
    """
    Test get_user_contract endpoint
    :param wallet_id: "" or "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49"
    :param expected_contract_address: "" or "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0"
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
        assert response_json == expected_contract_address
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
    ],
)
async def test_check_user(wallet_id: str):
    """
    Test check_user endpoint
    :param wallet_id: "" or "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49"
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
    ],
)
async def test_change_user_contract(wallet_id: str, contract_address: str):
    """
    Test get_user_contract endpoint
    :param wallet_id: "" or "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49"
    :param contract_address: "" or "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0"
    :return: None
    """
    data = UpdateUserContractRequest(
        wallet_id=wallet_id,
        contract_address=contract_address,
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
    ],
)
async def test_get_user_contract_address(
    wallet_id: str, expected_contract_address: str
):
    """
    Test get_user_contract_address endpoint
    :param wallet_id: "" or "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49"
    :param expected_contract_address: "" or "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0"
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
    assert response_json.get("contract_address") == expected_contract_address
