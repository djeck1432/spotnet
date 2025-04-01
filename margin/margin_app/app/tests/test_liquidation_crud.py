"""Tests for LiquidationCRUD class operations."""

import pytest
from unittest.mock import AsyncMock, patch
from app.crud.liquidation import LiquidationCRUD
from app.models.liquidation import Liquidation
from app.crud.margin_position import margin_position_crud
from app.crud.user import UserCRUD
from app.models.user import User


@pytest.fixture
def liquidation_crud():
    """Fixture to create a LiquidationCRUD instance for testing."""
    return LiquidationCRUD(Liquidation)


@pytest.mark.asyncio
async def test_create_liquidation_success(liquidation_crud):
    """Test successfully creating a liquidation."""
    user_crud = UserCRUD(User)
    user = await user_crud.create_user("asdasda")
    margin = await margin_position_crud.open_margin_position(
        user_id=user.id, borrowed_amount=12, multiplier=12, transaction_id="asdas"
    )

    liquidation = await liquidation_crud.liquidate_position(
        margin_position_id=margin.id, bonus_amount=12, bonus_token="asdas"
    )
    assert liquidation is not None
