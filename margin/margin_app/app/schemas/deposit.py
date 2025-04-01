"""
This module contains Pydantic schemas for Deposit models.
"""

from decimal import Decimal
from uuid import UUID
from typing import Optional
from datetime import datetime
from pydantic import ConfigDict

from .base import BaseSchema, GetAll


class DepositBase(BaseSchema):
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


class DepositUpdate(BaseSchema):
    """
    Pydantic model for updating a Deposit.
    """

    token: Optional[str] = None
    amount: Optional[Decimal] = None
    transaction_id: Optional[str] = None


class DepositResponse(BaseSchema):
    """
    Pydantic model for a Deposit response.
    """

    id: UUID
    created_at: datetime
    updated_at: datetime


class DepositGetAllResponse(GetAll[DepositResponse]):
    """
    Pydantic model for getting all deposits.
    """

    pass
