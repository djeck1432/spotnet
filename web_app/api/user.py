from typing import Literal

from fastapi import APIRouter, Request
from web_app.api.serializers.transaction import (ContractAddress,
                                                 DeploymentStatus,
                                                 UpdateUserContractRequest)
from web_app.db.crud import UserDBConnector

router = APIRouter()  # Initialize the router

user_db = UserDBConnector()


@router.get("/api/get-user-contract", response_model=str)
async def get_user_contract(wallet_id: str) -> str:
    """
    Get the contract status of a user.
    :param wallet_id: wallet id
    :return: str
    """
    user = user_db.get_user_by_wallet_id(wallet_id)
    if user is None or not user.is_contract_deployed:
        return ""
    else:
        return user.contract_address


@router.get("/api/check-user", response_model=DeploymentStatus)
async def check_user(request: Request, wallet_id: str) -> DeploymentStatus:
    """
    Add a user to the database.
    :param request: Request object
    :param wallet_id: str
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


@router.post("/api/update-user-contract", response_model=DeploymentStatus)
async def change_user_contract(data: UpdateUserContractRequest) -> DeploymentStatus:
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


@router.get("/api/get-user-contract-address", response_model=ContractAddress)
async def get_user_contract_address(wallet_id: str) -> ContractAddress:
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
