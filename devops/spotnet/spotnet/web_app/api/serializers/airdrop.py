"""
Serializers for airdrop data.
"""

from typing import List
from pydantic import BaseModel


class AirdropItem(BaseModel):
    """Model for individual airdrop items."""

    amount: str
    proof: List[str]  # This needs to be List[str], not str
    is_claimed: bool
    recipient: str


class AirdropResponseModel(BaseModel):
    """Model for the complete airdrop response."""

    airdrops: List[AirdropItem]
