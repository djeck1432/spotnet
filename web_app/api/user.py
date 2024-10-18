from fastapi import APIRouter, Request, HTTPException, Query
from web_app.db.crud import UserDBConnector
from web_app.api.serializers.transaction import UpdateUserContractRequest

router = APIRouter()  # Initialize the router

user_db = UserDBConnector()


@router.get("/api/get-user-contract")
async def get_user_contract(wallet_id: str) -> int:
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
        return user.deployed_transaction_hash


@router.get("/api/check-user")
async def check_user(request: Request, wallet_id: str) -> dict:
    """
    Add a user to the database.
    :param request: Request object
    :return: dict
    """
    user = user_db.get_user_by_wallet_id(wallet_id)
    if user and not user.is_contract_deployed:
        return {"is_contract_deployed": False}
    elif not user:
        user_db.create_user(wallet_id)
        return {"is_contract_deployed": False}
    else:
        return {"is_contract_deployed": True}


@router.post("/api/update-user-contract")
async def change_user_contract(data: UpdateUserContractRequest) -> dict:
    """
    Change the contract status of a user.
    :param data: UpdateUserContractRequest
    :return: dict
    """
    user = user_db.get_user_by_wallet_id(data.wallet_id)
    if user:
        user_db.update_user_contract(user, data.contract_address)
        return {"is_contract_deployed": True}
    else:
        return {"is_contract_deployed": False}


@router.get("/api/get-user-contract-address")
async def get_user_contract_address(wallet_id: str) -> dict:
    """
    Get the contract address of a user.
    :param wallet_id: wallet id
    :return: dict
    """
    contract_address = user_db.get_contract_address_by_wallet_id(wallet_id)
    if contract_address:
        return {"contract_address": contract_address}
    else:
        return {"contract_address": None}
