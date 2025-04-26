"""
This module contains the UserPoolCRUD class, which provides
CRUD operations for the UserPool model.
"""

from datetime import timedelta
import uuid
from decimal import Decimal
from typing import Optional

from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.orm import aliased

from app.crud.base import DBConnector
from app.models.pool import Pool, PoolRiskStatus, UserPool
import sqlalchemy as sa

"""This module contains the PoolCRUD class for managing Pool relation in database."""


class PoolCRUD(DBConnector):
    """Handles Database queries for Pools"""

    async def create_pool(self, token: str, risk_status: PoolRiskStatus) -> Pool:
        """
        Creates a new pool
        :param token: string of the token in the pool
        :param risk_status: risk status of the pool
        :return Pool the object successfully added to the database
        """
        pool_entry: Pool = Pool(token=token, risk_status=risk_status)
        return await self.write_to_db(pool_entry)

    async def get_pool_by_id(self, pool_id: uuid.UUID) -> Optional[Pool]:
        """
        Fetches a pool by its ID.
        :param pool_id: UUID of the pool to fetch
        :return: Optional[Pool]: The pool if found, None otherwise
        """
        async with self.session() as db:
            return await db.get(Pool, pool_id)

    async def fetch_all_with_amount_delta(
        self, amount_for_delta: timedelta
    ) -> sa.Result[tuple[Pool, Decimal, Decimal]]:
        p = aliased(Pool)
        latest_amount_per_day_subq = aliased(
            (
                sa.select(UserPool.amount)
                .where(UserPool.pool_id == p.id)
                .order_by(UserPool.created_at.desc())
                .limit(1)
                .subquery()
                .lateral()
            )
        )
        earliest_amount_per_day_subq = aliased(
            (
                sa.select(UserPool.amount)
                .where(
                    sa.and_(
                        UserPool.created_at >= sa.func.now() - amount_for_delta,
                        UserPool.pool_id == p.id,
                    )
                )
                .order_by(UserPool.created_at.asc())
                .limit(1)
                .subquery()
                .lateral()
            )
        )
        up = aliased(UserPool)
        stmt = (
            sa.select(
                p,
                sa.func.coalesce(sa.func.sum(up.amount).label("total_amount"), 0),
                (
                    latest_amount_per_day_subq.c.amount
                    - earliest_amount_per_day_subq.c.amount
                ).label("amount_delta_per_day"),
            )
            .select_from(p)
            .outerjoin(latest_amount_per_day_subq, sa.true())
            .outerjoin(earliest_amount_per_day_subq, sa.true())
            .outerjoin(up, up.pool_id == p.id)
            .group_by(
                p.id,
                latest_amount_per_day_subq.c.amount,
                earliest_amount_per_day_subq.c.amount,
            )
        )
        async with self.session() as db:
            return await db.execute(stmt)


class UserPoolCRUD(DBConnector):
    """
    CRUD operations for UserPool model.
    """

    async def create_user_pool(
        self, user_id: uuid.UUID, pool_id: uuid.UUID, amount: Decimal
    ) -> UserPool:
        """
        Create a new user pool entry.

        Args:
            user_id (uuid.UUID): The ID of the user.
            pool_id (uuid.UUID): The ID of the pool.
            amount (Decimal): The amount invested in the pool.

        Returns:
            UserPool: The newly created user pool entry.
        """
        async with self.session() as db:
            user_pool = UserPool(user_id=user_id, pool_id=pool_id, amount=amount)
            db.add(user_pool)
            await db.commit()
            await db.refresh(user_pool)
            return user_pool

    async def update_user_pool(
        self, user_pool_id: uuid.UUID, amount: Optional[Decimal] = None
    ) -> Optional[UserPool]:
        """
        Update user pool details.

        Args:
            user_pool_id (uuid.UUID): The ID of the user pool entry to update.
            amount (Decimal, optional): The new amount value.

        Returns:
            Optional[UserPool]: The updated user pool entry, or None if not found.
        """
        async with self.session() as db:
            user_pool = await db.get(UserPool, user_pool_id)
            if not user_pool:
                return None

            if amount:
                user_pool.amount = amount

            await db.commit()
            await db.refresh(user_pool)
            return user_pool


pool_crud = PoolCRUD(Pool)
user_pool_crud = UserPoolCRUD(UserPool)
