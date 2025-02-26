"""Schema module for Deposit."""

from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID
from typing import Optional
from datetime import datetime

class DepositUpdate(BaseModel):
    """
    Pydantic model for updating a Deposit.
    """
    token: Optional[str] = None
    amount: Optional[Decimal] = None
    transaction_id: Optional[str] = None


class DepositResponse(BaseModel):
    """
    Pydantic model for a Deposit response.
    """
    id: UUID
    user_id: UUID
    token: str
    amount: Decimal
    transaction_id: str
    created_at: datetime
    updated_at: datetime
