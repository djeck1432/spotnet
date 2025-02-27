"""This module contains the LiquidationCRUD class for managing liquidations."""

from uuid import UUID
from decimal import Decimal

from app.crud.base import DBConnector
from app.models.liquidation import Liquidation

class LiquidationCRUD(DBConnector):
    """Handles database operations for liquidations."""

    async def liquidate_position(
        self, margin_position_id: UUID,
        bonus_amount: Decimal,
        bonus_token: str
    ) -> Liquidation:
        """
        Liquidates a position by creating a liquidation record in the database.

        :param margin_position_id: UUID of the position to be liquidated.
        :param bonus_amount: Decimal
        :param bonus_token: str
        :return: The created Liquidation record.
        """
        liquidation_entry = Liquidation(
            margin_position_id=margin_position_id,
            bonus_amount=bonus_amount,
            bonus_token=bonus_token
        )
        return await self.write_to_db(liquidation_entry)

liquidation_crud = LiquidationCRUD()
