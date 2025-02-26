"""
This module contains the API routes for margin positions.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.margin_position import margin_position_crud
from app.schemas.margin_position import MarginPositionCreate, MarginPositionResponse

router = APIRouter()


@router.post("/open_margin_position", response_model=MarginPositionResponse)
async def open_margin_position(
    position_data: MarginPositionCreate,
    db: AsyncSession = Depends(margin_position_crud.session),
):
    """
    Opens a margin position by creating an entry record in the database.
    :param position_data: MarginPositionCreate
    :param db: AsyncSession
    :return: MarginPositionResponse
    """
    position = await margin_position_crud.open_margin_position(
        user_id=position_data.user_id,
        borrowed_amount=position_data.borrowed_amount,
        multiplier=position_data.multiplier,
        transaction_id=position_data.transaction_id,
    )
    return position
