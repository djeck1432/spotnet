"""
Tests for MarginPositionCRUD class operations including positive and negative scenarios.
"""

import uuid
from decimal import Decimal
from unittest.mock import patch

import pytest

from app.crud.margin_position import MarginPositionCRUD
from app.models.margin_position import MarginPosition, MarginPositionStatus


@pytest.fixture
def margin_crud():
    """
    Fixture for the MarginPositionCRUD instance.
    """
    return MarginPositionCRUD()


@pytest.fixture
def sample_user_id():
    """
    Fixture for sample user ID.
    """
    return uuid.uuid4()


@pytest.fixture
def sample_position_id():
    """
    Fixture for sample position ID.
    """
    return uuid.uuid4()


@pytest.fixture
def sample_transaction_id():
    """
    Fixture for sample transaction ID.
    """
    return "tx_12345abcde"


@pytest.fixture
def sample_margin_position(sample_user_id, sample_position_id, sample_transaction_id):
    """
    Fixture for a sample margin position.
    """
    position = MarginPosition(
        id=sample_position_id,
        user_id=sample_user_id,
        borrowed_amount=Decimal("1000.00"),
        multiplier=5,
        transaction_id=sample_transaction_id,
        status=MarginPositionStatus.OPEN,
    )
    return position


@pytest.mark.asyncio
async def test_open_margin_position_success(
    margin_crud, sample_user_id, sample_transaction_id, sample_margin_position
):
    """
    Test successful opening of a margin position.
    """
    with patch.object(
        margin_crud, "write_to_db", return_value=sample_margin_position
    ) as mock_write:
        result = await margin_crud.open_margin_position(
            user_id=sample_user_id,
            borrowed_amount=Decimal("1000.00"),
            multiplier=5,
            transaction_id=sample_transaction_id,
        )

        assert mock_write.called
        assert isinstance(result, MarginPosition)
        assert result.user_id == sample_user_id
        assert result.borrowed_amount == Decimal("1000.00")
        assert result.multiplier == 5
        assert result.transaction_id == sample_transaction_id
        assert result.status == MarginPositionStatus.OPEN


@pytest.mark.asyncio
async def test_close_margin_position_success(
    margin_crud, sample_position_id, sample_margin_position
):
    """
    Test successful closing of a margin position.
    """
    with patch.object(
        margin_crud, "get_object", return_value=sample_margin_position
    ) as mock_get:
        with patch.object(margin_crud, "write_to_db") as mock_write:
            result = await margin_crud.close_margin_position(
                position_id=sample_position_id
            )

            mock_get.assert_called_once_with(MarginPosition, sample_position_id)
            assert mock_write.called
            assert result == MarginPositionStatus.CLOSED
            assert sample_margin_position.status == MarginPositionStatus.CLOSED


@pytest.mark.asyncio
async def test_open_margin_position_db_error(
    margin_crud, sample_user_id, sample_transaction_id
):
    """
    Test handling database error when opening a margin position.
    """
    with patch.object(
        margin_crud, "write_to_db", side_effect=Exception("Database error")
    ) as mock_write:
        with pytest.raises(Exception) as exc_info:
            await margin_crud.open_margin_position(
                user_id=sample_user_id,
                borrowed_amount=Decimal("1000.00"),
                multiplier=5,
                transaction_id=sample_transaction_id,
            )

        assert "Database error" in str(exc_info.value)


@pytest.mark.asyncio
async def test_close_margin_position_not_found(margin_crud, sample_position_id):
    """
    Test closing a margin position that doesn't exist.
    """
    with patch.object(margin_crud, "get_object", return_value=None) as mock_get:
        result = await margin_crud.close_margin_position(position_id=sample_position_id)

        mock_get.assert_called_once_with(MarginPosition, sample_position_id)
        assert result is None


@pytest.mark.asyncio
async def test_close_margin_position_already_closed(
    margin_crud, sample_position_id, sample_margin_position
):
    """
    Test attempting to close an already closed margin position.
    """
    sample_margin_position.status = MarginPositionStatus.CLOSED

    with patch.object(
        margin_crud, "get_object", return_value=sample_margin_position
    ) as mock_get:
        with patch.object(margin_crud, "write_to_db") as mock_write:
            result = await margin_crud.close_margin_position(
                position_id=sample_position_id
            )

            mock_get.assert_called_once_with(MarginPosition, sample_position_id)
            assert mock_write.called
            assert result == MarginPositionStatus.CLOSED


@pytest.mark.asyncio
async def test_close_margin_position_db_error(
    margin_crud, sample_position_id, sample_margin_position
):
    """
    Test handling database error when closing a margin position.
    """
    with patch.object(
        margin_crud, "get_object", return_value=sample_margin_position
    ) as mock_get:
        with patch.object(
            margin_crud, "write_to_db", side_effect=Exception("Database error")
        ) as mock_write:
            with pytest.raises(Exception) as exc_info:
                await margin_crud.close_margin_position(position_id=sample_position_id)

            assert mock_get.called
            assert mock_write.called
            assert "Database error" in str(exc_info.value)
