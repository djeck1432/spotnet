"""
This module provides CRUD operations for the leaderboard, retrieving the top users by positions.

"""
from .base import DBConnector
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from web_app.db.models import User, Position
import logging

logger = logging.getLogger(__name__)

class LeaderboardDBConnector(DBConnector):
    """
    Provides database connection and operations management using SQLAlchemy
    in a FastAPI application context.
    """

    def get_top_users_by_positions(self) -> list[dict]:
        """
        Retrieves the top 10 users ordered by closed/opened positions.
        :return: List of dictionaries containing wallet_id and positions_number.
        """
        with self.Session() as db:
            try:
                results = (
                    db.query(
                        User.wallet_id,
                        func.count(Position.id).label("positions_number")
                    )
                    .join(Position, Position.user_id == User.id)
                    .filter(Position.status.in_(["closed", "opened"]))
                    .group_by(User.wallet_id)
                    .order_by(func.count(Position.id).desc())
                    .limit(10)
                    .all()
                )

                return [
                    {"wallet_id": result.wallet_id, "positions_number": result.positions_number}
                    for result in results
                ]

            except SQLAlchemyError as e:
                logger.error(f"Error retrieving top users by positions: {e}")
                return []
            
    def get_position_token_statistics(self) -> list[dict]:
        """
        Retrieves closed/opened positions groupped by token_symbol.
        :return: List of dictionaries containing token_symbol and total_positions.
        """
        with self.Session() as db:
            try:
                results = (
                    db.query(
                        Position.token_symbol,
                        func.count(Position.id).label("total_positions")
                    )
                    .filter(Position.status.in_(["closed", "opened"]))
                    .group_by(Position.token_symbol)
                    .all()
                )

                return [
                    {
                        "token_symbol": result.token_symbol,
                        "total_positions": result.total_positions
                    }
                    for result in results
                ]

            except SQLAlchemyError as e:
                logger.error(f"Error retrieving position token statistics: {e}")
                return []
