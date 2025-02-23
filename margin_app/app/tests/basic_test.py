"""
This module contains unit tests for the margin app.

It includes tests for:
- Health check endpoint
- Database connection
- Environment variables
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app  # Import the FastAPI app from your application code
from app.core.config import settings  # Import settings from your application code

client = TestClient(app)


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


@pytest.mark.asyncio
async def test_db_connection(db_session):
    """Test database connection is working"""
    assert db_session is not None


def test_environment_variables():
    """Test that required environment variables are set"""
    assert hasattr(settings, "DATABASE_URL"), "DATABASE_URL not found in settings"
    assert settings.DATABASE_URL is not None
    assert settings.DATABASE_URL.startswith("postgresql://")


@pytest.fixture
def db_session():
    """Fixture for database session"""
    from app.db.session import SessionLocal  # Ensure this import is correct

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()