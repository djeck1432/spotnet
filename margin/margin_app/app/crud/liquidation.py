"""This module contains the LiquidationCRUD class for managing liquidations."""

from collections.abc import Sequence
import datetime as dt
from uuid import UUID
from decimal import Decimal
import sqlalchemy as sa
from app.crud.base import DBConnector
from app.models.liquidation import Liquidation


class LiquidationCRUD(DBConnector):
    """Handles database operations for liquidations."""

    async def liquidate_position(
        self, margin_position_id: UUID, bonus_amount: Decimal, bonus_token: str
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
            bonus_token=bonus_token,
        )
        return await self.write_to_db(liquidation_entry)

    async def get_totals_for_date(
        self, date: dt.date
    ) -> Sequence[sa.Row[tuple[str, Decimal]]]:
        """
        Retrieves Liquidation.bonus_token with summed up it's bonus_amount
        grouped by bonus_token within provided date
        """
        stmt = (
            sa.select(
                Liquidation.bonus_token,
                sa.func.sum(Liquidation.bonus_amount),
            )
            .where(
                sa.and_(
                    Liquidation.created_at >= date,
                    Liquidation.created_at < date + dt.timedelta(days=1),
                )
            )
            .group_by(Liquidation.bonus_token)
        )
        async with self.session() as session:
            res = await session.execute(stmt)
            return res.all()


liquidation_crud = LiquidationCRUD(Liquidation)
