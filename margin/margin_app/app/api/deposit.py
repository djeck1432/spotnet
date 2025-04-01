"""
This module contains the API routes for the Deposit model.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.common import GetAllMediator
from app.crud.deposit import deposit_crud
from app.models.deposit import Deposit
from app.schemas.deposit import (
    DepositCreate,
    DepositResponse,
    DepositUpdate,
    DepositGetAllResponse,
)

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


@router.get(
    "/all", response_model=DepositGetAllResponse, status_code=status.HTTP_200_OK
)
async def get_all_deposits(
    limit: Optional[int] = Query(25, gt=0),
    offset: Optional[int] = Query(0, ge=0),
) -> DepositGetAllResponse:
    """
    Fetch all deposits from the database.
    :param limit: set the limit of deposits to return
    :param offset: offset of deposits to return
    :return: DepositGetAllResponse: A dictionary containing the
    total count and the list of deposits.
    """
    mediator = GetAllMediator(
        crud_object=deposit_crud,
        limit=limit,
        offset=offset,
    )
    mediator = await mediator()
    return mediator


@router.get(
    "/{deposit_id}",
    response_model=DepositResponse,
    status_code=status.HTTP_200_OK,
)
async def get_deposit_by_id(
    deposit_id: UUID,
) -> DepositResponse:
    """
    Get deposit by ID.

    :param deposit_id: UUID - The ID of the deposit to retrieve
    :return: DepositResponse - The deposit object
    """
    deposit = await deposit_crud.get_object(deposit_id)

    if not deposit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deposit with id {deposit_id} not found",
        )

    return deposit
