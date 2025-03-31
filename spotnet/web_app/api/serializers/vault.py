"""
Pydantic schemas for vault deposit operations.
Defines request and response models for the vault deposit API endpoints.
"""

from uuid import UUID

from pydantic import BaseModel, Field


class VaultDepositRequest(BaseModel):
    """
    Schema for vault deposit request used to create a new deposit record.

    Attributes:
        wallet_id (str): Starknet wallet address
        amount (str): Amount to deposit
        symbol (str): Token symbol or address
    """

    wallet_id: str = Field(..., description="Starknet wallet address")
    amount: str = Field(..., description="Amount to deposit")
    symbol: str = Field(..., description="Token symbol/address")


class VaultDepositResponse(BaseModel):
    """
    Schema for vault deposit response.

    Attributes:
        deposit_id (UUID): Unique identifier for the deposit
        wallet_id (str): Starknet wallet address
        amount (str): Deposited amount
        symbol (str): Token symbol or address
    """

    deposit_id: UUID
    wallet_id: str
    amount: str
    symbol: str


class VaultBalanceResponse(BaseModel):
    """
    Schema for the response when retrieving a vault balance.

    Attributes:
        wallet_id (str): The StarkNet wallet address.
        symbol (str): Token symbol or address
        amount (str): The current balance of the vault for the specified token.
    """

    wallet_id: str
    symbol: str
    amount: str


class UpdateVaultBalanceRequest(BaseModel):
    """
    Schema for the request to update a user's vault balance.

    Attributes:
        wallet_id (str): The StarkNet wallet address.
        symbol (str): Token symbol or address
        amount (str): The amount to be added to the user's vault balance.
    """

    wallet_id: str
    symbol: str
    amount: str


class UpdateVaultBalanceResponse(BaseModel):
    """
    Schema for the response when updating a vault balance.

    Attributes:
        wallet_id (str): The StarkNet wallet address.
        symbol (str): Token symbol or address
        amount (str): The new balance of the vault for the specified token.
    """

    wallet_id: str
    symbol: str
    amount: str
