"""
API endpoints for order management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.order import order_crud
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter()


@router.post(
    "/create_order",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new order",
    description="Creates a new order in the system",
)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(order_crud.session),
) -> Order:
    """
    Create a new order with the provided order data.

    Args:
        order_data: The order data to create
        order_crud: The OrderCRUD instance for database operations

    Returns:
        The created order

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
