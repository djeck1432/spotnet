"""
Test cases for TelegramUserDBConnector
"""

from unittest.mock import MagicMock, patch
from uuid import uuid4

import pytest

from web_app.db.crud import TelegramUserDBConnector
from web_app.db.models import TelegramUser


@pytest.fixture
def mock_db_connector():
    """
    Provides a mock for the database connector methods.
    """
    return MagicMock()


@pytest.fixture
def telegram_user_db(mock_db_connector):
    """
    Returns an instance of TelegramUserDBConnector with mocked DB methods.
    """
    with patch("web_app.db.crud.DBConnector.__init__", return_value=None):
        connector = TelegramUserDBConnector(db_url="sqlite:///:memory:")
        connector.engine = MagicMock()
        connector.session_factory = MagicMock()
        connector.Session = MagicMock()
        connector.get_object_by_field = MagicMock(
            side_effect=mock_db_connector.get_object_by_field
        )
        connector.write_to_db = mock_db_connector.write_to_db
        connector.delete_object_by_id = mock_db_connector.delete_object_by_id
        yield connector


def test_get_telegram_user_by_wallet_id_success(telegram_user_db, mock_db_connector):
    """
    Test retrieving a user by wallet ID when the user exists.
    """
    wallet_id = "w1"
    expected_user = TelegramUser(id=uuid4(), wallet_id=wallet_id, telegram_id="t1")
    mock_db_connector.get_object_by_field.return_value = expected_user
    result = telegram_user_db.get_telegram_user_by_wallet_id(wallet_id)
    assert result == expected_user
    mock_db_connector.get_object_by_field.assert_called_once_with(
        TelegramUser, "wallet_id", wallet_id
    )


def test_get_telegram_user_by_wallet_id_none(telegram_user_db, mock_db_connector):
    """
    Test retrieving a user by wallet ID when no user exists.
    """
    mock_db_connector.get_object_by_field.return_value = None
    result = telegram_user_db.get_telegram_user_by_wallet_id("unknown")
    assert result is None


def test_get_user_by_telegram_id_success(telegram_user_db, mock_db_connector):
    """
    Test retrieving a user by telegram ID when the user exists.
    """
    telegram_id = "t2"
    expected_user = TelegramUser(id=uuid4(), wallet_id="w2", telegram_id=telegram_id)
    mock_db_connector.get_object_by_field.return_value = expected_user
    result = telegram_user_db.get_user_by_telegram_id(telegram_id)
    assert result == expected_user


def test_get_wallet_id_by_telegram_id_success(telegram_user_db, mock_db_connector):
    """
    Test retrieving a wallet ID by telegram ID when the user exists.
    """
    telegram_id = "t3"
    user = TelegramUser(id=uuid4(), wallet_id="w3", telegram_id=telegram_id)
    mock_db_connector.get_object_by_field.return_value = user
    result = telegram_user_db.get_wallet_id_by_telegram_id(telegram_id)
    assert result == "w3"


def test_get_wallet_id_by_telegram_id_none(telegram_user_db, mock_db_connector):
    """
    Test retrieving a wallet ID by telegram ID when no user exists.
    """
    mock_db_connector.get_object_by_field.return_value = None
    result = telegram_user_db.get_wallet_id_by_telegram_id("unknown")
    assert result is None


def test_create_telegram_user_success(telegram_user_db, mock_db_connector):
    """
    Test creating a new telegram user successfully.
    """
    data = {"wallet_id": "w4", "telegram_id": "t4"}
    created_user = TelegramUser(id=uuid4(), **data)
    mock_db_connector.write_to_db.return_value = created_user
    result = telegram_user_db.create_telegram_user(data)
    assert result == created_user
    mock_db_connector.write_to_db.assert_called_once()


def test_update_telegram_user(telegram_user_db):
    """
    Test updating a telegram user.
    """
    telegram_user_db.Session = MagicMock()
    telegram_user_db.update_telegram_user("t5", {"wallet_id": "w5"})


def test_save_or_update_user_create(telegram_user_db, mock_db_connector):
    """
    Test save_or_update_user creates a user if they don't exist.
    """
    mock_db_connector.get_object_by_field.return_value = None
    data = {"wallet_id": "w6", "telegram_id": "t6"}
    new_user = TelegramUser(id=uuid4(), **data)
    mock_db_connector.write_to_db.return_value = new_user
    with patch.object(telegram_user_db, "update_telegram_user", MagicMock()):
        result = telegram_user_db.save_or_update_user(data)
        assert result == new_user


def test_save_or_update_user_update(telegram_user_db, mock_db_connector):
    """
    Test save_or_update_user updates a user if they already exist.
    """
    existing_user = TelegramUser(id=uuid4(), wallet_id="w7", telegram_id="t7")
    mock_db_connector.get_object_by_field.side_effect = [existing_user, existing_user]
    with patch.object(telegram_user_db, "update_telegram_user", MagicMock()):
        result = telegram_user_db.save_or_update_user(
            {"wallet_id": "w7_updated", "telegram_id": "t7"}
        )
        assert result.wallet_id == "w7"


def test_delete_telegram_user_success(telegram_user_db, mock_db_connector):
    """
    Test deleting a user that exists.
    """
    user = TelegramUser(id=uuid4(), wallet_id="w8", telegram_id="t8")
    mock_db_connector.get_object_by_field.return_value = user
    telegram_user_db.delete_telegram_user("t8")
    mock_db_connector.delete_object_by_id.assert_called_once()


def test_delete_telegram_user_none(telegram_user_db, mock_db_connector):
    """
    Test attempting to delete a user that does not exist.
    """
    mock_db_connector.get_object_by_field.return_value = None
    telegram_user_db.delete_telegram_user("unknown")
    mock_db_connector.delete_object_by_id.assert_not_called()


def test_set_allow_notification(telegram_user_db):
    """
    Test setting notification allowance for a user.
    """
    with patch.object(telegram_user_db, "save_or_update_user", return_value=True):
        result = telegram_user_db.set_allow_notification("t9", "w9")
        assert result is True
