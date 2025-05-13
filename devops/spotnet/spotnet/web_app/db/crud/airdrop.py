"""
This module contains the database configuration for airdrops.
"""

import logging
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, TypeVar

from sqlalchemy.exc import SQLAlchemyError

from web_app.db.models import AirDrop, Base

from .base import DBConnector

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class AirDropDBConnector(DBConnector):
    """
    Provides database connection and operations management for the AirDrop model.
    """

    def save_claim_data(self, airdrop_id: uuid.UUID, amount: Decimal) -> None:
        """
        Updates the AirDrop instance with claim data.
        :param airdrop_id: uuid.UUID
        :param amount: Decimal
        """
        airdrop = self.get_object(AirDrop, airdrop_id)
        if airdrop:
            airdrop.amount = amount
            airdrop.is_claimed = True
            airdrop.claimed_at = datetime.now()
            self.write_to_db(airdrop)
        else:
            logger.error(f"AirDrop with ID {airdrop_id} not found")

    def get_all_unclaimed(self) -> List[AirDrop]:
        """
        Returns all unclaimed AirDrop instances (where is_claimed is False).

        :return: List of unclaimed AirDrop instances
        """
        with self.Session() as db:
            try:
                unclaimed_instances = (
                    db.query(AirDrop).filter_by(is_claimed=False).all()
                )
                return unclaimed_instances
            except SQLAlchemyError as e:
                logger.error(
                    f"Failed to retrieve unclaimed AirDrop instances: {str(e)}"
                )
                return []

    def delete_all_users_airdrop(self, user_id: uuid.UUID) -> None:
        """
        Delete all airdrops for a user.
        :param user_id: User ID
        """
        with self.Session() as db:
            try:
                db.query(AirDrop).filter_by(user_id=user_id).delete(
                    synchronize_session=False
                )
                db.commit()
            except SQLAlchemyError as e:
                logger.error(f"Error deleting airdrops for user {user_id}: {str(e)}")
