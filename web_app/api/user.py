"""
This module handles user-related API endpoints.
"""

import logging
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from web_app.api.serializers.transaction import UpdateUserContractRequest
from web_app.api.serializers.user import (
    CheckUserResponse,
    GetStatsResponse,
    GetUserContractAddressResponse,
    SubscribeToNotificationResponse,
    UpdateUserContractResponse,
    UserHistoryResponse,
)
from web_app.contract_tools.mixins import PositionMixin, DashboardMixin
from web_app.db.crud import (
    PositionDBConnector,
    TelegramUserDBConnector,
    UserDBConnector,
)
from web_app.contract_tools.blockchain_call import CLIENT

logger = logging.getLogger(__name__)
router = APIRouter()  # Initialize the router
telegram_db = TelegramUserDBConnector()

user_db = UserDBConnector()
position_db = PositionDBConnector()


@router.get(
    "/api/has-user-opened-position",
    tags=["Position Operations"],
    summary="Check if user has opened position",
    response_description="Returns true if the user has an opened position, false otherwise",
)
async def has_user_opened_position(wallet_id: str) -> dict:
    """
    Check if a user has any opened positions.
    :param wallet_id: wallet id
    :return: Dict containing boolean result
    :raises: HTTPException
    """
    try:
        has_position = position_db.has_opened_position(wallet_id)
        contract_address = user_db.get_contract_address_by_wallet_id(wallet_id)
        if contract_address is None:
            return {"has_opened_position": False}
        is_position_opened = await PositionMixin.is_opened_position(contract_address)
        return {"has_opened_position": has_position or is_position_opened}
    except ValueError as e:
        raise HTTPException(
            status_code=404, detail=f"Invalid wallet ID format: {str(e)}"
        )


