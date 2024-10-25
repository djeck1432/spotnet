"""
This module handles user-related API endpoints.
"""

from fastapi import APIRouter, Request, HTTPException
from web_app.db.crud import PositionDBConnector, UserDBConnector
from web_app.api.serializers.transaction import UpdateUserContractRequest
from web_app.api.serializers.user import (
    CheckUserResponse,
    UpdateUserContractResponse,
    GetUserContractAddressResponse,
    GetStats,
)

router = APIRouter()  # Initialize the router

user_db = UserDBConnector()

position_db = PositionDBConnector()


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
    tags=["Statistics"],
    summary="Get all user amounts and the number of unique users.",
    response_model=GetStats,
    response_description="returns a dictionary of all users and their respective total amounts for open position and the number of unique users who have these open positions",
)
async def get_stats():
    """
    Returns all user amounts for open positions and the number of unique users.

    ### Returns:
    - Dictionary containing:
        - total_amounts: dict where keys are user IDs and values are total amounts
        - unique_users: The count of unique users with open positions
    """
    try:
        # Fetch amounts for each user where position status is OPENED
        users_amounts = position_db.get_all_amounts_for_opened_positions()

        # Get the number of unique users
        unique_users_count = len(users_amounts)

        # Returns all status OPENED users amount and unique users count
        return {"users_amounts": users_amounts, "unique_users": unique_users_count}

    except KeyError as key_error:
        # Handle KeyError if any issue with dictionary keys
        raise HTTPException(
            status_code=500, detail=f"Data processing error: {str(key_error)}"
        )

    except Exception as e:
        # Catch all other exceptions
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
