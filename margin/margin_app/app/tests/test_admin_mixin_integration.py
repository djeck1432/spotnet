"""
Integration tests for AdminMixin with database operations
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from decimal import Decimal
from typing import List
import uuid

from app.contract_tools.mixins.admin import AdminMixin
from app.models.pool import Pool, UserPool, PoolRiskStatus


class TestAdminMixinIntegration:
    """Integration test cases for AdminMixin with real database models"""

    @pytest.mark.asyncio
    async def test_get_asset_statistics_with_real_models(self):
        """Test asset statistics calculation with realistic model data"""
        
        # Create mock pools
        mock_pool_eth = Pool(
            id=uuid.uuid4(),
            token="ETH", 
            risk_status=PoolRiskStatus.LOW
        )
        mock_pool_strk = Pool(
            id=uuid.uuid4(),
            token="STRK",
            risk_status=PoolRiskStatus.HIGH
        )
        
        # Create mock user pools with realistic data
        mock_user_pools = [
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool_eth.id,
                amount=Decimal("10.5"),
                pool=mock_pool_eth
            ),
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool_eth.id,
                amount=Decimal("5.0"),
                pool=mock_pool_eth
            ),
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool_strk.id,
                amount=Decimal("100.0"),
                pool=mock_pool_strk
            ),
        ]
        
        # Mock price data
        mock_prices = {
            "ETH": Decimal("2000.0"),
            "STRK": Decimal("1.5"),
            "USDC": Decimal("1.0")  # Extra price that won't be used
        }
        
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_all_objects.return_value = mock_user_pools
            
            with patch.object(AdminMixin, 'get_current_prices', return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()
                
                assert len(result) == 2
                
                # Verify ETH calculations
                eth_stat = next((stat for stat in result if stat['token'] == 'ETH'), None)
                assert eth_stat is not None
                assert eth_stat['total_amount'] == Decimal("15.5")  # 10.5 + 5.0
                assert eth_stat['total_value'] == Decimal("31000.0")  # 15.5 * 2000.0
                
                # Verify STRK calculations  
                strk_stat = next((stat for stat in result if stat['token'] == 'STRK'), None)
                assert strk_stat is not None
                assert strk_stat['total_amount'] == Decimal("100.0")
                assert strk_stat['total_value'] == Decimal("150.0")  # 100.0 * 1.5

    @pytest.mark.asyncio
    async def test_get_asset_statistics_performance_large_dataset(self):
        """Test asset statistics with a large number of user pools"""
        
        # Create many pools with the same token to test aggregation
        mock_pool = Pool(
            id=uuid.uuid4(),
            token="ETH",
            risk_status=PoolRiskStatus.LOW
        )
        
        # Create 1000 user pools
        mock_user_pools = []
        expected_total = Decimal("0")
        for i in range(1000):
            amount = Decimal(f"{i + 1}.0")  # 1.0, 2.0, 3.0, ..., 1000.0
            expected_total += amount
            
            mock_user_pools.append(UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool.id,
                amount=amount,
                pool=mock_pool
            ))
        
        mock_prices = {"ETH": Decimal("2000.0")}
        expected_value = expected_total * Decimal("2000.0")
        
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_all_objects.return_value = mock_user_pools
            
            with patch.object(AdminMixin, 'get_current_prices', return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()
                
                assert len(result) == 1
                assert result[0]['token'] == 'ETH'
                assert result[0]['total_amount'] == expected_total
                assert result[0]['total_value'] == expected_value

    @pytest.mark.asyncio
    async def test_get_asset_statistics_decimal_precision(self):
        """Test that decimal precision is maintained throughout calculations"""
        
        mock_pool = Pool(
            id=uuid.uuid4(),
            token="ETH",
            risk_status=PoolRiskStatus.LOW
        )
        
        # Use amounts with high precision
        mock_user_pools = [
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool.id,
                amount=Decimal("0.123456789"),
                pool=mock_pool
            ),
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool.id,
                amount=Decimal("0.987654321"),
                pool=mock_pool
            )
        ]
        
        # High precision price
        mock_prices = {"ETH": Decimal("2000.123456789")}
        
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_all_objects.return_value = mock_user_pools
            
            with patch.object(AdminMixin, 'get_current_prices', return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()
                
                assert len(result) == 1
                expected_amount = Decimal("0.123456789") + Decimal("0.987654321")
                expected_value = expected_amount * Decimal("2000.123456789")
                
                assert result[0]['total_amount'] == expected_amount
                assert result[0]['total_value'] == expected_value

    @pytest.mark.asyncio
    async def test_get_asset_statistics_multiple_users_same_pool(self):
        """Test asset statistics with multiple users in the same pool"""
        
        mock_pool = Pool(
            id=uuid.uuid4(),
            token="USDC",
            risk_status=PoolRiskStatus.MEDIUM
        )
        
        # Multiple users with different amounts in the same pool
        user_amounts = [Decimal("100.0"), Decimal("250.5"), Decimal("75.25"), Decimal("1000.0")]
        mock_user_pools = []
        
        for amount in user_amounts:
            mock_user_pools.append(UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),  # Different user each time
                pool_id=mock_pool.id,
                amount=amount,
                pool=mock_pool
            ))
        
        mock_prices = {"USDC": Decimal("1.0")}
        expected_total = sum(user_amounts)
        
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_all_objects.return_value = mock_user_pools
            
            with patch.object(AdminMixin, 'get_current_prices', return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()
                
                assert len(result) == 1
                assert result[0]['token'] == 'USDC'
                assert result[0]['total_amount'] == expected_total
                assert result[0]['total_value'] == expected_total  # Price is 1.0

    @pytest.mark.asyncio 
    async def test_get_asset_statistics_zero_amounts(self):
        """Test handling of zero amounts in user pools"""
        
        mock_pool = Pool(
            id=uuid.uuid4(),
            token="ETH",
            risk_status=PoolRiskStatus.LOW
        )
        
        mock_user_pools = [
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool.id,
                amount=Decimal("0"),
                pool=mock_pool
            ),
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool.id,
                amount=Decimal("10.0"),
                pool=mock_pool
            )
        ]
        
        mock_prices = {"ETH": Decimal("2000.0")}
        
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_all_objects.return_value = mock_user_pools
            
            with patch.object(AdminMixin, 'get_current_prices', return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()
                
                assert len(result) == 1
                assert result[0]['total_amount'] == Decimal("10.0")
                assert result[0]['total_value'] == Decimal("20000.0")

    @pytest.mark.asyncio
    async def test_get_asset_statistics_multiple_tokens_edge_cases(self):
        """Test edge cases with multiple tokens"""
        
        # Pool with no price data
        mock_pool_unknown = Pool(
            id=uuid.uuid4(),
            token="UNKNOWN_TOKEN",
            risk_status=PoolRiskStatus.HIGH
        )
        
        # Pool with zero price
        mock_pool_zero = Pool(
            id=uuid.uuid4(),
            token="ZERO_TOKEN", 
            risk_status=PoolRiskStatus.LOW
        )
        
        # Pool with normal price
        mock_pool_normal = Pool(
            id=uuid.uuid4(),
            token="NORMAL_TOKEN",
            risk_status=PoolRiskStatus.MEDIUM
        )
        
        mock_user_pools = [
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool_unknown.id,
                amount=Decimal("100.0"),
                pool=mock_pool_unknown
            ),
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool_zero.id,
                amount=Decimal("50.0"),
                pool=mock_pool_zero
            ),
            UserPool(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                pool_id=mock_pool_normal.id,
                amount=Decimal("25.0"),
                pool=mock_pool_normal
            )
        ]
        
        # Missing UNKNOWN_TOKEN, zero price for ZERO_TOKEN
        mock_prices = {
            "ZERO_TOKEN": Decimal("0"),
            "NORMAL_TOKEN": Decimal("10.0")
        }
        
        with patch('app.contract_tools.mixins.admin.user_pool_crud') as mock_crud:
            mock_crud.get_all_objects.return_value = mock_user_pools
            
            with patch.object(AdminMixin, 'get_current_prices', return_value=mock_prices):
                result = await AdminMixin.get_asset_statistics()
                
                assert len(result) == 3
                
                # Check unknown token (no price)
                unknown_stat = next((stat for stat in result if stat['token'] == 'UNKNOWN_TOKEN'), None)
                assert unknown_stat['total_value'] == Decimal("0")
                
                # Check zero price token
                zero_stat = next((stat for stat in result if stat['token'] == 'ZERO_TOKEN'), None)
                assert zero_stat['total_value'] == Decimal("0")
                
                # Check normal token
                normal_stat = next((stat for stat in result if stat['token'] == 'NORMAL_TOKEN'), None)
                assert normal_stat['total_value'] == Decimal("250.0")  # 25.0 * 10.0
