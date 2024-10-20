import collections

from fastapi import APIRouter
from starlette.requests import Request
from web_app.api.serializers.dashboard import Dashboard
from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.crud import PositionDBConnector

router = APIRouter()
position_db_connector = PositionDBConnector()


@router.get("/api/dashboard", response_model=Dashboard)
async def get_dashboard(request: Request, wallet_id: str) -> Dashboard:
    """
    Get the dashboard with the balances, multipliers, start dates, and zkLend position.
    :param wallet_id: Wallet ID
    :param request: HTTP request
    :return: template response
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
    return {
        "balances": wallet_balances,
        "multipliers": {"ETH": first_opened_position["multiplier"]},
        "start_dates": {"ETH": first_opened_position["created_at"]},
        "zklend_position": zklend_position,
    }
