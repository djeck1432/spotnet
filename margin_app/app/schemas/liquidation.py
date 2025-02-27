"""
Schemas for liquidation responses.
"""

from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel

class LiquidationResponse(BaseModel):
    """Response schema for a liquidation request."""
    margin_position_id: UUID
    bonus_amount: Decimal
    bonus_token: str
