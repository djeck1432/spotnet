"""
API endpoints for order management.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.crud.order import order_crud
from app.models.user_order import UserOrder
from app.schemas.order import UserOrderCreate, UserOrderGetAllResponse, UserOrderResponse


from typing import Optional

router = APIRouter()


@router.get(
    "/get_all_orders",
    status_code=status.HTTP_200_OK,
    summary="Get all orders",
    description="Gets all orders from database",
)
async def get_all_orders(
    limit: Optional[int] = Query(25, gt=0), offset: Optional[int] = Query(0, ge=0)
) -> UserOrderGetAllResponse:
    """
    Return all orders.

    Parameters:
    - limit: Optional[int] - max orders to be retrieved
    - offset: Optional[int] - start retrieving at

    Returns:
    - UserOrderGetAllResponse

    Raises:
        HTTPException: If there's an error retrieving orders
    """
    try:
        return await order_crud.get_all(limit, offset)       
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get orders: {str(e)}",
        )


@router.post(
    "/create_order",
    response_model=UserOrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new order",
    description="Creates a new order in the system",
)
async def create_order(
    order_data: UserOrderCreate,
) -> UserOrder:
    """
    Create a new order with the provided order data.

    Args:
        order_data: The order data to create

    Returns:
        GetAllOrdersResponse: a dictionary containing a list of orders and the total count

    Raises:
        HTTPException: If there's an error creating the order
    """
    try:
        order = await order_crud.add_new_order(
            user_id=order_data.user_id,
            price=order_data.price,
            token=order_data.token,
            position=order_data.position,
        )
        return order
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}",
        )


@router.get(
    "/{order_id}",
    response_model=UserOrderResponse,
    status_code=status.HTTP_200_OK,
)
async def get_order(order_id: uuid.UUID) -> UserOrder:
    """Get order by ID.

    Args:
        order_id: UUID of the order to retrieve

    Returns:
        UserOrder: The requested order

    Raises:
        HTTPException: If order not found or database error occurs
    """
    try:
        order = await order_crud.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return order
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get order: {str(e)}"
        )
