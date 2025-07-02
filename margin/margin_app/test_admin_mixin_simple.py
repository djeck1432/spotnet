#!/usr/bin/env python3
"""
Simple test script to verify the AdminMixin implementation
"""
import asyncio
import sys
import os
from decimal import Decimal
from unittest.mock import AsyncMock, Mock, patch

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

# Import the AdminMixin
from contract_tools.mixins.admin import AdminMixin


class TestAdminMixin:
    """Test class for AdminMixin functionality"""
    
    async def test_get_asset_statistics_success(self):
        """Test successful asset statistics calculation"""
        print("Testing AdminMixin.get_asset_statistics()...")
        
        # Create mock data
        mock_user_pools = [
            Mock(pool=Mock(token="USDC"), amount=Decimal("1000.50")),
            Mock(pool=Mock(token="ETH"), amount=Decimal("5.25")),
            Mock(pool=Mock(token="USDC"), amount=Decimal("500.00")),
        ]
        
        mock_prices = {
            "USDC": Decimal("1.00"),
            "ETH": Decimal("2000.00"),
        }
        
        # Mock the get_current_prices method
        with patch.object(AdminMixin, 'get_current_prices', return_value=mock_prices) as mock_prices_method:
            # Mock the user_pool_crud.get_objects() method
            with patch('contract_tools.mixins.admin.user_pool_crud') as mock_crud:
                mock_crud.get_objects = AsyncMock(return_value=mock_user_pools)
                
                # Call the method
                result = await AdminMixin.get_asset_statistics()
                
                # Verify the result
                print(f"Result: {result}")
                
                # Expected result should aggregate USDC amounts: 1000.50 + 500.00 = 1500.50
                # USDC total value: 1500.50 * 1.00 = 1500.50
                # ETH total value: 5.25 * 2000.00 = 10500.00
                expected_assets = [
                    {"token": "USDC", "total_amount": Decimal("1500.50"), "total_value": Decimal("1500.50")},
                    {"token": "ETH", "total_amount": Decimal("5.25"), "total_value": Decimal("10500.00")}
                ]
                
                # Check that we have the expected tokens
                result_tokens = [asset["token"] for asset in result]
                print(f"Result tokens: {result_tokens}")
                
                # Check USDC stats
                usdc_asset = next((asset for asset in result if asset["token"] == "USDC"), None)
                if usdc_asset:
                    print(f"USDC asset: {usdc_asset}")
                    assert usdc_asset["total_amount"] == Decimal("1500.50")
                    assert usdc_asset["total_value"] == Decimal("1500.50")
                else:
                    print("ERROR: USDC asset not found in result")
                    return False
                
                # Check ETH stats
                eth_asset = next((asset for asset in result if asset["token"] == "ETH"), None)
                if eth_asset:
                    print(f"ETH asset: {eth_asset}")
                    assert eth_asset["total_amount"] == Decimal("5.25")
                    assert eth_asset["total_value"] == Decimal("10500.00")
                else:
                    print("ERROR: ETH asset not found in result")
                    return False
                
                print("✅ Test passed successfully!")
                return True
    
    async def test_get_current_prices(self):
        """Test the price fetching functionality"""
        print("Testing AdminMixin.get_current_prices()...")
        
        # Mock response from AVNU API - should be a list of token data
        mock_response_data = [
            {"address": "0x123", "currentPrice": "1.00"},
            {"address": "0x456", "currentPrice": "2000.50"},
        ]
        
        # Create a mock API client
        mock_api_client = AsyncMock()
        mock_api_client.get = AsyncMock(return_value=mock_response_data)
        
        # Mock TokenParams methods
        with patch('contract_tools.mixins.admin.TokenParams') as mock_token_params:
            mock_token_params.add_underlying_address.side_effect = lambda x: x
            mock_token_params.get_token_symbol.side_effect = lambda x: "USDC" if x == "0x123" else "ETH"
            
            # Call the class method with our mock client
            result = await AdminMixin.get_current_prices(api_client=mock_api_client)
            
            print(f"Result: {result}")
            
            # Verify API was called correctly
            mock_api_client.get.assert_called_once_with("")
            
            # Verify result format
            expected_result = {
                "USDC": Decimal("1.00"),
                "ETH": Decimal("2000.50")
            }
            
            assert result == expected_result
            print("✅ Price fetching test passed!")
            return True


async def main():
    """Run all tests"""
    test_instance = TestAdminMixin()
    
    try:
        # Test price fetching
        await test_instance.test_get_current_prices()
        print()
        
        # Test asset statistics
        await test_instance.test_get_asset_statistics_success()
        print()
        
        print("🎉 All tests passed!")
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
