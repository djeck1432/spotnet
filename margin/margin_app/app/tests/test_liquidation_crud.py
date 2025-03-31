"""Tests for LiquidationCRUD in spotnet/margin_app/app/crud/liquidation.py"""

import pytest
from app.crud.liquidation import liquidation_crud
from app.crud.margin_position import margin_position_crud
from app.crud.user import UserCRUD


@pytest.mark.asyncio
async def test_create_liquidation_success(db_connector):
    """Test creating a liquidation record with valid data."""
    user_crud = UserCRUD()
    user = await user_crud.create_user("asdasda")
    margin = await margin_position_crud.open_margin_position(
        user_id=user.id, borrowed_amount=12, multiplier=12, transaction_id="asdas"
    )

    liquidation = await liquidation_crud.liquidate_position(
        margin_position_id=margin.id, bonus_amount=12, bonus_token="asdas"
    )
    assert liquidation is not None
