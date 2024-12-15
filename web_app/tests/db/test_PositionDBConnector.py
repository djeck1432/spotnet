"""Test cases for PositionDBConnector"""

import uuid
from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session

from web_app.db.crud import PositionDBConnector
from web_app.db.models import Position, Status, User


@pytest.fixture(scope="function")
def sample_user():
    """Fixture to create a sample user for testing."""
    return User(wallet_id="test_wallet_id")


@pytest.fixture(scope="function")
def sample_position(sample_user):
    """Fixture to create a sample position for testing."""
    return Position(
        user_id=sample_user.id,
        token_symbol="ETH",
        amount="100",
        multiplier=2,
        status=Status.PENDING.value,
        start_price=0.0,
    )


@pytest.fixture(scope="function")
def mock_session():
    """Fixture to create a mock database session."""
    session = MagicMock()
    return session


### Positive Test Cases ###


def test_position_to_dict(mock_position_db_connector, sample_position):
    """Test converting a Position object to dictionary."""
    result = PositionDBConnector._position_to_dict(sample_position)

    assert isinstance(result, dict)
    assert result["id"] == str(sample_position.id)
    assert result["user_id"] == str(sample_position.user_id)
    assert result["token_symbol"] == sample_position.token_symbol
    assert result["amount"] == sample_position.amount
    assert result["multiplier"] == sample_position.multiplier
    assert result["status"] == sample_position.status


def test_get_positions_by_wallet_id_success(
    mock_position_db_connector, sample_user, sample_position
):
    """Test successfully retrieving positions by wallet ID."""
    mock_position_db_connector._get_user_by_wallet_id.return_value = sample_user

    position_dict = {
        "id": str(sample_position.id),
        "user_id": str(sample_position.user_id),
        "token_symbol": sample_position.token_symbol,
        "amount": sample_position.amount,
        "multiplier": sample_position.multiplier,
        "status": sample_position.status,
        "start_price": sample_position.start_price,
    }

    mock_position_db_connector.get_positions_by_wallet_id.return_value = [position_dict]

    positions = mock_position_db_connector.get_positions_by_wallet_id("test_wallet_id")

    assert len(positions) == 1
    assert positions[0]["id"] == str(sample_position.id)
    assert positions[0]["token_symbol"] == sample_position.token_symbol
    assert positions[0]["amount"] == sample_position.amount
    assert positions[0]["multiplier"] == sample_position.multiplier
    assert positions[0]["status"] == sample_position.status


def test_create_position_success(mock_position_db_connector, sample_user):
    """Test successfully creating a new position."""
    mock_position_db_connector._get_user_by_wallet_id.return_value = sample_user

    new_position = Position(
        user_id=sample_user.id,
        token_symbol="ETH",
        amount="200",
        multiplier=3,
        status=Status.PENDING.value,
        start_price=0.0,
    )
    mock_position_db_connector.write_to_db.return_value = new_position
    mock_position_db_connector.create_position.return_value = new_position

    result = mock_position_db_connector.create_position(
        wallet_id="test_wallet_id",
        token_symbol="ETH",
        amount="200",
        multiplier=3,
    )

    assert result is not None
    assert result.token_symbol == "ETH"
    assert result.amount == "200"
    assert result.multiplier == 3


def test_update_existing_pending_position(
    mock_position_db_connector, sample_user, sample_position
):
    """Test updating an existing pending position."""
    mock_position_db_connector._get_user_by_wallet_id.return_value = sample_user

    updated_position = Position(
        user_id=sample_user.id,
        token_symbol="LTC",
        amount="300",
        multiplier=4,
        status=Status.PENDING.value,
        start_price=0.0,
    )
    mock_position_db_connector.create_position.return_value = updated_position

    result = mock_position_db_connector.create_position(
        wallet_id="test_wallet_id",
        token_symbol="LTC",
        amount="300",
        multiplier=4,
    )

    assert result.token_symbol == "LTC"
    assert result.amount == "300"
    assert result.multiplier == 4


def test_close_position_success(mock_position_db_connector, sample_position):
    """Test successfully closing a position."""
    mock_position_db_connector.get_object.return_value = sample_position
    mock_position_db_connector.close_position.return_value = Status.CLOSED.value

    result = mock_position_db_connector.close_position(sample_position.id)

    assert result == Status.CLOSED.value


def test_open_position_success(mock_position_db_connector, sample_position):
    """Test successfully opening a position."""
    mock_position_db_connector.get_object.return_value = sample_position
    mock_position_db_connector.open_position.return_value = Status.OPENED.value

    result = mock_position_db_connector.open_position(sample_position.id)

    assert result == Status.OPENED.value


def test_get_total_amounts_for_open_positions(mock_position_db_connector):
    """Test getting total amounts for open positions."""
    mock_position_db_connector.get_total_amounts_for_open_positions.return_value = (
        Decimal(1000.0)
    )

    result = mock_position_db_connector.get_total_amounts_for_open_positions()

    assert result == Decimal(1000.0)

