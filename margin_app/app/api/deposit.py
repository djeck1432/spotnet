"""
This module contains the API routes for the Deposit model.
"""

from fastapi import APIRouter, status

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
    return await deposit_crud.create_deposit(
        deposit_in.user_id,
        deposit_in.token,
        deposit_in.amount,
        deposit_in.transaction_id,
    )


@router.post("/update/{deposit_id}", response_model=DepositResponse)
async def update_deposit(
    deposit_id: UUID,
    deposit_update: DepositUpdate,
):
    """
    Update a deposit by ID.
    :param deposit_id: str
    :param deposit_update: DepositUpdate data
    :param db: AsyncSession
    :return: Deposit
    """
    return await deposit_crud.update_deposit(
        deposit_id, deposit_update.model_dump(exclude_none=True)
    )
