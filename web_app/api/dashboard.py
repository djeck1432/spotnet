import collections
from datetime import datetime

from fastapi import APIRouter
from starlette.requests import Request

from web_app.db.crud import PositionDBConnector
from web_app.contract_tools.mixins.dashboard import DashboardMixin

router = APIRouter()
position_db_connector = PositionDBConnector()


@router.get("/api/dashboard")
async def get_dashboard(request: Request, wallet_id: str) -> dict:
    """
    Get the dashboard with the balances, multipliers, start dates, and zkLend position.
    :param wallet_id: Wallet ID
    :param request: HTTP request
    :return: template response
    """
    # FIXME
    wallet_id = "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49"
    contract_address = "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0" # position_db_connector.get_contract_address_by_wallet_id(wallet_id)
    # opened_positions = position_db_connector.get_positions_by_wallet_id(wallet_id)

    #first_opened_position = opened_positions[0] if opened_positions else collections.defaultdict(lambda: None)
    # Fetch zkLend position for the wallet ID
    zklend_position = await DashboardMixin.get_zklend_position(contract_address)

    # Fetch balances (assuming you have a method for this)
    wallet_balances = await DashboardMixin.get_wallet_balances(wallet_id)
    return {
        "balances": wallet_balances,
        "multipliers": {"ETH": 3}, #first_opened_position["multiplier"]},
        "start_dates": {"ETH": datetime.now().isoformat()}, # first_opened_position["created_at"]},
        "zklend_position": zklend_position,
    }
