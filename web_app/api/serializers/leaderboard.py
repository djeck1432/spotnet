"""
This module contains serializers for leaderboard-related data.
"""

from pydantic import BaseModel

class TokenPositionStatistic(BaseModel):
    """
    Represents statistics for positions of a specific token.
    """
    token_symbol: str
    total_positions: int
    opened_positions: int
    closed_positions: int
    liquidated_positions: int
