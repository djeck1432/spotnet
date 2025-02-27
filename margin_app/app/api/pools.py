"""
This module contains the API routes for the pools.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.pool import pool_crud
from app.crud.pool import user_pool_crud
from app.schemas.pools import (
    UserPoolResponse,
    UserPoolCreate,
    UserPoolUpdateResponse,
    UserPoolUpdate,
    PoolCreate,
    PoolResponse,
    PoolRiskStatus,
)
from app.db.sessions import get_db

router = APIRouter()


@router.post(
    "/create_pool", response_model=PoolResponse, status_code=status.HTTP_201_CREATED
)
async def create_pool(token: str, risk_status: PoolRiskStatus) -> PoolResponse:
    """
    Create a new pool

    :param token: pool token (path parameter)
    :param risk_status: pool risk status
    :param db: database session
    :return: created pool
    """
    try:
        created_pool = await pool_crud.create_pool(token=token, risk_status=risk_status)
        if not created_pool:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Pool was not created.",
            )
    except Exception as e:
        logger.error(f"Error creating pool: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong.",
        ) from e

    return created_pool


@router.post(
    "/create_user_pool",
    response_model=UserPoolResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_user_pool(user_pool: UserPoolCreate) -> UserPoolResponse:
    """
    Create a new user pool

    :param user_pool: user id, pool id and amount to create
    :return: created user proposal with amount
    """
    try:
        proposal = await user_pool_crud.create_user_pool(
            user_id=user_pool.user_id,
            pool_id=user_pool.pool_id,
            amount=user_pool.amount,
        )
    except Exception as e:
        logger.error(f"Error creating user pool: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong.",
        ) from e

    return proposal


@router.post(
    "/update_user_pool",
    response_model=UserPoolUpdateResponse,
    status_code=status.HTTP_200_OK,
)
async def update_user_pool(user_pool: UserPoolUpdate) -> UserPoolUpdateResponse:
    """
    Update an existing user pool entry.

    :param user_pool: user pool id and amount to update.
    :return: Updated user pool entry.
    """
    try:
        updated_pool = await user_pool_crud.update_user_pool(
            user_pool_id=user_pool.user_pool_id, amount=user_pool.amount
        )

        if not updated_pool:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User pool entry not found.",
            )

    except Exception as e:
        logger.error(f"Error updating user pool: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while updating the user pool.",
        ) from e

    return updated_pool
