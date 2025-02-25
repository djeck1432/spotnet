"""
This module contains the API routes for the Deposit model.
"""

from fastapi import APIRouter, status
from app.crud.deposit import deposit_crud
from app.schemas.deposit import DepositResponse, DepositCreate

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
