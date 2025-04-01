"""
Schemas for liquidation responses.
"""

from uuid import UUID
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel


class LiquidationRequest(BaseModel):
    """Request schema for a liquidation request."""

    margin_position_id: UUID
    bonus_amount: Decimal
    bonus_token: str


class LiquidationResponse(LiquidationRequest):
    """Response schema for a liquidation request."""

    status: Optional[Literal["success", "failure"]] = None