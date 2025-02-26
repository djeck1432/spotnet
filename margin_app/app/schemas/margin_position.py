"""
This file contains the Pydantic schema for the MarginPosition model.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class MarginPositionCreate(BaseModel):
    """
    Pydantic model for creating a MarginPosition.
    """

    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    transaction_id: str


class MarginPositionResponse(BaseModel):
    """
    Pydantic model for a MarginPosition response.
    """

    id: UUID
    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    transaction_id: str
    status: str
    liquidated_at: datetime | None

    class Config:
        """
        Pydantic model configuration.
        """

        orm_mode: True