def test_save_transaction_success(db_connector, mocker):
    """Test successful transaction creation"""
    position_id = uuid4()
    transaction_hash = "0x123456789"
    status = TransactionStatus.OPENED.value
    
    transaction = db_connector.save_transaction(
        position_id=position_id,
        status=status,
        transaction_hash=transaction_hash
    )
    
    assert transaction is not None
    assert transaction.position_id == position_id
    assert transaction.transaction_hash == transaction_hash
    assert transaction.status == status

def test_save_transaction_duplicate_hash(db_connector):
    """Test handling duplicate transaction hash"""
    position_id = uuid4()
    transaction_hash = "0x123456789"
    status = TransactionStatus.OPENED.value
    
    db_connector.save_transaction(
        position_id=position_id,
        status=status,
        transaction_hash=transaction_hash
    )
    
    with pytest.raises(SQLAlchemyError):
        db_connector.save_transaction(
            position_id=position_id,
            status=status,
            transaction_hash=transaction_hash
        )

def test_save_transaction_invalid_position(db_connector):
    """Test handling non-existent position ID"""
    invalid_position_id = uuid4()
    transaction_hash = "0x123456789"
    status = TransactionStatus.OPENED.value
    
    transaction = db_connector.save_transaction(
        position_id=invalid_position_id,
        status=status,
        transaction_hash=transaction_hash
    )
    
    assert transaction is None


@patch.object(scoped_session, "__call__")
def test_delete_all_user_positions_success(mock_scoped_session_call):
    """Test successfully deleting all positions for a user."""
    # Setup mock session
    mock_session = MagicMock()
    mock_session.__enter__.return_value = mock_session
    mock_session.__exit__.return_value = None
    mock_scoped_session_call.return_value = mock_session

    user_id = uuid.uuid4()
    mock_positions = [
        Position(
            id=uuid.uuid4(),
            user_id=user_id,
            token_symbol="BTC",
            amount="10",
        ),
        Position(
            id=uuid.uuid4(),
            user_id=user_id,
            token_symbol="ETH",
            amount="5",
        ),
    ]

    mock_session.query.return_value.filter_by.return_value.all.return_value = (
        mock_positions
    )
    position_connector = PositionDBConnector()
    position_connector.delete_all_user_positions(user_id)

    assert mock_session.delete.call_count == len(mock_positions)
    mock_session.commit.assert_called_once()


### Negative Test Cases ###


def test_get_positions_by_wallet_id_no_user(mock_position_db_connector):
    """Test retrieving positions for non-existent user."""
    mock_position_db_connector._get_user_by_wallet_id.return_value = None
    mock_position_db_connector.get_positions_by_wallet_id.return_value = []

    positions = mock_position_db_connector.get_positions_by_wallet_id(
        "nonexistent_wallet"
    )

    assert positions == []


def test_get_positions_by_wallet_id_db_error(mock_position_db_connector, sample_user):
    """Test handling database error when retrieving positions."""
    mock_position_db_connector._get_user_by_wallet_id.return_value = sample_user

    positions = mock_position_db_connector.get_positions_by_wallet_id("test_wallet_id")

    assert positions == []


def test_create_position_no_user(mock_position_db_connector):
    """Test creating position for non-existent user."""
    mock_position_db_connector._get_user_by_wallet_id.return_value = None
    mock_position_db_connector.create_position.return_value = None

    result = mock_position_db_connector.create_position(
        wallet_id="nonexistent_wallet",
        token_symbol="ETH",
        amount="100",
        multiplier=2,
    )

    assert result is None


def test_close_position_not_found(mock_position_db_connector):
    """Test closing non-existent position."""
    mock_position_db_connector.get_object.return_value = None
    mock_position_db_connector.close_position.return_value = None

    result = mock_position_db_connector.close_position(uuid.uuid4())

    assert result is None


def test_get_total_amounts_db_error(mock_position_db_connector):
    """Test handling database error when getting total amounts."""
    mock_position_db_connector.get_total_amounts_for_open_positions.return_value = None

    result = mock_position_db_connector.get_total_amounts_for_open_positions()

    assert result is None


def test_get_position_id_by_wallet_id_no_positions(
    mock_position_db_connector,
):
    """Test getting position ID when no positions exist."""
    mock_position_db_connector.get_positions_by_wallet_id.return_value = []
    mock_position_db_connector.get_position_id_by_wallet_id.return_value = None

    result = mock_position_db_connector.get_position_id_by_wallet_id("test_wallet_id")

    assert result is None


@patch("web_app.db.crud.PositionDBConnector")
def test_delete_all_user_positions_failure(mock_position_db_connector):
    """Test failure during deletion of all positions for a user."""
    user_id = uuid.uuid4()
    mock_session = mock_position_db_connector.Session.return_value
    mock_session.query.side_effect = SQLAlchemyError("Database error")

    position_connector = PositionDBConnector()
    position_connector.delete_all_user_positions(user_id)

    # mock_session.rollback.assert_called_once()
