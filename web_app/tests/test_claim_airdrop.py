import pytest
from unittest.mock import MagicMock
from web_app.tasks.claim_airdrops import claim_airdrop_task
from web_app.models import Airdrop

# Test case for successful claim using mock DB
def test_claim_airdrop_success(mock_db_connector):
    """Test successful airdrop claim."""
    # Mock the Airdrop object
    mock_airdrop = MagicMock(spec=Airdrop)
    mock_airdrop.id = 1
    mock_airdrop.claim_status = "pending"
    mock_db_connector.get_airdrop.return_value = mock_airdrop  # Mock DB fetch

    # Call the task with mocked db_connector
    result = claim_airdrop_task(airdrop_id=1, db_connector=mock_db_connector)

    # Assert results
    assert result["status"] == "success"
    assert "claimed successfully" in result["message"]
    mock_airdrop.claim_status = "claimed"
    mock_db_connector.commit.assert_called_once()

# Test case for when airdrop is not found
def test_claim_airdrop_not_found(mock_db_connector):
    """Test airdrop not found."""
    mock_db_connector.get_airdrop.return_value = None  # No airdrop found

    # Call the task with mocked db_connector
    result = claim_airdrop_task(airdrop_id=999, db_connector=mock_db_connector)

    # Assert results
    assert result["status"] == "failure"
    assert "does not exist" in result["error"]

# Test case for database error during claim process
def test_claim_airdrop_db_error(mock_db_connector):
    """Test database error during airdrop claim."""
    mock_db_connector.get_airdrop.side_effect = Exception("Database error")  # Simulate DB error

    # Call the task with mocked db_connector
    result = claim_airdrop_task(airdrop_id=1, db_connector=mock_db_connector)

    # Assert results
    assert result["status"] == "failure"
    assert "Database error" in result["error"]
