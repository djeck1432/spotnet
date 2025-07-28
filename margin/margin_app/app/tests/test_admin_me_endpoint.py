"""
Test cases for the /admin/me endpoint.

This module contains tests for the admin profile endpoint that returns
the currently authenticated admin's data.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient
from fastapi import HTTPException
from uuid import uuid4

from app.main import app
from app.models.admin import Admin
from app.schemas.admin import AdminMeResponse


class TestAdminMeEndpoint:
    """Test cases for the /admin/me endpoint."""

    @pytest.mark.asyncio
    async def test_authenticated_access_returns_correct_data(self):
        """
        Test that authenticated access returns correct admin data.
        """
        # Create a mock admin user using a simple object instead of Admin model
        class MockAdmin:
            def __init__(self):
                self.id = "123e4567-e89b-12d3-a456-426614174000"
                self.email = "test@example.com"
                self.name = "Test Admin"
                self.is_super_admin = True
                self.password = "hashed_password"
        
        mock_admin = MockAdmin()

        # Mock the authentication middleware by patching get_admin_user_from_state in the correct module
        with patch('app.api.admin.get_admin_user_from_state', new_callable=AsyncMock) as mock_get_admin_user:
            mock_get_admin_user.return_value = mock_admin

            # Create test client
            with TestClient(app) as client:
                # Make request to /admin/me endpoint without Authorization header
                response = client.get("/api/admin/me")

                # Assert response
                assert response.status_code == 200
                data = response.json()
                
                # Verify correct fields are returned
                assert data["id"] == "123e4567-e89b-12d3-a456-426614174000"
                assert data["email"] == "test@example.com"
                assert data["name"] == "Test Admin"
                assert data["is_super_admin"] is True
                
                # Verify sensitive data is NOT returned
                assert "password" not in data
                assert "password_hash" not in data

    @pytest.mark.asyncio
    async def test_unauthorized_access_returns_401(self):
        """
        Test that unauthorized access returns 401 error.
        """
        # Test without Authorization header
        with TestClient(app) as client:
            # Make request to /admin/me endpoint without Authorization header
            response = client.get("/api/admin/me")

            # Assert response
            assert response.status_code == 401
            data = response.json()
            assert data["detail"] == "Missing authorization header."

    @pytest.mark.asyncio
    async def test_invalid_token_returns_401(self):
        """
        Test that invalid token returns 401 error.
        """
        # Mock the authentication middleware to raise an exception
        with patch('app.main.get_current_user', new_callable=AsyncMock) as mock_get_user:
            mock_get_user.side_effect = Exception("Invalid token")

            # Create test client
            with TestClient(app) as client:
                # Make request to /admin/me endpoint with invalid token
                response = client.get(
                    "/api/admin/me",
                    headers={"Authorization": "Bearer invalid-token"}
                )

                # Assert response
                assert response.status_code == 401
                data = response.json()
                assert data["detail"] == "Authentication error."

    @pytest.mark.asyncio
    async def test_response_structure_matches_schema(self):
        """
        Test that the response structure matches the expected schema.
        """
        # Create a mock admin user using a simple object
        class MockAdmin:
            def __init__(self):
                self.id = "123e4567-e89b-12d3-a456-426614174000"
                self.email = "test@example.com"
                self.name = "Test Admin"
                self.is_super_admin = False
                self.password = "hashed_password"
        
        mock_admin = MockAdmin()

        # Mock the authentication middleware
        with patch('app.api.admin.get_admin_user_from_state', new_callable=AsyncMock) as mock_get_admin_user:
            mock_get_admin_user.return_value = mock_admin

            # Create test client
            with TestClient(app) as client:
                # Make request to /admin/me endpoint without Authorization header
                response = client.get("/api/admin/me")

                # Assert response
                assert response.status_code == 200
                data = response.json()
                
                # Verify all required fields are present
                required_fields = ["id", "email", "name", "is_super_admin"]
                for field in required_fields:
                    assert field in data
                
                # Verify field types
                assert isinstance(data["id"], str)
                assert isinstance(data["email"], str)
                assert isinstance(data["name"], str) or data["name"] is None
                assert isinstance(data["is_super_admin"], bool)

    @pytest.mark.asyncio
    async def test_admin_with_null_name_handled_correctly(self):
        """
        Test that admin with null name is handled correctly.
        """
        # Create a mock admin user with null name using a simple object
        class MockAdmin:
            def __init__(self):
                self.id = "123e4567-e89b-12d3-a456-426614174000"
                self.email = "test@example.com"
                self.name = None
                self.is_super_admin = False
                self.password = "hashed_password"
        
        mock_admin = MockAdmin()

        # Mock the authentication middleware
        with patch('app.api.admin.get_admin_user_from_state', new_callable=AsyncMock) as mock_get_admin_user:
            mock_get_admin_user.return_value = mock_admin

            # Create test client
            with TestClient(app) as client:
                # Make request to /admin/me endpoint without Authorization header
                response = client.get("/api/admin/me")

                # Assert response
                assert response.status_code == 200
                data = response.json()
                
                # Verify null name is handled correctly
                assert data["name"] is None
                assert data["email"] == "test@example.com"
                assert data["is_super_admin"] is False 