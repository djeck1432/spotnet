"""
This module contains endpoints for managing liquidations.
"""

from uuid import UUID
from decimal import Decimal
from fastapi import HTTPException
from app.crud.liquidation import liquidation_crud  # Using the instance from the specified module
from app.schemas.liquidation import LiquidationResponse

async def liquidate_position(
    margin_position_id: UUID,
    bonus_amount: Decimal,
    bonus_token: str,
) -> LiquidationResponse:
    """
    Liquidates a margin position by creating a liquidation record.

    Args:
        margin_position_id (UUID): The ID of the margin position.
        bonus_amount (Decimal): The bonus amount applied.
        bonus_token (str): The token used for the bonus.

    Returns:
        LiquidationResponse: Details of the liquidation entry.
    """
    try:
        liquidation_entry = await liquidation_crud.liquidate_position(
            margin_position_id, bonus_amount, bonus_token
        )
        return LiquidationResponse(
            margin_position_id=liquidation_entry.margin_position_id,
            bonus_amount=liquidation_entry.bonus_amount,
            bonus_token=liquidation_entry.bonus_token,
            status="success",
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
