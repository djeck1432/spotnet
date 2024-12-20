"""
dashboard_tests.py
This module contains unit tests for the dashboard functionality within the web_app.
It verifies the successful retrieval of dashboard data, handling of missing positions 
and contract addresses, and ensures proper integration with external services like 
ZkLend. The tests also cover edge cases and error scenarios, including invalid wallet 
IDs and service failures, to confirm that the dashboard endpoint behaves reliably 
under various conditions.
"""

from datetime import datetime
from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

from web_app.api.dashboard import get_dashboard, position_db_connector, router
from web_app.api.serializers.dashboard import DashboardResponse
from web_app.contract_tools.mixins import HealthRatioMixin
from web_app.contract_tools.mixins.dashboard import DashboardMixin

BASE_URL = "http://test"

app = FastAPI()
app.include_router(router)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """
    Generic exception handler for unexpected server errors.

    This function handles uncaught exceptions and returns a JSON response with
    a 500 status code, indicating an internal server error. It is registered as
    an exception handler for all exceptions not handled by specific exception
    handlers.

    Args:
        request (Request): The incoming HTTP request that caused the exception.
        exc (Exception): The exception instance raised during the request.

    Returns:
        JSONResponse: A JSON response containing a "detail" key with a message
                      indicating an internal server error, with a 500 status code.
    """
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )


client = TestClient(router)


VALID_WALLET_ID = "0x1234567890abcdef"
INVALID_WALLET_ID = "invalid_wallet"
MOCK_CONTRACT_ADDRESS = "0x123456"
MOCK_POSITION = {
    "multiplier": 2,
    "created_at": datetime(2024, 1, 1).isoformat(),
}


MOCK_WALLET_BALANCES = {"ETH": "10.5", "USDC": "1000.0"}


@pytest.mark.asyncio
async def test_get_dashboard_success():
    """Test successful retrieval of dashboard data."""

    wallet_id = "0x1234567890abcdef"
    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id, patch(
        "web_app.api.dashboard.position_db_connector.get_positions_by_wallet_id"
    ) as mock_get_positions_by_wallet_id, patch(
        "web_app.contract_tools.mixins.health_ratio.HealthRatioMixin.get_health_ratio_and_tvl"
    ) as mock_get_health_ratio_and_tvl, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_wallet_balances",
        new_callable=AsyncMock,
    ) as mock_get_wallet_balances, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_current_position_sum",
        new_callable=AsyncMock,
    ) as mock_get_current_position_sum, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_start_position_sum",
        new_callable=AsyncMock,
    ) as mock_get_start_position_sum:

        mock_get_contract_address_by_wallet_id.return_value = "0xabcdef1234567890"
        mock_get_positions_by_wallet_id.return_value = [
            {
                "multiplier": 1,
                "created_at": "2024-01-01T00:00:00",
                "start_price": "100.0",
                "amount": "2.0",
                "token_symbol": "ETH",
                "id": "0",
            }
        ]
        mock_get_health_ratio_and_tvl.return_value = ("1.2", "1000.0")
        mock_get_wallet_balances.return_value = {
            "ETH": 5.0,
            "USDC": 1000.0,
        }
        mock_get_current_position_sum.return_value = Decimal("200.0")
        mock_get_start_position_sum.return_value = Decimal("200.0")

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url=BASE_URL
        ) as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.is_success
        data = response.json()

        assert data == {
            "multipliers": {"ETH": "1"},
            "start_dates": {"ETH": "2024-01-01T00:00:00"},
            "current_sum": "200.0",
            "start_sum": "200.0",
            "borrowed": "200000.00",
            "balance": "2.020202020202020202020202020",
            "health_ratio": "1.2",
            "position_id": "0",
        }


@pytest.mark.asyncio
async def test_get_dashboard_no_positions():
    """Test handling of wallet with no positions."""

    wallet_id = "0x1234567890abcdef"
    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id, patch(
        "web_app.api.dashboard.position_db_connector.get_positions_by_wallet_id"
    ) as mock_get_positions_by_wallet_id, patch(
        "web_app.contract_tools.mixins.health_ratio.HealthRatioMixin.get_health_ratio_and_tvl",
        new_callable=AsyncMock,
    ) as mock_get_health_ratio_and_tvl, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_wallet_balances",
        new_callable=AsyncMock,
    ) as mock_get_wallet_balances:
        mock_get_contract_address_by_wallet_id.return_value = "0xabcdef1234567890"
        mock_get_positions_by_wallet_id.return_value = []
        mock_get_wallet_balances.return_value = {
            "ETH": 5.0,
            "USDC": 1000.0,
        }
        # mock_get_zklend_position.return_value = {"products": []}
        mock_get_health_ratio_and_tvl.return_value = ("1.2", "1000.0")
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url=BASE_URL
        ) as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.is_success
        data = response.json()
        assert data["multipliers"] == {}
        assert data["start_dates"] == {}


