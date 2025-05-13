"""
This module handles leaderboard-related API endpoints.
"""
from fastapi import APIRouter
from web_app.db.crud.leaderboard import LeaderboardDBConnector
from web_app.api.serializers.leaderboard import UserLeaderboardItem, TokenPositionStatistic

router = APIRouter()
leaderboard_db_connector = LeaderboardDBConnector()

@router.get(
    "/api/get-user-leaderboard",
    tags=["Leaderboard"],
    response_model=list[UserLeaderboardItem],
    summary="Get user leaderboard",
    response_description="Returns the top 10 users ordered by closed/opened positions.",
)
async def get_user_leaderboard() -> list[UserLeaderboardItem]:
    """
    Get the top 10 users ordered by closed/opened positions.
    """
    leaderboard_data = leaderboard_db_connector.get_top_users_by_positions()
    return leaderboard_data


@router.get(
    "/api/get-position-tokens-statistic",
    tags=["Leaderboard"],
    response_model=list[TokenPositionStatistic],
    summary="Get statistics of positions by token",
    response_description="Returns statistics of opened/closed positions by token",
)
async def get_position_tokens_statistic() -> list[TokenPositionStatistic]:
    """
    This endpoint retrieves statistics about positions grouped by token symbol.
    Returns counts of opened and closed positions for each token.
    """
    return leaderboard_db_connector.get_position_token_statistics()
