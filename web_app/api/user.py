from fastapi import APIRouter, Request
from web_app.db.crud import UserDBConnector
from web_app.api.serializers.transaction import UpdateUserContractRequest

router = APIRouter()  # Initialize the router

user_db = UserDBConnector()


@router.get("/api/check-user")
async def сheck_user(request: Request, wallet_id: str) -> dict:
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
        user_db.update_user_contract_status(user, data.transaction_hash)
        return {"is_contract_deployed": True}
    else:
        return {"is_contract_deployed": False}
