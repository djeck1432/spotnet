"""
This module contains the API routes for margin positions.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.common import GetAllMediator
from app.crud.liquidation import liquidation_crud
from app.crud.margin_position import margin_position_crud
from app.models.margin_position import MarginPosition
from app.schemas.liquidation import LiquidationRequest, LiquidationResponse
from app.schemas.margin_position import (CloseMarginPositionResponse,
                                         MarginPositionCreate,
                                         MarginPositionResponse)

router = APIRouter()


@router.post("/open", response_model=MarginPositionResponse)
async def open_margin_position(
    position_data: MarginPositionCreate,
) -> MarginPositionResponse:
    """
    Opens a margin position by creating an entry record in the database.

    Args:
        position_data: MarginPositionCreate - The margin position data

    Returns:
        MarginPositionResponse: The created margin position

    Raises:
        HTTPException: 400 error if the margin position could not be created
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

    Returns:
        CloseMarginPositionResponse: Object containing the position ID and its updated status

    Raises:
        HTTPException: 404 error if the position is not found
    """
    position_status = await margin_position_crud.close_margin_position(position_id)

    if not position_status:
        raise HTTPException(
            status_code=404, detail=f"Margin position with id {position_id} not found"
        )

    return CloseMarginPositionResponse(position_id=position_id, status=position_status)


@router.get(
    "/all",
    response_model=List[MarginPositionResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_positions(
    limit: Optional[int] = Query(None, description="Limit margin positions"),
    offset: int = Query(0, description="Offset for margin positions"),
) -> List[MarginPositionResponse]:
    """
    Get all margin positions.
    :param limit: Limit of margin positions to return
    :param offset: offset of margin positions to return
    :return: List of margin positions
    """
    mediator = GetAllMediator(margin_position_crud.get_all_positions, limit, offset)
    return await mediator.execute()


@router.get(
    "/{margin_position_id}",
    response_model=MarginPositionResponse,
    status_code=status.HTTP_200_OK,
)
async def get_margin_by_id(
    margin_position_id: UUID,
) -> MarginPositionResponse:
    """
    Get margin position by ID.

    :param margin_position_id: UUID - The ID of the margin position to retrieve
    :return: MarginPositionResponse - The margin position object
    """

    position = await margin_position_crud.get_object(MarginPosition, margin_position_id)

    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Margin position with id {margin_position_id} not found",
        )

    return position


@router.get("/liquidated", response_model=List[MarginPositionResponse])
async def get_all_liquidated_positions() -> List[MarginPositionResponse]:
    """
    Retrieve all liquidated margin positions.

    Returns:
        List[MarginPositionResponse]: List of all liquidated margin positions

    Raises:
        HTTPException: 500 error if there's an error retrieving the positions
    """
    try:
        positions = await margin_position_crud.get_all_liquidated_positions()
        return positions
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving liquidated positions: {str(e)}"
        ) from e


@router.post("/liquidate", response_model=LiquidationResponse)
async def liquidate_position(data: LiquidationRequest) -> LiquidationResponse:
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
            data.margin_position_id, data.bonus_amount, data.bonus_token
        )
        return LiquidationResponse(
            margin_position_id=liquidation_entry.margin_position_id,
            bonus_amount=liquidation_entry.bonus_amount,
            bonus_token=liquidation_entry.bonus_token,
            status="success",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
        ) from e