@router.get(
    "/api/get-user-contract",
    tags=["User Operations"],
    summary="Get user's contract status",
    response_description=(
        "Returns 0 if the user is None or if the contract is not deployed. "
        "Returns the transaction hash if the contract is deployed."
    ),
)
async def get_user_contract(wallet_id: str) -> str:
    """
    Get the contract status of a user.
    :param wallet_id: wallet id
    :return: int
    :raises: HTTPException :return: Dict containing status code and detail
    """
    user = user_db.get_user_by_wallet_id(wallet_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    elif not user.is_contract_deployed:
        raise HTTPException(status_code=404, detail="Contract not deployed")
    else:
        return user.contract_address


@router.get(
    "/api/check-user",
    tags=["User Operations"],
    summary="Check if user exists and contract status",
    response_model=CheckUserResponse,
    response_description="Returns whether the user's contract is deployed.",
)
async def check_user(wallet_id: str) -> CheckUserResponse:
    """
    This endpoint checks if the user exists, or adds the user to the database if they don't exist,
    and checks whether their contract is deployed.

    ### Parameters:
    - **wallet_id**: The wallet ID of the user.

    ### Returns:
    The contract deployment status
    """

    user = user_db.get_user_by_wallet_id(wallet_id)
    if user and not user.is_contract_deployed:
        return {"is_contract_deployed": False}
    elif not user:
        user_db.create_user(wallet_id)
        return {"is_contract_deployed": False}
    else:
        return {"is_contract_deployed": True}


@router.post(
    "/api/update-user-contract",
    tags=["User Operations"],
    summary="Update the user's contract",
    response_model=UpdateUserContractResponse,
    response_description="Returns if the contract is updated and deployed.",
)
async def update_user_contract(
    data: UpdateUserContractRequest,
) -> UpdateUserContractResponse:
    """
    This endpoint updates the user's contract.

    ### Parameters:
    - **wallet_id**: The wallet ID of the user.
    - **contract_address**: The contract address being deployed.

    ### Returns:
    The contract deployment status
    """

    user = user_db.get_user_by_wallet_id(data.wallet_id)
    if user:
        user_db.update_user_contract(user, data.contract_address)
        return {"is_contract_deployed": True}
    else:
        return {"is_contract_deployed": False}


@router.post(
    "/api/subscribe-to-notification",
    tags=["User Operations"],
    summary="Subscribe user to notifications",
    response_description="Returns success status of notification subscription",
)
async def subscribe_to_notification(
    data: SubscribeToNotificationResponse,
):
    """
    This endpoint subscribes a user to notifications by linking their telegram ID to their wallet.

    ### Parameters:
    - **telegram_id**: The Telegram id of the user.
    - **wallet_id**: The wallet id of the user.

    ### Returns:
    Success status of the subscription.
    """
    user = user_db.get_user_by_wallet_id(data.wallet_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    is_allowed_notification = telegram_db.allow_notification(data.telegram_id)

    if is_allowed_notification:
        return {"detail": "User subscribed to notifications successfully"}
    raise HTTPException(
        status_code=400, detail="Failed to subscribe user to notifications"
    )


@router.get(
    "/api/get-user-contract-address",
    tags=["User Operations"],
    summary="Get user's contract address",
    response_model=GetUserContractAddressResponse,
    response_description="Returns the contract address of the user or None if not deployed.",
)
async def get_user_contract_address(wallet_id: str) -> GetUserContractAddressResponse:
    """
    This endpoint retrieves the contract address of a user.

    ### Parameters:
    - **wallet_id**: User's wallet ID

    ### Returns:
    The contract address or None if it does not exists.
    """

    contract_address = user_db.get_contract_address_by_wallet_id(wallet_id)
    if contract_address:
        return {"contract_address": contract_address}
    else:
        return {"contract_address": None}


@router.get(
    "/api/get_stats",
    tags=["User Operations"],
    summary="Get total opened amounts and number of unique users",
    response_model=GetStatsResponse,
    response_description="Total amount for all open positions across all users & \
                              Number of unique users in the database.",
)
async def get_stats() -> GetStatsResponse:
    """
    Retrieves the total amount for open positions converted to USDC
    and the count of unique users.

    ### Returns:
    - total_opened_amount: Sum of amounts for all open positions in USDC.
    - unique_users: Total count of unique users.
    """
    try:
        # Fetch open positions amounts by token
        token_amounts = position_db.get_total_amounts_for_open_positions()

        # Fetch current prices
        current_prices = await DashboardMixin.get_current_prices()

        # Convert all token amounts to USDC
        total_opened_amount = Decimal("0")
        for token, amount in token_amounts.items():
            # Skip if no price available for the token
            if token not in current_prices or "USDC" not in current_prices:
                logger.warning(f"No price data available for {token}")
                continue

            # If the token is USDC, use it directly
            if token == "USDC":
                total_opened_amount += amount
                continue

            # Convert other tokens to USDC
            # Price is typically in USDC per token
            usdc_price = current_prices[token]
            usdc_equivalent = amount * Decimal(usdc_price)
            total_opened_amount += usdc_equivalent

        unique_users = user_db.get_unique_users_count()
        return GetStatsResponse(
            total_opened_amount=total_opened_amount, unique_users=unique_users
        )

    except Exception as e:
        logger.error(f"Error in get_stats: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get(
    "/api/get-user-history",
    tags=["User Operations"],
    summary="Get user position history",
    response_model=UserHistoryResponse,
    response_description="List of user positions including status,created_at, \
                                start_price, amount, and multiplier.",
)
async def get_user_history(user_id: str) -> list[dict]:
    """
    Retrieves the history of positions for a specified user.

    ### Parameters:
    - **user_id**: The unique ID of the user whose position history is being fetched.

    ### Returns:
    - A list of positions with the following details:
        - `status`: Current status of the position.
        - `created_at`: Timestamp when the position was created.
        - `start_price`: Initial price of the asset when the position was opened.
        - `amount`: Amount involved in the position.
        - `multiplier`: Leverage multiplier applied to the position.
    """
    try:
        # Fetch user history from the database
        positions = user_db.fetch_user_history(user_id)

        if not positions:
            logger.info(f"No positions found for user_id={user_id}")
            return []

        return positions

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/allow-notification/{telegram_id}")
async def allow_notification(
    telegram_id: int,
    telegram_db: TelegramUserDBConnector = Depends(lambda: TelegramUserDBConnector()),
):
    """Enable notifications for a specific telegram user"""
    try:
        telegram_db.allow_notification(telegram_id=telegram_id)
        return {"message": "Notifications enabled successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post(
    "/api/withdraw-all",
    tags=["User Operations"],
    summary="Withdraw all tokens from user's contract",
    response_description="Status of withdrawal operations",
)
async def withdraw_all(wallet_id: str) -> dict:
    """
    Withdraws all supported tokens from the user's contract.

    :param wallet_id: The wallet ID of the user.
    :return: detail: "Successfully initiated withdrawals for all tokens"
    """
    try:
        # Get user's contract address
        contract_address = await get_user_contract(wallet_id)
        if not contract_address:
            raise HTTPException(status_code=404, detail="Contract not found")

        # Perform withdrawals
        try:
            await CLIENT.withdraw_all(contract_address)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to withdraw tokens: {str(e)}")
        
        return {"detail": "Successfully initiated withdrawals for all tokens"}
        
    except Exception as e:
        logger.error(f"Error in withdraw_all: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to withdraw tokens: {str(e)}"
        )
