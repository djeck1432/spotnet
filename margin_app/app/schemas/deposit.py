"""
This module contains Pydantic schemas for Deposit models.
"""

from decimal import Decimal
from uuid import UUID
from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict


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


class DepositUpdate(BaseModel):
    """
    Pydantic model for updating a Deposit.
    """
    token: Optional[str] = None
    amount: Optional[Decimal] = None
    transaction_id: Optional[str] = None


class DepositResponse(DepositBase):
    """
    Pydantic model for a Deposit response.
    """
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
