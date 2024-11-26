"""
Unit tests for the UserDBConnector module.
"""

import pytest
from unittest.mock import MagicMock, patch
from web_app.db.models import User
from web_app.db.crud import UserDBConnector

@pytest.fixture
def mock_db_connector():
    """
    Fixture to create a mock database connector.
    """
    return MagicMock()

@pytest.fixture
def user_db(mock_db_connector):
    """
    Fixture to create a UserDBConnector instance with mocked dependencies.
    """
    with patch('web_app.db.crud.UserDBConnector.get_object_by_field',
               new_callable=MagicMock) as mock_get:
        mock_get.side_effect = mock_db_connector.get_object_by_field
        connector = UserDBConnector()
        yield connector

def test_get_user_by_wallet_id_success(user_db, mock_db_connector):
    """
    Test successful retrieval of user by wallet ID.
    """
    wallet_id = "0x123456789"
    expected_user = User(
        id=1,
        wallet_id=wallet_id,
    )

    mock_db_connector.get_object_by_field.return_value = expected_user

    result = user_db.get_user_by_wallet_id(wallet_id)

    assert result == expected_user
    mock_db_connector.get_object_by_field.assert_called_once_with(
        User,
        "wallet_id",
        wallet_id
    )

def test_get_user_by_wallet_id_not_found(user_db, mock_db_connector):
    """
    Test when user is not found by wallet ID.
    """
    wallet_id = "0x987654321"
    mock_db_connector.get_object_by_field.return_value = None

    result = user_db.get_user_by_wallet_id(wallet_id)

    assert result is None
    mock_db_connector.get_object_by_field.assert_called_once_with(
        User,
        "wallet_id",
        wallet_id
    )

def test_get_user_by_wallet_id_empty_wallet_id(user_db, mock_db_connector):
    """
    Test behavior when empty wallet ID is provided.
    """
    wallet_id = ""
    mock_db_connector.get_object_by_field.return_value = None

    result = user_db.get_user_by_wallet_id(wallet_id)

    assert result is None
    mock_db_connector.get_object_by_field.assert_called_once_with(
        User,
        "wallet_id",
        wallet_id
    )


def test_get_unique_users_count(mock_user_db_connector):
    """Test getting count of unique users."""
    mock_user_db_connector.get_unique_users_count.return_value = 5

    result = mock_user_db_connector.get_unique_users_count()

    assert result == 5

"""
2. Test Case: No Airdrops Exist
Scenario: The user has no airdrops.
Expectation: The function does not attempt to delete anything but commits successfully.
"""
def test_delete_all_users_airdrop_no_airdrops(mocker):
    mock_session = mocker.patch("self.Session", autospec=True)
    mock_db = mock_session.return_value.__enter__.return_value
    mock_query = mock_db.query.return_value
    mock_query.filter_by.return_value.all.return_value = []

    instance = YourClass()
    instance.delete_all_users_airdrop(user_id=uuid.uuid4())

    assert mock_query.filter_by.called_once_with(user_id=uuid.uuid4())
    mock_db.delete.assert_not_called()
    mock_db.commit.assert_called_once()

    """
1. Test Case: Normal Behavior
This test verifies that the method deletes all user positions and commits the transaction.

"""
def test_delete_all_user_positions_success(mocker):
    # Mock the database session and query
    mock_session = mocker.patch("crud.PositionDBConnector.Session", autospec=True)
    mock_db = mock_session.return_value.__enter__.return_value
    mock_query = mock_db.query.return_value
    mock_positions = [mocker.Mock(), mocker.Mock()]
    mock_query.filter_by.return_value.all.return_value = mock_positions

    # Create an instance of PositionDBConnector and call the method
    position_connector = PositionDBConnector()
    user_id = uuid.uuid4()
    position_connector.delete_all_user_positions(user_id=user_id)

    # Assertions
    mock_query.filter_by.assert_called_once_with(user_id=user_id)
    assert mock_db.delete.call_count == len(mock_positions)
    mock_db.commit.assert_called_once()

"""
2. Test Case: No Positions Exist
This test ensures the method handles the scenario where no positions exist for the user gracefully.

"""
def test_delete_all_user_positions_no_positions(mocker):
    # Mock the database session and query
    mock_session = mocker.patch("crud.PositionDBConnector.Session", autospec=True)
    mock_db = mock_session.return_value.__enter__.return_value
    mock_query = mock_db.query.return_value
    mock_query.filter_by.return_value.all.return_value = []

    # Create an instance of PositionDBConnector and call the method
    position_connector = PositionDBConnector()
    user_id = uuid.uuid4()
    position_connector.delete_all_user_positions(user_id=user_id)

    # Assertions
    mock_query.filter_by.assert_called_once_with(user_id=user_id)
    mock_db.delete.assert_not_called()
    mock_db.commit.assert_called_once()

"""
3. Test Case: Database Exception
This test ensures that when a database exception occurs, the method logs the error and does not raise an exception to the caller.

"""

def test_delete_all_user_positions_db_exception(mocker):
    # Mock the database session and query
    mock_session = mocker.patch("crud.PositionDBConnector.Session", autospec=True)
    mock_db = mock_session.return_value.__enter__.return_value
    mock_query = mock_db.query.return_value
    mock_query.filter_by.side_effect = SQLAlchemyError("Test Exception")

    # Mock the logger
    mock_logger = mocker.patch("crud.logger", autospec=True)

    # Create an instance of PositionDBConnector and call the method
    position_connector = PositionDBConnector()
    user_id = uuid.uuid4()
    position_connector.delete_all_user_positions(user_id=user_id)

    # Assertions
    mock_logger.error.assert_called_once_with(
        f"Error deleting positions for user {user_id}: Test Exception"
    )
    mock_db.commit.assert_not_called()