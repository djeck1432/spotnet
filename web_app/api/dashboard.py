"""
This module handles dashboard-related API endpoints.
"""

import collections

from fastapi import APIRouter
from starlette.requests import Request
from web_app.api.serializers.dashboard import DashboardResponse
from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.crud import PositionDBConnector

router = APIRouter()
position_db_connector = PositionDBConnector()


@router.get(
    "/api/dashboard",
    tags=["Dashboard Operations"],
    summary="Get user dashboard data",
    response_model=DashboardResponse,
    response_description="Returns user's balances, multipliers, start dates, and ZkLend positions.",
)
async def get_dashboard(wallet_id: str) -> DashboardResponse:
    """
    This endpoint fetches the user's dashboard data,
    including balances, multipliers, start dates, and ZkLend position.

    ### Parameters:
    - **wallet_id**: User's wallet ID

    ### Returns:
    A dictionary containing the user's dashboard data:
    - **balances**: Wallet balances for the user.
    - **multipliers**: Multipliers applied to each asset (e.g., ETH).
    - **start_dates**: Start dates for each asset's position.
    - **zklend_position**: Details of the ZkLend positions.
    """
    contract_address = position_db_connector.get_contract_address_by_wallet_id(
        wallet_id
    )
    opened_positions = position_db_connector.get_positions_by_wallet_id(wallet_id)

    first_opened_position = (
        opened_positions[0]
        if opened_positions
        else collections.defaultdict(lambda: None)
    )
    # Fetch zkLend position for the wallet ID
    zklend_position = await DashboardMixin.get_zklend_position(contract_address)

    # Fetch balances (assuming you have a method for this)
    wallet_balances = await DashboardMixin.get_wallet_balances(wallet_id)
    return DashboardResponse(
        balances=wallet_balances,
        multipliers={"ETH": first_opened_position["multiplier"]},
        start_dates={"ETH": first_opened_position["created_at"]},
        zklend_position=zklend_position,
    )
