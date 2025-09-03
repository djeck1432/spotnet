from pydantic import BaseModel
from typing import List


class TokenAsset(BaseModel):
    """Model representing a token asset with its name, amount, and value."""
    name: str
    amount: float
    value: float

class AssetsResponse(BaseModel):
    """Response model for asset statistics."""
    """Model representing the total value of assets and a list of token assets."""
    total_value: float
    assets: List[TokenAsset]