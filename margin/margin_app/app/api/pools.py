"""
This module contains the API routes for the pools.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from loguru import logger
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.pool import pool_crud, user_pool_crud
from app.db.sessions import get_db
from app.schemas.pools import (
    PoolCreate,
    PoolResponse,
    PoolRiskStatus,
    UserPoolCreate,
    UserPoolResponse,
    UserPoolUpdate,
    UserPoolUpdateResponse,
)

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


@router.get(
    "/get_all_pools",
    response_model=list[PoolResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_pools() -> list[PoolResponse]:
    """
    Fetch all pools

    :return: List[PoolResponse] - List of all pool entries fetched from the database
        (empty list if no pools exist)
    """
    try:
        return await pool_crud.get_all_pools()
    except Exception as e:
        logger.error(f"Error fetching pools: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong.",
        ) from e


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

@router.get(
    "/get_all_user_pools",
    response_model=list[UserPoolResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_user_pools(
    limit: Optional[int] = Query(25, gt=0),
    offset: Optional[int] = Query(0, ge=0)
) -> list[UserPoolResponse]:
    """
    Fetch all user pools

    Parameters:
    - limit: Optional[int] - maximum number of user pools to be retrieved
    - offset: Optional[int] - skip N first user pools

    :return: List[UserPoolResponse] - List of all user pool entries fetched from the database.
        An empty list is returned if no user pools exist)
    """
    try:
        return await user_pool_crud.get_all_user_pools(limit, offset)
    except Exception as e:
        logger.error(f"Error fetching user pools: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong.",
        ) from e
