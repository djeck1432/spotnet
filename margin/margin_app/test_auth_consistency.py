#!/usr/bin/env python3
"""
Simple test to verify authentication error message consistency
"""
import asyncio
import sys
import os
from unittest.mock import AsyncMock, patch

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

async def test_auth_error_consistency():
    """Test that authentication error messages are consistent"""
    print("Testing authentication error message consistency...")
    
    try:
        from api.admin import get_asset_statistics
        from fastapi import Request, HTTPException
        
        # Mock get_admin_user_from_state to return None (simulating unauthorized)
        with patch('api.admin.get_admin_user_from_state', new_callable=AsyncMock, return_value=None):
            try:
                # Create a mock request
                mock_request = AsyncMock(spec=Request)
                
                # Call the endpoint
                await get_asset_statistics(mock_request)
                print("❌ Expected HTTPException to be raised")
                return False
                
            except HTTPException as e:
                if e.status_code == 401 and e.detail == "Authentication error.":
                    print("✅ Endpoint returns correct error message: 'Authentication error.'")
                    return True
                else:
                    print(f"❌ Unexpected error: {e.status_code} - {e.detail}")
                    return False
                    
    except Exception as e:
        print(f"❌ Test setup failed: {e}")
        return False

async def main():
    """Run the consistency test"""
    success = await test_auth_error_consistency()
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    print(f"\n{'✅ Test passed!' if success else '❌ Test failed!'}")
    sys.exit(0 if success else 1)
