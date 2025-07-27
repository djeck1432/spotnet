"""
Unit tests for the UserDBConnector module.
"""

from unittest.mock import MagicMock, patch

import pytest

from web_app.db.crud import UserDBConnector
from web_app.db.models import User


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
    with patch(
        "web_app.db.crud.UserDBConnector.get_object_by_field",
        new_callable=MagicMock,
    ) as mock_get:
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
        User, "wallet_id", wallet_id
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
        User, "wallet_id", wallet_id
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
        User, "wallet_id", wallet_id
    )


def test_get_unique_users_count(mock_user_db_connector):
    """Test getting count of unique users."""
    mock_user_db_connector.get_unique_users_count.return_value = 5

    result = mock_user_db_connector.get_unique_users_count()

    assert result == 5


def test_create_user(user_db):
    """
    Test creating a user.
    """
    with patch.object(user_db, "write_to_db") as mock_write:
        user = user_db.create_user("wallet_123")
        assert user.wallet_id == "wallet_123"
        mock_write.assert_called_once()


def test_update_user_contract(user_db):
    """
    Test updating a user contract.
    """
    user = User(
        wallet_id="wallet_123", contract_address=None, is_contract_deployed=False
    )
    with patch.object(user_db, "write_to_db") as mock_write:
        user_db.update_user_contract(user, "0xABC")
        assert user.contract_address == "0xABC"
        assert user.is_contract_deployed is True
        mock_write.assert_called_once()


def test_get_users_for_notifications(user_db):
    """
    Test getting users for notifications.
    """
    mock_session = MagicMock()
    mock_context = mock_session.__enter__.return_value
    mock_query = mock_context.query.return_value
    (
        mock_query.join.return_value.join.return_value.filter.return_value.distinct.return_value.all.return_value  # noqa: E501
    ) = [
        ("0x123", "tg_id_1"),
        ("0x456", "tg_id_2"),
    ]

    with patch.object(user_db, "Session", return_value=mock_session):
        result = user_db.get_users_for_notifications()

    assert result == [("0x123", "tg_id_1"), ("0x456", "tg_id_2")]


def test_fetch_user_history(user_db):
    """
    Test fetching user history.
    """
    mock_session = MagicMock()
    mock_context = mock_session.__enter__.return_value
    mock_query = mock_context.query.return_value

    mock_positions = [
        MagicMock(
            status="OPENED",
            created_at="2024-01-01",
            start_price=100,
            amount=2,
            multiplier=5,
        )
    ]
    mock_query.filter.return_value.all.return_value = mock_positions

    with patch.object(user_db, "Session", return_value=mock_session):
        result = user_db.fetch_user_history(1)

    assert len(result) == 1
    assert result[0]["status"] == "OPENED"
    assert result[0]["start_price"] == 100


def test_delete_user_by_wallet_id(user_db):
    """
    Test deleting a user by wallet ID.
    """
    mock_session = MagicMock()
    mock_context = mock_session.__enter__.return_value
    mock_user = MagicMock()
    mock_context.query.return_value.filter.return_value.first.return_value = mock_user

    with patch.object(user_db, "Session", return_value=mock_session):
        user_db.delete_user_by_wallet_id("wallet_123")

    mock_context.delete.assert_called_once_with(mock_user)
    mock_context.commit.assert_called_once()


def test_delete_user_by_wallet_id_not_found(user_db):
    """
    Test deleting a user by wallet ID when user is not found.
    """
    mock_session = MagicMock()
    mock_query = mock_session.return_value.query.return_value
    mock_query.filter.return_value.first.return_value = None

    with patch.object(user_db, "Session", return_value=mock_session):
        user_db.delete_user_by_wallet_id("wallet_999")

    mock_session.return_value.delete.assert_not_called()
    mock_session.return_value.commit.assert_not_called()
