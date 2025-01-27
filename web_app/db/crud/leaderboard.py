"""
This module contains the leaderboard database operations.
"""
import logging
from typing import List
from sqlalchemy import func, case
from sqlalchemy.exc import SQLAlchemyError
from web_app.db.models import Position, Status
from web_app.db.crud.position import PositionDBConnector
from web_app.api.serializers.leaderboard import TokenPositionStatistic

logger = logging.getLogger(__name__)

class LeaderboardCRUD(PositionDBConnector):
    """
    Provides database operations for leaderboard-related functionality.
    """
    
    def get_position_token_statistics(self) -> List[TokenPositionStatistic]:
        """
        Retrieves statistics about positions grouped by token symbol.
        
        Returns:
            List[TokenPositionStatistic]: List of statistics for each token
        """
        with self.Session() as db:
            try:
                # Query to get counts for each token and status
                stats = (
                    db.query(
                        Position.token_symbol,
                        func.count().label('total_positions'),
                        func.sum(
                            case(
                                (Position.status == Status.OPENED.value, 1),
                                else_=0
                            )
                        ).label('opened_positions'),
                        func.sum(
                            case(
                                (Position.status == Status.CLOSED.value, 1),
                                else_=0
                            )
                        ).label('closed_positions'),
                        func.sum(
                            case(
                                (Position.is_liquidated.is_(True), 1),
                                else_=0
                            )
                        ).label('liquidated_positions')
                    )
                    .filter(Position.status != Status.PENDING.value)
                    .group_by(Position.token_symbol)
                    .all()
                )
                
                # Convert query results to response model
                return [
                    TokenPositionStatistic(
                        token_symbol=token_symbol,
                        total_positions=total_positions,
                        opened_positions=opened_positions or 0,
                        closed_positions=closed_positions or 0,
                        liquidated_positions=liquidated_positions or 0
                    )
                    for (
                        token_symbol,
                        total_positions,
                        opened_positions,
                        closed_positions,
                        liquidated_positions
                    ) in stats
                ]
            except SQLAlchemyError as e:
                logger.error(f"Error retrieving position token statistics: {str(e)}")
                return []
