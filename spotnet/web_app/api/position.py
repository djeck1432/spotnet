"""
This module handles position-related API endpoints.
"""

from decimal import Decimal, InvalidOperation
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Request

from web_app.api.serializers.position import (
    AddPositionDepositData,
    PositionFormData,
    TokenMultiplierResponse,
    UserPositionExtraDepositsResponse,
    UserPositionHistoryResponse,
)
from web_app.api.serializers.transaction import (
    LoopLiquidityData,
    RepayTransactionDataResponse,
    WithdrawAllData,
)
from web_app.contract_tools.constants import TokenMultipliers, TokenParams
from web_app.contract_tools.mixins import DashboardMixin, DepositMixin, PositionMixin
from web_app.db.crud import PositionDBConnector, TransactionDBConnector
from web_app.db.models import TransactionStatus

router = APIRouter()  # Initialize the router
position_db_connector = PositionDBConnector()
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
async def close_position(position_id: UUID, transaction_hash: str) -> str:
    """
    Close a position.
    :param position_id: contract address (UUID)
    :param transaction_hash: transaction hash for the position closure
    :return: str
    :raises: HTTPException: If position_id is invalid
    """
    if position_id is None or position_id == "undefined":
        raise HTTPException(status_code=404, detail="Position not Found")

    position_status = position_db_connector.close_position(str(position_id))
    position_db_connector.save_transaction(
        position_id=position_id, status="closed", transaction_hash=transaction_hash
    )
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
    :param transaction_hash: transaction hash for the position opening
    :return: str
    :raises: HTTPException :return: Dict containing status code and detail
    """
    if not position_id:
        raise HTTPException(status_code=404, detail="Position not found")

    current_prices = await DashboardMixin.get_current_prices()
    position_status = position_db_connector.open_position(position_id, current_prices)

    if transaction_hash:
        transaction_db_connector.create_transaction(
            position_id, transaction_hash, status=TransactionStatus.OPENED.value
        )

    return position_status


@router.get(
    "/api/get-withdraw-all-data",
    tags=["Position Operations"],
    summary="Get data to close position and withdraw all tokens",
    response_model=WithdrawAllData,
    response_description="Object containing data to withdraw all from the position",
)
async def get_withdraw_data(wallet_id: str, request: Request) -> WithdrawAllData:
    """
    Prepare data to withdraw all and close a position.

    :param wallet_id: address of the user's wallet
    :param request: request object
    :return: Dict containing repay data with list of token addresses
    """
    contract_address, position_id, token_symbol = position_db_connector.get_repay_data(
        wallet_id
    )
    if not await PositionMixin.is_opened_position(contract_address):
        raise HTTPException(status_code=400, detail="Position was closed")
    if not position_id:
        raise HTTPException(status_code=404, detail="Position not found or closed")

    repay_data = await DepositMixin.get_repay_data(
        token_symbol, request.app.state.ekubo_contract
    )
    extra_tokens = position_db_connector.get_extra_deposits_data(position_id).keys()
    repay_data["position_id"] = str(position_id)
    repay_data["contract_address"] = contract_address

    data = WithdrawAllData(
        repay_data=RepayTransactionDataResponse(**repay_data),
        tokens=[
            TokenParams.get_token_address(symbol)
            for symbol in extra_tokens
            if symbol != token_symbol
        ],
    )
    return data


@router.get(
    "/api/get-add-deposit-data/{position_id}",
    tags=["Position Operations"],
    summary="Add extra deposit to a user position",
    response_description="Returns the result of extra deposit",
)
async def get_add_deposit_data(position_id: UUID, amount: str, token_symbol: str):
    """
    Prepare data for adding an extra deposit to a position.

    :param position_id: UUID of the position
    :param amount: Amount of tokens to deposit
    :param token_symbol: Symbol of the token being deposited
    :return: Dict containing deposit data with token address and amount
    """
    if not amount:
        raise HTTPException(status_code=400, detail="Amount is required")

    if not token_symbol:
        raise HTTPException(status_code=400, detail="Token symbol is required")

    position = position_db_connector.get_position_by_id(position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")

    try:
        token_address = TokenParams.get_token_address(token_symbol)
        token_amount = int(
            Decimal(amount) * 10 ** TokenParams.get_token_decimals(token_address)
        )
    except InvalidOperation:
        raise HTTPException(status_code=400, detail="Amount is not a number")

    return {
        "deposit_data": {"token_address": token_address, "token_amount": token_amount}
    }


@router.post("/api/add-extra-deposit/{position_id}")
async def add_extra_deposit(position_id: UUID, data: AddPositionDepositData):
    """
    Add extra deposit to a user position.
    All deposits are now handled through ExtraDeposit table,
    regardless of token type.

    :param position_id: UUID of the position
    :param data: Deposit data to create extra deposit
    :return Dict containing detail
    """
    if not data.amount:
        raise HTTPException(status_code=400, detail="Amount is required")

    if not data.transaction_hash:
        raise HTTPException(status_code=400, detail="Transaction hash is required")

    position = position_db_connector.get_position_by_id(position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")

    position_db_connector.add_extra_deposit_to_position(
        position, data.token_symbol, data.amount
    )

    transaction_db_connector.create_transaction(
        position_id, data.transaction_hash, status=TransactionStatus.EXTRA_DEPOSIT.value
    )

    return {"detail": "Successfully added extra deposit"}


@router.get(
    "/api/user-positions/{wallet_id}",
    tags=["Position Operations"],
    response_model=UserPositionHistoryResponse,
    summary="Get all positions for a user",
    response_description="Returns paginated of positions for the given wallet ID",
)
async def get_user_positions(
    wallet_id: str,
    start: int = Query(0, ge=0),
    limit: int = Query(PAGINATION_STEP, ge=1, le=100),
) -> UserPositionHistoryResponse:
    """
    Get all positions for a specific user by their wallet ID.

    :param wallet_id: Wallet ID of the user
    :param start: Starting index for pagination (default: 0)
    :param limit: Number of items per page (default: 10 from PAGINATION_STEP variable)

    :return: UserPositionHistoryResponse with positions and total count
    :raises: HTTPException: If wallet ID is empty or invalid
    """
    if not wallet_id:
        raise HTTPException(status_code=400, detail="Wallet ID is required")

    positions = position_db_connector.get_all_positions_by_wallet_id(
        wallet_id, start=start, limit=limit
    )
    total_positions = position_db_connector.get_count_positions_by_wallet_id(wallet_id)
    
    return UserPositionHistoryResponse(
        positions=positions,
        total_count=total_positions
    )


@router.get(
    "/api/user-extra-positions",
    tags=["Position Operations"],
    response_model=UserPositionExtraDepositsResponse,
    summary="Get all extra positions for a user",
)
async def get_list_of_deposited_tokens(position_id: UUID):
    """
    Get position and extra position by position id

    :param position_id: UUID of the position
    :return Dict containing main position and extra positions
    """
    main_position = position_db_connector.get_position_by_id(position_id)
    extra_deposits = position_db_connector.get_extra_deposits_by_position_id(
        position_id
    )
    return {"main": main_position, "extra_deposits": extra_deposits}
