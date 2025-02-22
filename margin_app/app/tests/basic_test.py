import pytest
from fastapi.testclient import TestClient
from app.main import app

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
    from app.core.config import settings
    
    assert settings.DATABASE_URL is not None
    assert settings.DATABASE_URL.startswith("postgresql://")

@pytest.fixture
def db_session():
    """Fixture for database session"""
    from app.db.session import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()