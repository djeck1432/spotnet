"""
This file contains the Pydantic schema for the MarginPosition model.
"""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID
from pydantic import Field
from typing import Optional

from .base import BaseSchema
from .base import GetAll


class MarginPositionStatus(str, Enum):
    """
    Enumeration of possible margin position statuses.

    Attributes:
        OPEN: Position is currently open
        CLOSED: Position has been closed
    """

    OPEN = "Open"
    CLOSED = "Closed"


class CloseMarginPositionResponse(BaseSchema):
    """
    Response model for closing a margin position.

    Attributes:
        position_id (UUID): The unique identifier of the margin position
        status (MarginPositionStatus): The current status of the margin position
    """

    position_id: UUID
    status: MarginPositionStatus


class MarginPositionCreate(BaseSchema):
    """
    Pydantic model for creating a MarginPosition.
    """

    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    transaction_id: str


class MarginPositionUpdate(BaseSchema):
    """
    Pydantic model for updating a MarginPosition.
    Only borrowed_amount and multiplier can be updated.
    """

    borrowed_amount: Optional[Decimal] = Field(
        None, gt=0, description="Borrowed amount must be positive"
    )
    multiplier: Optional[int] = Field(
        None, ge=1, le=20, description="Multiplier must be between 1 and 20"
    )


class MarginPositionResponse(BaseSchema):
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


class MarginPositionGetAllResponse(GetAll[MarginPositionResponse]):
    """
    Pydantic model for getting all MarginPositions.
    """