@pytest.mark.asyncio
async def test_get_dashboard_no_contract_address():
    """Test handling of missing contract address."""

    wallet_id = "0x1234567890abcdef"
    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id, patch(
        "web_app.api.dashboard.position_db_connector.get_positions_by_wallet_id"
    ) as mock_get_positions_by_wallet_id, patch(
        "web_app.contract_tools.mixins.health_ratio.HealthRatioMixin.get_health_ratio_and_tvl",
        new_callable=AsyncMock,
    ) as mock_get_health_ratio_and_tvl, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_wallet_balances",
        new_callable=AsyncMock,
    ) as mock_get_wallet_balances:

        mock_get_contract_address_by_wallet_id.return_value = None
        mock_get_positions_by_wallet_id.return_value = []
        mock_get_wallet_balances.return_value = {
            "ETH": 5.0,
            "USDC": 1000.0,
        }
        # mock_get_zklend_position.return_value = {"products": []}
        mock_get_health_ratio_and_tvl.return_value = ("1.2", "1000.0")
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url=BASE_URL
        ) as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.is_success
        data = response.json()
        assert data["multipliers"] == {}
        assert data["start_dates"] == {}


@pytest.fixture(scope="function")
def mock_db_connector():
    """
    Fixture that provides a mocked instance of the PositionDBConnector
    used in the dashboard module. This mock allows for controlled testing
    of database-related functions without accessing the actual database,
    enabling the simulation of different responses and conditions.
    """
    with patch("web_app.api.dashboard.position_db_connector") as mock:
        yield mock


@pytest.fixture(scope="function")
def mock_dashboard_mixin():
    """
    Fixture that provides a mocked instance of the DashboardMixin used
    in the dashboard module. This mock allows for controlled testing of
    external service interactions (e.g., wallet balances and ZkLend positions)
    without relying on real API calls, enabling the simulation of various
    responses and error conditions.
    """
    with patch("web_app.contract_tools.mixins.dashboard.DashboardMixin") as mock:
        mock.get_wallet_balances = AsyncMock()
        mock.get_zklend_position = AsyncMock()
        yield mock


@pytest.fixture(scope="function")
def mock_health_ratio_mixin():
    """
    Fixture that provides a mocked instance of the HealthRatioMixin used
    in the dashboard module. This mock allows for controlled testing of
    external service interactions (e.g., health ratio and TVL) without
    relying on real API calls, enabling the simulation of various responses
    and error conditions.
    """
    with patch("web_app.contract_tools.mixins.health_ratio.HealthRatioMixin") as mock:
        mock.get_health_ratio_and_tvl = AsyncMock()
        yield mock


@pytest.mark.asyncio
async def test_invalid_wallet_id(mock_db_connector):
    """Test handling of invalid wallet ID."""

    mock_db_connector.get_contract_address_by_wallet_id.side_effect = ValueError(
        "Invalid wallet ID"
    )
    with pytest.raises(ValueError) as exc_info:
        await get_dashboard(INVALID_WALLET_ID)
    assert str(exc_info.value) == "Invalid wallet ID"


@pytest.mark.asyncio
async def test_empty_positions(
    mock_db_connector, mock_dashboard_mixin, mock_health_ratio_mixin
):
    """Test handling of wallet with no positions."""

    mock_db_connector.get_contract_address_by_wallet_id.return_value = (
        MOCK_CONTRACT_ADDRESS
    )
    mock_db_connector.get_positions_by_wallet_id.return_value = []
    DashboardMixin.get_wallet_balances = AsyncMock(return_value=MOCK_WALLET_BALANCES)
    # DashboardMixin.get_zklend_position = AsyncMock(return_value={"products": []})
    HealthRatioMixin.get_health_ratio_and_tvl = AsyncMock(
        return_value=("1.2", "1000.0")
    )

    response = await get_dashboard(VALID_WALLET_ID)
    assert isinstance(response, DashboardResponse)
    assert response.dict() == {
        "multipliers": {},
        "start_dates": {},
        "current_sum": Decimal("0"),
        "start_sum": Decimal("0"),
        "borrowed": "0",
        "balance": "0",
        "health_ratio": "0",
        "position_id": "0",
    }


@pytest.mark.asyncio
async def test_external_service_errors(mock_db_connector):
    """Test handling of external service failures."""

    mock_db_connector.get_contract_address_by_wallet_id.return_value = (
        MOCK_CONTRACT_ADDRESS
    )
    mock_db_connector.get_positions_by_wallet_id.return_value = [MOCK_POSITION]
    with patch(
        "web_app.contract_tools.mixins.health_ratio.HealthRatioMixin.get_health_ratio_and_tvl",
        side_effect=Exception("External API error"),
    ) as mock_get_health_ratio_and_tvl:
        with pytest.raises(Exception) as exc_info:
            await get_dashboard(VALID_WALLET_ID)
        assert str(exc_info.value) == "External API error"


# @pytest.mark.asyncio
# async def test_zklend_service_error(mock_db_connector):
#     """Test handling of ZkLend service failure."""

#     mock_db_connector.get_contract_address_by_wallet_id.return_value = (
#         MOCK_CONTRACT_ADDRESS
#     )
#     mock_db_connector.get_positions_by_wallet_id.return_value = [MOCK_POSITION]

#     DashboardMixin.get_wallet_balances = AsyncMock(return_value=MOCK_WALLET_BALANCES)
#     DashboardMixin.get_zklend_position = AsyncMock(
#         side_effect=Exception("ZkLend API error")
#     )
#     HealthRatioMixin.get_health_ratio_and_tvl = AsyncMock(
#         return_value=("1.2", "1000.0")
#     )
#     with pytest.raises(Exception) as exc_info:
#         await get_dashboard(VALID_WALLET_ID)

#     assert str(exc_info.value) == "ZkLend API error"
