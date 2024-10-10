from datetime import datetime

from fastapi import APIRouter
from starlette.requests import Request

from web_app.contract_tools.mixins.dashboard import DashboardMixin

router = APIRouter()


@router.get("/api/dashboard")
async def get_dashboard(request: Request):
    """
    Get the dashboard with the balances, multipliers, start dates, and zkLend position.
    :param request: HTTP request
    :return: template response
    """
    # Pass balances, multipliers, and start_dates to the template
    wallet_id = "0x020281104e6cb5884dabcdf3be376cf4ff7b680741a7bb20e5e07c26cd4870af" # mock wallet ID for demonstration purposes
    # Fetch zkLend position for the wallet ID
    zklend_position = await DashboardMixin.get_zklend_position(wallet_id)

    # Fetch balances (assuming you have a method for this)
    wallet_balances = await DashboardMixin.get_wallet_balances(wallet_id)
    return {
        "balances": wallet_balances,
        "multipliers": {"ETH": 5},
        "start_dates": {"ETH": datetime.now()},
        "zklend_position": zklend_position,
    }
