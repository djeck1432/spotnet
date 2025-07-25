"""
This module contains Pydantic schemas for User.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID
from app.schemas.deposit import DepositResponse
from app.models.margin_position import MarginPositionStatus
from .base import BaseSchema, GetAll


class UserBase(BaseSchema):
    """
    User base model
    """

    wallet_id: str


class UserCreate(UserBase):
    """
    User create model
    """


class UserResponse(UserBase):
    """
    User response model
    """

    id: UUID
    deposit: list[DepositResponse] = []


class UserGetAllResponse(GetAll[UserResponse]):
    """
    User response model for getting all users
    """


class AddUserDepositRequest(BaseSchema):
    """
    Request model for adding user deposit
    """

    user_id: UUID
    amount: Decimal
    token: str
    transaction_id: str


class AddUserDepositResponse(BaseSchema):
    """
    Response model for adding user deposit
    """

    deposit_id: UUID


class AddMarginPositionRequest(BaseSchema):
    """
    Request model for adding margin position
    """

    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    token: str
    transaction_id: str


class AddMarginPositionResponse(BaseSchema):
    """
    Response model for adding margin position
    """

    margin_position_id: UUID
    user_id: UUID
    multiplier: int
    borrowed_amount: Decimal
    transaction_id: str
    liquidated_at: datetime
    status: MarginPositionStatus
