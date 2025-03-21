"""
This file handles all the API endpoints using fastAPI frameworkfor margin trading positions.
This script Open new margin trading positions, Close existing positions and shows all open margin trading positions requested by a user.
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

# Creating a router to handle all margin position API endpoints
router = APIRouter()


@router.post("/open", response_model=MarginPositionResponse)
async def open_margin_position(
    position_data: MarginPositionCreate,
    db: AsyncSession = Depends(margin_position_crud.session),
) -> MarginPositionResponse:
    """this endpoint allows you open a new margin trading position and saves it in the system;
    the user provides his ID, the amount the user wants to borrow, thw leverage the useris looking to utilize, and a transaction ID Which returns the details on the users new margin position
     error handling is added for invalid data, it displays a 400 error.
"""
    try:
        # this block of code saves the new margin position to the database.
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
    this endpoint aloows the user close a margin trade position by;
    providing the transaction ID of the position they want to close
    it runs through the database to find the ID, closes It and updates the status to #closed#

    404 error handling code was implemented to handle invalid data  
    """
    # this block of code tries to close the position
    status = await margin_position_crud.close_margin_position(position_id)

    # If the position was not found, display the 404 error.
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
    This block of code allows the user see all open margin trading positions,margi trading positions with all important details.
        i added ERROR handling if there is an issue with communication to the database during the course of retrieving information.
    """
    try:
        # these lines of code extracts all margin positions currentlyopen from the database.
        positions = await margin_position_crud.get_all()
        return positions
    except Exception as e:
        # letting the user know that there was an error with retrieving data.(either from the database or due to network or communication issues.)
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching margin positions: {str(e)}"
        ) from e
