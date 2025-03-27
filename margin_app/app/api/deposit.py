"""
This module contains the API routes for the Deposit model.
"""
from typing import Optional, List

from fastapi import APIRouter, status, HTTPException, Query


from app.models.deposit import Deposit
from uuid import UUID
from app.crud.deposit import deposit_crud
from app.schemas.deposit import DepositResponse, DepositCreate, DepositUpdate

router = APIRouter()


@router.post("", response_model=DepositResponse, status_code=status.HTTP_201_CREATED)
async def create_deposit(deposit_in: DepositCreate) -> DepositResponse:
    """
    Create a new deposit record in the database.
    :param: deposit_in: Schema for deposit creation

    :return: DepositResponse: The created deposit object with db ID assigned.
    """
    # TODO: get user by id, and throw a 400 if user does not exist
    #   Crud method for getting <obj> by id does not exist yet.

    try:
        return await deposit_crud.create_deposit(
            deposit_in.user_id,
            deposit_in.token,
            deposit_in.amount,
            deposit_in.transaction_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create deposit.",
        ) from e


@router.post("/{deposit_id}", response_model=Optional[DepositResponse])
async def update_deposit(
    deposit_id: UUID,
    deposit_update: DepositUpdate,
):
    """
    Update a deposit by ID.
    :param deposit_id: str
    :param deposit_update: DepositUpdate data

    :return: Deposit
    """
    return await deposit_crud.update_deposit(
        deposit_id, deposit_update.model_dump(exclude_none=True)
    )

@router.get("", response_model=List[DepositResponse], status_code=status.HTTP_200_OK)
async def get_all_deposits(
    limit: Optional[int] = Query(25, description="Number of deposits to retrive"),
    offset: Optional[int] = Query(0, description="Number of deposits to skip")
) -> List[DepositResponse]:
    """
    Get all deposit records from the database with pagination.
    :param limit: Max number of records to retrieve
    :param offset: Number of records to skip
    :return: List of DepositResponse schemas
    """
    try:
        deposits = await deposit_crud.get_objects(model=Deposit, limit=limit, offset=offset)
        return deposits
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve deposits",
        ) from e

@router.get("/{deposit_id}", response_model=DepositResponse, status_code=status.HTTP_200_OK)
async def get_deposit_by_id(deposit_id: UUID) -> DepositResponse:
    """
    Get a specific deposit by ID.
    :param deposit_id: UUID of the deposit to retrieve
    :return: DepositResponse schema
    """
    try:
        deposit = await deposit_crud.get_object_by_id(model=Deposit, obj_id=deposit_id)
        if not deposit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Deposit with ID {deposit_id} not found"
            )
        return deposit
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve deposit",
        ) from e
