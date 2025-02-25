"""
This module contains Pydantic schemas for Deposit models.
"""

from _decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class DepositBase(BaseModel):
    """
    Represents the base schema for a deposit transaction
    """

    user_id: UUID
    token: str
    amount: Decimal
    transaction_id: str


class DepositCreate(DepositBase):
    """
    Represents the schema for a deposit transaction creation
    """

    pass


class DepositResponse(DepositBase):
    """
    Represents the schema for a deposit transaction response
    """

    id: UUID

    class Config:
        orm_mode = True

