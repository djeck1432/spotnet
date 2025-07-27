"""
This module contains the API routes for dashboard.
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.dashboard import StatisticResponse
from app.crud.margin_position import margin_position_crud
from app.crud.user import user_crud
from app.crud.order import order_crud

router = APIRouter()


@router.get(
    "/statistic", response_model=StatisticResponse, status_code=status.HTTP_200_OK
)
async def get_statistic() -> StatisticResponse:
    """
    Getting statistic data about the whole project:

    Returns:
        StatisticResponse: total amount of users, opened and liquidated positions, opened orders
    """
    try:
        response = {}
        response["users"] = await user_crud.get_objects_amounts()
        response[
            "opened_positions"
        ] = await margin_position_crud.get_opened_positions_amount()

        liquidated_positions = (
            await margin_position_crud.get_liquidated_positions_amount()
        )
        response["liquidated_positions"] = liquidated_positions

        response["opened_orders"] = await order_crud.get_objects_amounts()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get statistic.",
        ) from e
    return response
