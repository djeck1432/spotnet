"""
Unit tests for AdminMixin class
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from decimal import Decimal
from typing import List, Dict

from app.contract_tools.mixins.admin import AdminMixin
from app.contract_tools.api_client import BaseAPIClient


class TestAdminMixin:
    """Test cases for AdminMixin class"""

    @pytest.mark.asyncio
    async def test_get_current_prices_success(self):
        """Test successful price retrieval"""
        # Mock API response
        mock_response = [
            {
                "address": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                "currentPrice": "2500.50"
            },
            {
                "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                "currentPrice": "1.0"
            }
        ]

        # Mock API client
        mock_api_client = AsyncMock(spec=BaseAPIClient)
        mock_api_client.get.return_value = mock_response

        # Mock TokenParams methods
        with patch('app.contract_tools.mixins.admin.TokenParams') as mock_token_params:
            mock_token_params.add_underlying_address.side_effect = lambda x: f"0x0{x[2:]}"
            mock_token_params.get_token_symbol.side_effect = lambda x: {
                "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d": "STRK",
                "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": "ETH"
            }.get(x)

            result = await AdminMixin.get_current_prices(api_client=mock_api_client)

            assert len(result) == 2
            assert result["STRK"] == Decimal("2500.50")
            assert result["ETH"] == Decimal("1.0")
            mock_api_client.get.assert_called_once_with("")

    @pytest.mark.asyncio
    async def test_get_current_prices_empty_response(self):
        """Test handling of empty API response"""
        mock_api_client = AsyncMock(spec=BaseAPIClient)
        mock_api_client.get.return_value = None

        result = await AdminMixin.get_current_prices(api_client=mock_api_client)

        assert result == {}

    @pytest.mark.asyncio
    async def test_get_current_prices_invalid_format(self):
        """Test handling of invalid API response format"""
        mock_api_client = AsyncMock(spec=BaseAPIClient)
        mock_api_client.get.return_value = {"error": "invalid format"}

        result = await AdminMixin.get_current_prices(api_client=mock_api_client)

        assert result == {}

    @pytest.mark.asyncio
    async def test_get_current_prices_missing_data(self):
        """Test handling of incomplete token data"""
        mock_response = [
            {
                "address": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                "currentPrice": "2500.50"
            },
            {
                "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
                # Missing currentPrice
            },
            {
                # Missing address
                "currentPrice": "1.0"
            }
        ]

        mock_api_client = AsyncMock(spec=BaseAPIClient)
        mock_api_client.get.return_value = mock_response

        with patch('app.contract_tools.mixins.admin.TokenParams') as mock_token_params:
            mock_token_params.add_underlying_address.side_effect = lambda x: f"0x0{x[2:]}"
            mock_token_params.get_token_symbol.return_value = "STRK"

            result = await AdminMixin.get_current_prices(api_client=mock_api_client)

            assert len(result) == 1
            assert result["STRK"] == Decimal("2500.50")

    @pytest.mark.asyncio
    async def test_get_asset_statistics_success(self):
        """Test successful asset statistics calculation"""
        # Mock user pools data
        mock_pool_eth = MagicMock()
        mock_pool_eth.token = "ETH"
        
        mock_pool_strk = MagicMock()
        mock_pool_strk.token = "STRK"

        mock_user_pools = [
            MagicMock(pool=mock_pool_eth, amount=Decimal("10.5")),
            MagicMock(pool=mock_pool_eth, amount=Decimal("5.0")),
            MagicMock(pool=mock_pool_strk, amount=Decimal("100.0")),
        ]

        # Mock prices
        mock_prices = {
            "ETH": Decimal("2000.0"),
            "STRK": Decimal("1.5")
        }

        # Mock user_pool_crud
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_objects = AsyncMock(return_value=mock_user_pools)

            # Mock the get_current_prices method
            with patch.object(AdminMixin, 'get_current_prices', new_callable=AsyncMock, return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()

                assert len(result) == 2
                
                # Find ETH and STRK in results
                eth_stat = next((stat for stat in result if stat['token'] == 'ETH'), None)
                strk_stat = next((stat for stat in result if stat['token'] == 'STRK'), None)
                
                assert eth_stat is not None
                assert eth_stat['total_amount'] == Decimal("15.5")  # 10.5 + 5.0
                assert eth_stat['total_value'] == Decimal("31000.0")  # 15.5 * 2000
                
                assert strk_stat is not None
                assert strk_stat['total_amount'] == Decimal("100.0")
                assert strk_stat['total_value'] == Decimal("150.0")  # 100 * 1.5

    @pytest.mark.asyncio
    async def test_get_asset_statistics_no_pools(self):
        """Test asset statistics with no user pools"""
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_objects = AsyncMock(return_value=[])

            result = await AdminMixin.get_asset_statistics()

            assert result == []

    @pytest.mark.asyncio
    async def test_get_asset_statistics_no_prices(self):
        """Test asset statistics when prices are not available"""
        mock_pool_eth = MagicMock()
        mock_pool_eth.token = "ETH"

        mock_user_pools = [
            MagicMock(pool=mock_pool_eth, amount=Decimal("10.5")),
        ]

        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_objects = AsyncMock(return_value=mock_user_pools)

            # Mock empty prices
            with patch.object(AdminMixin, 'get_current_prices', new_callable=AsyncMock, return_value={}):
                result = await AdminMixin.get_asset_statistics()

                assert len(result) == 1
                eth_stat = result[0]
                assert eth_stat['token'] == 'ETH'
                assert eth_stat['total_amount'] == Decimal("10.5")
                assert eth_stat['total_value'] == Decimal("0")  # No price available

    @pytest.mark.asyncio
    async def test_get_asset_statistics_crud_error(self):
        """Test handling of database errors"""
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_objects = AsyncMock(side_effect=Exception("Database error"))

            with pytest.raises(Exception) as exc_info:
                await AdminMixin.get_asset_statistics()

            assert "Failed to calculate asset statistics" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_get_asset_statistics_price_api_error(self):
        """Test handling of price API errors"""
        mock_pool_eth = MagicMock()
        mock_pool_eth.token = "ETH"

        mock_user_pools = [
            MagicMock(pool=mock_pool_eth, amount=Decimal("10.5")),
        ]

        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_objects = AsyncMock(return_value=mock_user_pools)

            # Mock price API error
            with patch.object(AdminMixin, 'get_current_prices', new_callable=AsyncMock, side_effect=Exception("API error")):
                with pytest.raises(Exception) as exc_info:
                    await AdminMixin.get_asset_statistics()

                assert "Failed to calculate asset statistics" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_get_current_prices_creates_own_client(self):
        """Test that method creates its own API client when none provided"""
        mock_response = [
            {
                "address": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                "currentPrice": "2500.50"
            }
        ]

        with patch('app.contract_tools.mixins.admin.BaseAPIClient') as mock_api_client_class:
            mock_client_instance = AsyncMock()
            mock_client_instance.get.return_value = mock_response
            mock_api_client_class.return_value = mock_client_instance

            with patch('app.contract_tools.mixins.admin.TokenParams') as mock_token_params:
                mock_token_params.add_underlying_address.side_effect = lambda x: f"0x0{x[2:]}"
                mock_token_params.get_token_symbol.return_value = "STRK"

                result = await AdminMixin.get_current_prices()

                # Verify client was created with correct base URL
                mock_api_client_class.assert_called_once()
                assert len(result) == 1
                assert result["STRK"] == Decimal("2500.50")

    @pytest.mark.asyncio
    async def test_get_asset_statistics_mixed_token_availability(self):
        """Test asset statistics with mixed token price availability"""
        # Mock user pools with different tokens
        mock_pool_eth = MagicMock()
        mock_pool_eth.token = "ETH"
        
        mock_pool_strk = MagicMock()
        mock_pool_strk.token = "STRK"
        
        mock_pool_unknown = MagicMock()
        mock_pool_unknown.token = "UNKNOWN"

        mock_user_pools = [
            MagicMock(pool=mock_pool_eth, amount=Decimal("10.0")),
            MagicMock(pool=mock_pool_strk, amount=Decimal("100.0")),
            MagicMock(pool=mock_pool_unknown, amount=Decimal("50.0")),
        ]

        # Mock prices - missing UNKNOWN token
        mock_prices = {
            "ETH": Decimal("2000.0"),
            "STRK": Decimal("1.5")
        }

        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_objects = AsyncMock(return_value=mock_user_pools)

            with patch.object(AdminMixin, 'get_current_prices', new_callable=AsyncMock, return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()

                assert len(result) == 3
                
                # Find each token in results
                eth_stat = next((stat for stat in result if stat['token'] == 'ETH'), None)
                strk_stat = next((stat for stat in result if stat['token'] == 'STRK'), None)
                unknown_stat = next((stat for stat in result if stat['token'] == 'UNKNOWN'), None)
                
                assert eth_stat['total_value'] == Decimal("20000.0")  # 10 * 2000
                assert strk_stat['total_value'] == Decimal("150.0")   # 100 * 1.5
                assert unknown_stat['total_value'] == Decimal("0")    # No price available
