"""
Serializers for leaderboard data.
"""

from pydantic import BaseModel


class UserLeaderboardItem(BaseModel):
    """
    Represents statistics for positions of a specific user.
    """

    wallet_id: str
    positions_number: int


class TokenPositionStatistic(BaseModel):
    """
    Represents statistics for positions of a specific token.
    """

    token_symbol: str
    total_positions: int
