"""
This file contains the Pydantic schema for the MarginPosition model.
"""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class MarginPositionStatus(str, Enum):
    """
    Enumeration of possible margin position statuses.

    Attributes:
        OPEN: Position is currently open
        CLOSED: Position has been closed
    """

    OPEN = "Open"
    CLOSED = "Closed"


class CloseMarginPositionResponse(BaseModel):
    """
    Response model for closing a margin position.

    Attributes:
        position_id (UUID): The unique identifier of the margin position
        status (MarginPositionStatus): The current status of the margin position
    """

    position_id: UUID
    status: MarginPositionStatus

    class Config:
        """Pydantic configuration class"""

        from_attributes = True


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

        orm_mode = True
