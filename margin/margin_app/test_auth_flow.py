#!/usr/bin/env python3
"""
Quick test to verify admin authentication fixes
"""
import asyncio
import sys
import os
from decimal import Decimal
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

async def test_admin_auth_flow():
    """Test the complete admin authentication flow"""
    print("Testing admin authentication flow...")
    
    test_admin_object = {
        "name": "test_name",
        "id": "12345",
        "email": "email@test.com",
        "is_super_admin": True,
    }

    def make_admin_obj(data):
        return SimpleNamespace(**data)
    
    try:
        from services.auth.base import get_current_user
        from crud.admin import admin_crud
        
        # Mock admin_crud.get_by_email to return a valid admin
        with patch.object(admin_crud, 'get_by_email', new_callable=AsyncMock) as mock_get_by_email:
            mock_get_by_email.return_value = make_admin_obj(test_admin_object)
            
            # Create a token
            from services.auth.base import create_access_token
            token = create_access_token(test_admin_object["email"])
            print(f"Created token for: {test_admin_object['email']}")
            
            # Test get_current_user
            user = await get_current_user(token)
            print(f"✅ get_current_user returned: {user.email}")
            
            # Verify the user has the expected attributes
            assert user.email == test_admin_object["email"]
            assert user.name == test_admin_object["name"]
            print("✅ User attributes match expected values")
            
            return True
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Run the auth flow test"""
    success = await test_admin_auth_flow()
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    print(f"\n{'✅ Authentication flow test passed!' if success else '❌ Authentication flow test failed!'}")
    sys.exit(0 if success else 1)
