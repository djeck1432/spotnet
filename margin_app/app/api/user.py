"""
API for handling user endpoints
"""

from fastapi import APIRouter, HTTPException, status
from loguru import logger

from app.crud.deposit import deposit_crud
from app.schemas.user import AddUserDepositRequest, AddUserDepositResponse

router = APIRouter()


@router.post(
    "/add_user_deposit",
    status_code=status.HTTP_201_CREATED,
    response_model=AddUserDepositResponse,
)
async def add_user_deposit(user_deposit: AddUserDepositRequest):
    """
    Add an user deposit

    :param user_deposit: user id, amount, token, transaction_id
    :return: deposit id
    """
    try:
        deposit = await deposit_crud.create_deposit(
            user_id=user_deposit.user_id,
            token=user_deposit.token,
            amount=user_deposit.amount,
            transaction_id=user_deposit.transaction_id,
        )
        return AddUserDepositResponse(deposit_id=deposit.id)
    except Exception as e:
        logger.error(f"Error adding user deposit: {e}")
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
