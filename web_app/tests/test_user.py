import httpx
import pytest

from web_app.api.serializers.transaction import UpdateUserContractRequest


@pytest.fixture(scope="function")
async def async_client():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        yield client


@pytest.mark.asyncio
async def test_get_user_contract(async_client):
    response = await async_client.get(
        url="/api/get-user-contract",
        params={
            "wallet_id": "",
        },
    )
    response_json = response.json()

    assert response.status_code == 200
    assert isinstance(response_json, int)


@pytest.mark.asyncio
async def test_check_user(async_client):
    response = await async_client.get(
        url="/api/check-user",
        params={
            "wallet_id": "",
        },
    )
    response_json = response.json()

    assert response.status_code == 200
    assert isinstance(response_json, dict)
    assert "is_contract_deployed" in response_json


@pytest.mark.asyncio
async def test_change_user_contract(async_client):
    data = UpdateUserContractRequest(
        wallet_id="",
        contract_address="",
    )

    response = await async_client.post(
        url="/api/update-user-contract",
        json=data.dict(),
    )
    response_json = response.json()

    assert response.status_code == 200
    assert isinstance(response_json, dict)
    assert "is_contract_deployed" in response_json


@pytest.mark.asyncio
async def test_get_user_contract_address(async_client):
    response = await async_client.get(
        url="/api/get-user-contract-address",
        params={
            "wallet_id": "",
        },
    )
    response_json = response.json()

    assert response.status_code == 200
    assert isinstance(response_json, dict)
    assert "contract_address" in response_json
