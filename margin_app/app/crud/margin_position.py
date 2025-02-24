"""
This module contains the MarginPositionCRUD Class for opening ,
updating and closing margin positions.
"""

import uuid
from decimal import Decimal
from app.crud.base import DBConnector
from app.models.margin_position import MarginPosition
from app.models.margin_position import MarginPositionStatus


class MarginPositionCRUD(DBConnector):
    """"Handles margin position database operations"""
    async def open_margin_position(
        self, user_id: uuid.UUID,
        borrowed_amount: Decimal,
        multiplier: int,
        transaction_id: str
    ) -> MarginPosition:
        """
        Opens a margin position by creating an entry record in the database.
        :param user_id: uuid
        :param borrowed_amount: Decimal
        :param multiplier int
        :param transaction_id str
        :return: MarginPosition
        """
        position_entry = MarginPosition(
            user_id=user_id,
            borrowed_amount=borrowed_amount,
            multiplier=multiplier,
            transaction_id=transaction_id,
            status=MarginPositionStatus.OPEN
        )
        position = await self.write_to_db(position_entry)
        return position

    async def close_margin_position(self, position_id : uuid.UUID) -> MarginPositionStatus:
        """
        Closes a margin position by updating the position status in the database.
        :param position_id: uuid
        :return: MarginPositionStatus
        """

        position = await self.get_object(MarginPosition, position_id)
        if position:
            position.status = MarginPositionStatus.CLOSED
            await self.write_to_db(position)
            return position.status

margin_position_crud = MarginPositionCRUD()
