"""
This module handles leaderboard-related API endpoints.
"""

from fastapi import APIRouter
from typing import List

from web_app.api.serializers.leaderboard import TokenPositionStatistic
from web_app.db.crud.leaderboard import LeaderboardCRUD

router = APIRouter()
leaderboard_crud = LeaderboardCRUD()

@router.get(
    "/api/get-position-tokens-statistic",
    tags=["Leaderboard"],
    response_model=List[TokenPositionStatistic],
    summary="Get statistics of positions by token",
    response_description="Returns statistics of opened/closed positions by token",
)
async def get_position_tokens_statistic() -> List[TokenPositionStatistic]:
    """
    This endpoint retrieves statistics about positions grouped by token symbol.
    Returns counts of opened and closed positions for each token.
    """
    return leaderboard_crud.get_position_token_statistics()
