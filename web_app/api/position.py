"""
This module handles position-related API endpoints.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Request

from web_app.api.serializers.position import (
    PositionFormData,
    TokenMultiplierResponse,
    UserPositionResponse,
)
from web_app.api.serializers.transaction import (
    LoopLiquidityData,
    RepayTransactionDataResponse,
)
from web_app.contract_tools.constants import TokenMultipliers, TokenParams
from web_app.contract_tools.mixins import DashboardMixin, DepositMixin, PositionMixin
from web_app.db.crud import PositionDBConnector, TransactionDBConnector

router = APIRouter()  # Initialize the router
position_db_connector = PositionDBConnector()  # Initialize the PositionDBConnector
transaction_db_connector = TransactionDBConnector()

# Constants
PAGINATION_STEP = 10


@router.get(
    "/api/get-multipliers",
    tags=["Position Operations"],
    response_model=TokenMultiplierResponse,
    summary="Get token multipliers",
    response_description="Returns token multipliers",
)
async def get_multipliers() -> TokenMultiplierResponse:
    """
    This Endpoint retrieves the multipliers for tokens like ETH, STRK, and USDC.
    """
    multipliers = {
        "ETH": TokenMultipliers.ETH,
        "STRK": TokenMultipliers.STRK,
        "USDC": TokenMultipliers.USDC,
    }
    return TokenMultiplierResponse(multipliers=multipliers)


@router.post(
    "/api/create-position",
    tags=["Position Operations"],
    response_model=LoopLiquidityData,
    summary="Create a new position",
    response_description="Returns the new position and transaction data.",
)
async def create_position_with_transaction_data(
    form_data: PositionFormData,
    request: Request,
) -> LoopLiquidityData:
    """
    This endpoint creates a new user position.

    ### Parameters:
    - **wallet_id**: The wallet ID of the user.
    - **token_symbol**: The symbol of the token used for the position.
    - **amount**: The amount of the token being deposited.
    - **multiplier**: The multiplier applied to the user's position.
    - **borrowing_token**: The address of the borrowing token.
    - **request**: The FastAPI request object.

    ### Returns:
    The created position's details and transaction data.
    """
    # Create a new position in the database
    position = position_db_connector.create_position(
        form_data.wallet_id,
        form_data.token_symbol,
        form_data.amount,
        form_data.multiplier,
    )
    borrowing_token = TokenParams.USDC.address
    if form_data.token_symbol == TokenParams.USDC.name:
        borrowing_token = TokenParams.ETH.address

    # Get the transaction data for the deposit
    deposit_data = await DepositMixin.get_transaction_data(
        form_data.token_symbol,
        form_data.amount,
        form_data.multiplier,
        form_data.wallet_id,
        borrowing_token,
        request.app.state.ekubo_contract,
    )
    deposit_data["contract_address"] = (
        position_db_connector.get_contract_address_by_wallet_id(form_data.wallet_id)
    )
    deposit_data["position_id"] = str(position.id)

    return LoopLiquidityData(**deposit_data)


@router.get(
    "/api/get-repay-data",
    tags=["Position Operations"],
    response_model=RepayTransactionDataResponse,
    summary="Get repay data",
    response_description="Returns the repay transaction data.",
)
async def get_repay_data(
    wallet_id: str,
    request: Request,
) -> RepayTransactionDataResponse:
    """
    Obtain data for position closing.
    :param wallet_id: Wallet ID
    :param request: Request object
    :return: Dict containing the repay transaction data
    :raises: HTTPException :return: Dict containing status code and detail
    """
    if not wallet_id:
        raise HTTPException(status_code=404, detail="Wallet not found")

    contract_address, position_id, token_symbol = position_db_connector.get_repay_data(
        wallet_id
    )
    is_opened_position = await PositionMixin.is_opened_position(contract_address)
    if not is_opened_position:
        raise HTTPException(status_code=400, detail="Position was closed")
    if not position_id:
        raise HTTPException(status_code=404, detail="Position not found or closed")

    repay_data = await DepositMixin.get_repay_data(
        token_symbol, request.app.state.ekubo_contract
    )
    repay_data["contract_address"] = contract_address
    repay_data["position_id"] = str(position_id)
    return repay_data


@router.get(
    "/api/close-position",
    tags=["Position Operations"],
    response_model=str,
    summary="Close a position",
    response_description="Returns the position status",
)
async def close_position(position_id: str) -> str:
    """
    Close a position.
    :param position_id: contract address
    :return: str
    :raises: HTTPException :return: Dict containing status code and detail
    """
    if position_id is None or position_id == "undefined":
        raise HTTPException(status_code=404, detail="Position not Found")

    position_status = position_db_connector.close_position(position_id)
    return position_status


@router.get(
    "/api/open-position",
    tags=["Position Operations"],
    response_model=str,
    summary="Open a position",
    response_description="Returns the positions status",
)
async def open_position(position_id: str, transaction_hash: str) -> str:
    """
    Open a position.
    :param position_id: contract address
    :return: str
    :raises: HTTPException :return: Dict containing status code and detail
    """
    if not position_id:
        raise HTTPException(status_code=404, detail="Position not found")

    current_prices = await DashboardMixin.get_current_prices()
    position_status = position_db_connector.open_position(
        position_id,
        current_prices
    )
    
    if transaction_hash:
        transaction_db_connector.create_transaction(
            position_id,
            transaction_hash,
            position_status
        )
        
    return position_status


@router.post(
    "/api/add-extra-deposit/{position_id}",
    tags=["Position Operations"],
    summary="Add extra deposit to a user position",
    response_description="Returns the result of extra deposit",
)
async def add_extra_deposit(position_id: int, amount: str):
    """
    This endpoint adds extra deposit to a user position.

    ### Parameters:
    - **position_id**: The position ID.
    - **amount**: The amount of the token being deposited.
    """

    if not position_id:
        raise HTTPException(status_code=404, detail="Position ID is required")

    if not amount:
        raise HTTPException(status_code=404, detail="Amount is required")

    position = position_db_connector.get_position_by_id(position_id)

    if not position:
        raise HTTPException(status_code=404, detail="Position not found")

    position_db_connector.add_extra_deposit_to_position(position, amount)

    return {"detail": "Successfully added extra deposit"}


@router.get(
    "/api/user-positions/{wallet_id}",
    tags=["Position Operations"],
    response_model=list[UserPositionResponse],
    summary="Get all positions for a user",
    response_description="Returns paginated list of positions for the given wallet ID",
)
async def get_user_positions(wallet_id: str, start: Optional[int] = None) -> list:
    """
    Get all positions for a specific user by their wallet ID.
    :param wallet_id: The wallet ID of the user
    :param start: Optional starting index for pagination (0-based). If not provided, defaults to 0
    :return: UserPositionsListResponse containing paginated list of positions
    :raises: HTTPException: If wallet ID is empty or invalid
    """
    if not wallet_id:
        raise HTTPException(status_code=400, detail="Wallet ID is required")

    start_index = max(0, start) if start is not None else 0

    positions = position_db_connector.get_positions_by_wallet_id(
        wallet_id, start_index, PAGINATION_STEP
    )
    return positions
