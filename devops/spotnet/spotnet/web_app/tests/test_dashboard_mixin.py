"""
Test suite for the DashboardMixin class in the web_app.contract_tools.mixins.dashboard module.
"""

from unittest.mock import AsyncMock, patch

import pytest

from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.mixins.dashboard import DashboardMixin


@pytest.fixture
def mock_starknet_client():
    """Mock the StarkNet client."""
    with patch("web_app.contract_tools.mixins.dashboard.CLIENT") as mock:
        yield mock


@pytest.fixture
def mock_api_request():
    """Mock the API request class."""
    with patch("web_app.contract_tools.mixins.dashboard.APIRequest") as mock:
        yield mock


class TestDashboardMixin:
    """
    Test cases for the DashboardMixin class, focusing on the methods
    related to wallet balances, zkLend positions, and product extraction.
    """

    @pytest.mark.asyncio
    async def test_get_wallet_balances_success(self, mock_starknet_client):
        """
        Test successful retrieval of wallet balances.
        """
        # Mock the get_balance method with pre-defined token balances
        mock_starknet_client.get_balance = AsyncMock(side_effect=["10.5", "1000.0"])

        # Mock token parameters
        mock_tokens = [
            TokenParams.ETH,
            TokenParams.USDC,
        ]
        with patch.object(TokenParams, "tokens", return_value=mock_tokens):
            # Act
            result = await DashboardMixin.get_wallet_balances("0xHolderAddress")

        # Assert
        assert result == {"ETH": "10.5", "USDC": "1000.0"}

    @pytest.mark.asyncio
    async def test_get_wallet_balances_error_handling(self, mock_starknet_client):
        """
        Test wallet balances retrieval with error handling.
        """
        # Mock the get_balance method to throw an exception for the second token
        mock_starknet_client.get_balance = AsyncMock(
            side_effect=["10.5", Exception("error"), "1000.0"]
        )

        # Mock token parameters
        mock_tokens = [
            TokenParams.ETH,
            TokenParams.STRK,
            TokenParams.USDC,
        ]
        with patch.object(TokenParams, "tokens", return_value=mock_tokens):
            # Act
            result = await DashboardMixin.get_wallet_balances("0xHolderAddress")

        # Assert
        assert result == {"ETH": "10.5", "USDC": "1000.0"}
