"""
This module contains Pydantic schemas for User.
"""

from decimal import Decimal
from uuid import UUID
from app.schemas.deposit import DepositResponse
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    """
    User base model
    """

    wallet_id: str


class UserCreate(UserBase):
    """
    User create model
    """

    pass


class UserResponse(UserBase):
    """
    User response model
    """

    id: UUID
    deposit: list[DepositResponse] = []
    model_config = ConfigDict(from_attributes=True)


class AddUserDepositRequest(BaseModel):
    """
    Request model for adding user deposit
    """

    user_id: UUID
    amount: Decimal
    token: str
    transaction_id: str


class AddUserDepositResponse(BaseModel):
    """
    Response model for adding user deposit
    """

    deposit_id: UUID


class AddMarginPositionRequest(BaseModel):
    """
    Request model for adding margin position
    """

    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    token: str
    transaction_id: str


class AddMarginPositionResponse(BaseModel):
    """
    Response model for adding margin position
    """

    margin_position_id: UUID
