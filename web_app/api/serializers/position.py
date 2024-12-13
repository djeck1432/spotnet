"""
This module defines the serializers for the position data.
"""

from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import List, Optional


class PositionFormData(BaseModel):
    """
    Pydantic model for the form data
    """

    wallet_id: str
    token_symbol: str
    amount: str
    multiplier: float

    @field_validator("multiplier", mode="before")
    def validate_multiplier(cls, value: str) -> float:
        """
        Validate the multiplier value
        :param value: int
        :return: int
        """
        try:
            return float(value)
        except (ValueError, TypeError):
            raise Exception("Multiplier should be an integer")


class TokenMultiplierResponse(BaseModel):
    """
    This class defines the structure of the response for the token multiplier
    endpoint, encapsulating a dictionary where each token symbol:
    (e.g., "ETH", "STRK")
    is mapped to its respective multiplier value.

    ### Parameters:
    - **multipliers**: A dictionary containing token symbols as keys:
      (e.g., "ETH", "STRK", "USDC")
      and their respective multipliers as values.

    ### Returns:
    A structured JSON response with each token and its multiplier.
    """

    multipliers: dict[str, float]

    class Config:
        """
        Metadata for TokenMultiplierResponse
        with example JSON response format in **schema_extra**.
        """

        schema_extra = {
            "example": {"multipliers": {"ETH": 5.0, "STRK": 2.5, "USDC": 5.0}}
        }


class UserPositionResponse(BaseModel):
    """
    Represents a single position in the user's position list.
    """
    id: str
    token_symbol: str
    amount: str
    multiplier: float
    status: str
    created_at: datetime
    start_price: float
    is_liquidated: bool
    datetime_liquidation: Optional[datetime] = None


class UserPositionsListResponse(BaseModel):
    """
    Response model for list of user positions.
    """
    List[UserPositionResponse]
