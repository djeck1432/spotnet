"""
This module contains the API routes for the user.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status
from loguru import logger

from app.api.common import GetAllMediator
from app.crud.deposit import deposit_crud
from app.crud.user import user_crud
from app.schemas.user import (
    AddMarginPositionRequest,
    AddMarginPositionResponse,
    AddUserDepositRequest,
    AddUserDepositResponse,
    UserCreate,
    UserGetAllResponse,
    UserResponse,
)

router = APIRouter()


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(user: UserCreate) -> UserResponse:
    """
    Create a new user.

    Parameters:
    - wallet_id: str, the wallet ID of the user

    Returns:
    - UserResponse: The created user object
    """

    user_db = await user_crud.get_object_by_field(
        field="wallet_id", value=user.wallet_id
    )

    if user_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with such wallet_id laready exist.",
        )

    try:
        user = await user_crud.create_user(user.wallet_id)
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong.",
        ) from e
    return user


@router.get("/all", response_model=UserGetAllResponse, status_code=status.HTTP_200_OK)
async def get_all_users(
    limit: Optional[int] = Query(25, gt=0), offset: Optional[int] = Query(0, ge=0)
) -> UserGetAllResponse:
    """
    Get all users.
    :param limit: limit of users to return
    :param offset: offset of users to return
    :return: UserGetAllResponse
    """
    mediator = GetAllMediator(
        crud_object=user_crud,
        limit=limit,
        offset=offset,
    )
    mediator = await mediator()
    return UserGetAllResponse(items=mediator["items"], total=mediator["total"])


@router.get(
    "/user_id/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK
)
async def get_user_by_id(user_id: str) -> UserResponse:
    """
    Get user by user id.

    Parameters:
    - user_id: str, the ID of the user

    Returns:
    - UserResponse: The user object
    """
    user = await user_crud.get_object_by_field(field="id", value=user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )

    return user


@router.get(
    "/wallet_id/{wallet_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def get_user_by_wallet_id(wallet_id: str) -> UserResponse:
    """
    Get user by wallet id.

    Parameters:
    - wallet_id: str, the wallet ID of the user

    Returns:
    - UserResponse: The user object
    """
    user = await user_crud.get_object_by_field(field="wallet_id", value=wallet_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )

    return user


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


@router.post("/add_margin_position", response_model=AddMarginPositionResponse)
async def add_margin_position(
    request: AddMarginPositionRequest,
):
    """
    Adds a margin position for a user.

    This endpoint allows users to open a margin position by borrowing a specified
    amount with a given multiplier. A valid transaction ID is required.

    Parameters:
    - request (AddMarginPositionRequest): The request payload containing:
        - user_id (UUID): The ID of the user opening the margin position.
        - borrowed_amount (Decimal): The amount borrowed in the margin trade.
        - multiplier (int): The leverage multiplier.
        - token (str): The asset token for the margin position.
        - transaction_id (str): The associated transaction ID.

    Returns:
    - AddMarginPositionResponse: A response containing the created margin position ID.

    Raises:
    - HTTPException (400): If the user does not exist or any validation fails.
    """

    try:
        margin_position = await user_crud.add_margin_position(
            user_id=request.user_id,
            borrowed_amount=request.borrowed_amount,
            multiplier=request.multiplier,
            transaction_id=request.transaction_id,
        )
        return AddMarginPositionResponse(
            margin_position_id=margin_position.id,
            user_id=margin_position.user_id,
            multiplier=margin_position.multiplier,
            borrowed_amount=margin_position.borrowed_amount,
            transaction_id=margin_position.transaction_id,
            liquidated_at=margin_position.liquidated_at,
            status=margin_position.status,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
