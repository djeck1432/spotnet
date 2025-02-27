"""
This module contains the API routes for deposit.
"""

from fastapi import APIRouter
from uuid import UUID

from app.crud.deposit import deposit_crud
from app.schemas.deposit import DepositUpdate, DepositResponse

router = APIRouter()


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
