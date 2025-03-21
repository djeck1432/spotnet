"""
This module contains the API routes for margin positions.
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.margin_position import margin_position_crud
from app.schemas.margin_position import (
    CloseMarginPositionResponse,
    MarginPositionCreate,
    MarginPositionResponse,
)

router = APIRouter()


@router.post("/open", response_model=MarginPositionResponse)
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
    try:
        position = await margin_position_crud.open_margin_position(
            user_id=position_data.user_id,
            borrowed_amount=position_data.borrowed_amount,
            multiplier=position_data.multiplier,
            transaction_id=position_data.transaction_id,
        )
        return position
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/close/{position_id}", response_model=CloseMarginPositionResponse)
async def close_margin_position(
    position_id: UUID,
) -> CloseMarginPositionResponse:
    """
    Close a margin position endpoint.

    Args:
        position_id (UUID): The unique identifier of the margin position to close
        db (AsyncSession): Database session dependency injected by FastAPI

    Returns:
        CloseMarginPositionResponse: Object containing the position ID and its updated status

    Raises:
        HTTPException: 404 error if the position is not found
    """
    status = await margin_position_crud.close_margin_position(position_id)

    if not status:
        raise HTTPException(
            status_code=404, detail=f"Margin position with id {position_id} not found"
        )

    return CloseMarginPositionResponse(position_id=position_id, status=status)


@router.get("/liquidated", response_model=List[MarginPositionResponse])
async def get_all_liquidated_positions() -> List[MarginPositionResponse]:
    """
    Retrieve all liquidated margin positions.

    Returns:
        List[MarginPositionResponse]: List of all liquidated margin positions

    Raises:
        HTTPException: If there's an error retrieving the positions
    """
    try:
        positions = await margin_position_crud.get_all_liquidated_positions()
        return positions
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving liquidated positions: {str(e)}"
        ) from e
