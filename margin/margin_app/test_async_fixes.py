#!/usr/bin/env python3
"""
Quick verification test for fixed async mocking
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


async def test_async_mocking_fixes():
    """Test that our async mocking fixes work correctly"""
    print("Testing async mocking fixes...")
    
    # Create mock data
    mock_user_pools = [
        Mock(pool=Mock(token="USDC"), amount=Decimal("1000.50")),
        Mock(pool=Mock(token="ETH"), amount=Decimal("5.25")),
    ]
    
    mock_prices = {
        "USDC": Decimal("1.00"),
        "ETH": Decimal("2000.00"),
    }
    
    # Test the corrected mocking approach
    with patch('contract_tools.mixins.admin.user_pool_crud') as mock_crud:
        # Use AsyncMock for async method (CORRECT)
        mock_crud.get_objects = AsyncMock(return_value=mock_user_pools)
        
        # Use AsyncMock for async class method (CORRECT)
        with patch.object(AdminMixin, 'get_current_prices', new_callable=AsyncMock, return_value=mock_prices):
            try:
                result = await AdminMixin.get_asset_statistics()
                print(f"✅ Success! Result: {result}")
                
                # Verify we got expected results
                assert len(result) == 2
                tokens = [asset["token"] for asset in result]
                assert "USDC" in tokens
                assert "ETH" in tokens
                
                print("✅ All async mocking fixes working correctly!")
                return True
                
            except TypeError as e:
                if "can't be used in 'await' expression" in str(e):
                    print(f"❌ Still have async mocking issues: {e}")
                    return False
                else:
                    raise
            except Exception as e:
                print(f"❌ Other error: {e}")
                return False


async def main():
    """Run the verification test"""
    success = await test_async_mocking_fixes()
    return success


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
