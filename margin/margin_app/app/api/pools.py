"""
This module contains the API routes for the pools.
"""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from loguru import logger

from app.api.common import GetAllMediator
from app.crud.pool import pool_crud, user_pool_crud
from app.schemas.pools import (
    PoolGetAllResponse,
    PoolResponse,
    PoolRiskStatus,
    UserPoolCreate,
    UserPoolResponse,
    UserPoolUpdate,
    UserPoolUpdateResponse,
    UserPoolGetAllResponse,
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


@router.get("/pools", response_model=PoolGetAllResponse, status_code=status.HTTP_200_OK)
async def get_all_pools(
    limit: Optional[int] = Query(25, gt=0), offset: Optional[int] = Query(0, ge=0)
) -> PoolGetAllResponse:
    """
    Fetch all pools

    :return: PoolGetAllResponse
        where:
        pools:List[Pool] List of all pool records fetched from the database
        total:int total number of pools.
    """
    mediator = GetAllMediator(
        crud_object=pool_crud,
        limit=limit,
        offset=offset,
    )
    mediator = await mediator()
    return UserPoolGetAllResponse(items=mediator["items"], total=mediator["total"])


@router.get(
    "/user_pools", response_model=UserPoolGetAllResponse, status_code=status.HTTP_200_OK
)
async def get_all_user_pools(
    limit: Optional[int] = Query(25, gt=0), offset: Optional[int] = Query(0, ge=0)
) -> UserPoolGetAllResponse:
    """
    Fetch all user pools

    Parameters:
    - limit: Optional[int] - maximum number of user pools to be retrieved
    - offset: Optional[int] - skip N first user pools

    :return: UserPoolGetAllResponse
        where:
        total: int - total number of user pools
        records: List[UserPoolResponse] - list of user pool records fetched from the database
    """
    mediator = GetAllMediator(
        crud_object=user_pool_crud,
        limit=limit,
        offset=offset,
    )
    mediator = await mediator()
    return UserPoolGetAllResponse(items=mediator["items"], total=mediator["total"])


@router.get(
    "/{pool_id}",
    response_model=PoolResponse,
    status_code=status.HTTP_200_OK,
)
async def get_pool(pool_id: UUID) -> PoolResponse:
    """
    Get a pool by its ID

    :param pool_id: UUID of the pool to fetch
    :return: PoolResponse - The pool if found
    :raises: HTTPException with 404 if pool not found
    """
    try:
        pool = await pool_crud.get_pool_by_id(pool_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:
        logger.error(f"Error fetching pool: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong.",
        ) from e

    if not pool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pool with id {pool_id} not found",
        )
    return pool


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
