"""
test_vault.py
This module contains unit tests for the vault functionality within the web_app.
It verifies deposit operations, balance retrieval, and balance updates.
"""

import uuid
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from web_app.api.main import app
from web_app.db.crud import UserDBConnector

client = TestClient(app)


@pytest.fixture
async def async_client():
    """Fixture that provides an async client for testing."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.mark.anyio
@pytest.mark.parametrize(
    "test_data, expected_status, expected_response",
    [
        (
            {"wallet_id": "test_wallet", "symbol": "ETH", "amount": "1.0"},
            200,
            lambda vault_id: {
                "deposit_id": vault_id,
                "wallet_id": "test_wallet",
                "amount": "1.0",
                "symbol": "ETH",
            },
        ),
        (
            {
                "wallet_id": "invalid_wallet",
                "symbol": "ETH",
                "amount": "1.0",
            },
            404,
            {"detail": "User not found"},
        ),
    ],
)
async def test_deposit_to_vault(
    test_data,
    expected_status,
    expected_response,
    mock_user_db_connector,
    async_client,
):
    """Test vault deposit with different scenarios."""
    mock_user = MagicMock()
    mock_vault = MagicMock()
    mock_vault.id = str(uuid.uuid4())
    mock_vault.amount = test_data["amount"]

    with patch.object(UserDBConnector, "__new__", return_value=mock_user_db_connector):
        mock_user_db_connector.get_user_by_wallet_id.return_value = (
            mock_user if test_data["wallet_id"] == "test_wallet" else None
        )

        if test_data["wallet_id"] == "test_wallet":
            with patch(
                "web_app.db.crud.DepositDBConnector.create_vault",
                return_value=mock_vault,
            ):
                response = await async_client.post("/api/vault/deposit", json=test_data)
        else:
            response = await async_client.post("/api/vault/deposit", json=test_data)

    assert response.status_code == expected_status
    expected = (
        expected_response(mock_vault.id)
        if callable(expected_response)
        else expected_response
    )
    assert response.json() == expected


@pytest.mark.anyio
@pytest.mark.parametrize(
    "wallet_id, symbol, balance, expected_status, expected_response",
    [
        (
            "test_wallet",
            "ETH",
            "1.5",
            200,
            lambda w, s, b: {"wallet_id": w, "symbol": s, "amount": b},
        ),
        (
            "invalid_wallet",
            "ETH",
            None,
            404,
            {"detail": "Vault not found or user does not exist"},
        ),
    ],
)
async def test_get_vault_balance(
    wallet_id,
    symbol,
    balance,
    expected_status,
    expected_response,
    async_client,
):
    """Test vault balance retrieval with different scenarios."""
    with patch(
        "web_app.db.crud.DepositDBConnector.get_vault_balance",
        return_value=balance,
    ):
        url = f"/api/vault/balance?wallet_id={wallet_id}&symbol={symbol}"
        response = await async_client.get(url)

        assert response.status_code == expected_status
        expected = (
            expected_response(wallet_id, symbol, balance)
            if callable(expected_response)
            else expected_response
        )
        assert response.json() == expected


@pytest.mark.anyio
@pytest.mark.parametrize(
    "test_data, expected_status, expected_response",
    [
        (
            {"wallet_id": "test_wallet", "symbol": "ETH", "amount": "0.5"},
            200,
            lambda amount: {
                "wallet_id": "test_wallet",
                "symbol": "ETH",
                "amount": amount,
            },
        ),
        (
            {
                "wallet_id": "test_wallet",
                "symbol": "ETH",
                "amount": "-1.0",
            },
            400,
            {"detail": "Failed to update vault balance: Amount must be positive"},
        ),
    ],
)
async def test_add_vault_balance(
    test_data, expected_status, expected_response, async_client
):
    """Test adding to vault balance with different scenarios."""
    mock_vault = MagicMock()
    mock_vault.amount = "2.0"

    if test_data["amount"].startswith("-"):
        patch_kwargs = {"side_effect": ValueError("Amount must be positive")}
    else:
        patch_kwargs = {"return_value": mock_vault}

    with patch(
        "web_app.db.crud.DepositDBConnector.add_vault_balance",
        **patch_kwargs,
    ):
        response = await async_client.post("/api/vault/add_balance", json=test_data)

        assert response.status_code == expected_status
        expected = (
            expected_response(mock_vault.amount)
            if callable(expected_response)
            else expected_response
        )
        assert response.json() == expected
