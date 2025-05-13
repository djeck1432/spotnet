"""
Module for handling vault deposit operations in the SPOTNET API.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException

from web_app.db.crud import DepositDBConnector, UserDBConnector
from web_app.api.serializers.vault import (
    UpdateVaultBalanceRequest,
    UpdateVaultBalanceResponse,
    VaultBalanceResponse,
    VaultDepositRequest,
    VaultDepositResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/vault", tags=["vault"])


@router.post("/deposit", response_model=VaultDepositResponse)
async def deposit_to_vault(
    request: VaultDepositRequest,
    deposit_connector: DepositDBConnector = Depends(DepositDBConnector),
) -> VaultDepositResponse:
    """
    Process a vault deposit request.
    """
    logger.info(f"Processing deposit request for wallet {request.wallet_id}")

    try:
        user_db = UserDBConnector()
        user = user_db.get_user_by_wallet_id(request.wallet_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        vault = deposit_connector.create_vault(
            user=user, symbol=request.symbol, amount=request.amount
        )

        return VaultDepositResponse(
            deposit_id=vault.id,
            wallet_id=request.wallet_id,
            amount=request.amount,
            symbol=request.symbol,
        )
    except (ValueError, TypeError) as e:
        logger.error(f"Invalid input data: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/balance", response_model=VaultBalanceResponse)
async def get_user_vault_balance(
    wallet_id: str,
    symbol: str,
    deposit_connector: DepositDBConnector = Depends(DepositDBConnector),
) -> VaultBalanceResponse:
    """
    Get the balance of a user's vault for a specific token.
    """
    balance = deposit_connector.get_vault_balance(wallet_id=wallet_id, symbol=symbol)
    if balance is None:
        raise HTTPException(
            status_code=404, detail="Vault not found or user does not exist"
        )
    return VaultBalanceResponse(wallet_id=wallet_id, symbol=symbol, amount=balance)


@router.post("/add_balance", response_model=UpdateVaultBalanceResponse)
async def add_vault_balance(
    request: UpdateVaultBalanceRequest,
    deposit_connector: DepositDBConnector = Depends(DepositDBConnector),
) -> UpdateVaultBalanceResponse:
    """
    Add balance to a user's vault for a specific token.
    """
    try:
        updated_vault = deposit_connector.add_vault_balance(
            wallet_id=request.wallet_id, symbol=request.symbol, amount=request.amount
        )
        return UpdateVaultBalanceResponse(
            wallet_id=request.wallet_id,
            symbol=request.symbol,
            amount=updated_vault.amount,
        )
    except (ValueError, TypeError) as e:
        raise HTTPException(
            status_code=400, detail=f"Failed to update vault balance: {str(e)}"
        )
