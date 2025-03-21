"""
Based on the issues raised, this module contains the API routes for margin positions.
It provides endpoints for managing margin trading positions including;
Opening new margin positions
Closing existing positions
Retrieving all margin positions
"""

from uuid import UUID
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.margin_position import margin_position_crud
from app.schemas.margin_position import (
    CloseMarginPositionResponse,
    MarginPositionCreate,
    MarginPositionResponse,
)

# Initialize FastAPI router for margin position endpoints
router = APIRouter()


@router.post("/open", response_model=MarginPositionResponse)
async def open_margin_position(
    position_data: MarginPositionCreate,
    db: AsyncSession = Depends(margin_position_crud.session),
) -> MarginPositionResponse:
    """
    Opens a new margin position by creating an entry record in the database.

    This endpoint handles the creation of new margin trading positions.
    It validates the input data and creates a new position record.

    Args:
        position_data (MarginPositionCreate): The data required to create a new margin position,
            including user_id, borrowed_amount, multiplier, and transaction_id
        db (AsyncSession): Database session dependency provided by FastAPI

    Returns:
        MarginPositionResponse: The created margin position with all its details

    Raises:
        HTTPException: 400 error if the input data is invalid or business rules are violated
    """
    try:
        # Create new margin position using the CRUD operation
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
    db: AsyncSession = Depends(margin_position_crud.session),
) -> CloseMarginPositionResponse:
    """
    Close an existing margin position endpoint.

    This endpoint handles the closure of an existing margin trading position.
    It updates the position's status to closed and performs any necessary cleanup.
     Args:
        position_id (UUID): The unique identifier of the margin position to close
        db (AsyncSession): Database session dependency provided by FastAPI
    Returns:
        CloseMarginPositionResponse: Object containing the position ID and its updated status
     Raises:
        HTTPException: 404 error if the position is not found
    """
    # Attempt to close the margin position
    status = await margin_position_crud.close_margin_position(position_id)

    # Return 404 if position not found
    if not status:
        raise HTTPException(
            status_code=404, detail=f"Margin position with id {position_id} not found"
        )

    return CloseMarginPositionResponse(position_id=position_id, status=status)


@router.get("/", response_model=List[MarginPositionResponse])
async def get_all_margin_positions(
    db: AsyncSession = Depends(margin_position_crud.session),
) -> List[MarginPositionResponse]:
    """
    Get all margin positions endpoint.

    This endpoint retrieves a list of all margin trading positions in the system.
    It can be used for monitoring and reporting purposes.
    Args:
        db (AsyncSession): Database session dependency provided by FastAPI
    Returns:
        List[MarginPositionResponse]: List of all margin positions with their details
    Raises:
        HTTPException: 500 error if there's a database error or other internal server error
    """
    try:
        # Fetch all margin positions from the database
        positions = await margin_position_crud.get_all()
        return positions
    except Exception as e:
        # Handle any unexpected errors and return appropriate error response
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching margin positions: {str(e)}"
        ) from e
