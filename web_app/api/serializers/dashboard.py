"""
This module defines the serializers for the dashboard data.
"""

from datetime import datetime
from decimal import Decimal
from typing import Dict, Any

from pydantic import BaseModel, Field


class DashboardResponse(BaseModel):
    """
    DashboardResponse class for dashboard details.
    """
    health_ratio: str = Field(
        ..., example="2.0", description="The health ratio of the user."
    )
    multipliers: Dict[str, str | None] = Field(
        ..., example={"ETH": 1.5}, description="The multipliers applied to each asset."
    )
    start_dates: Dict[str, datetime | None] = Field(
        ...,
        example={"ETH": "2024-01-01T00:00:00"},
        description="The start date for each position.",
    )
    current_sum: Decimal = Field(
        ...,
        example=5000.0,
        description="The current sum of the position.",
    )
    start_sum: Decimal = Field(
        ...,
        example=1000.0,
        description="The starting sum of the position.",
    )
    borrowed: str = Field(
        ...,
        example="12",
        description="The borrowed token.",
    )
    balance: str = Field(
        ...,
        example="12",
        description="The balance of the position.",
    )
    position_id: str = Field(
        ...,
        example="12",
        description="The position ID.",
    )
