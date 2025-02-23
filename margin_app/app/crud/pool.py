"""
This module contains the UserPoolCRUD class, which provides
CRUD operations for the UserPool model.
"""

import uuid
from decimal import Decimal
from typing import Optional
from app.models.pool import Pool
from app.models.pool import UserPool
from app.crud.base import DBConnector


"""This module contains the PoolCRUD class for managing Pool relation in database."""

class PoolCRUD(DBConnector):
    """Handles Database queries for Pools"""
    async def create_pool(self, token: str) -> Pool:
        """
        Creates a new pool
        :param token: string of the token in the pool
        :return Pool the object successfully added to the database
        
        """
        pool_entry: Pool = Pool(token = token)
        return await self.write_to_db(pool_entry)


class UserPoolCRUD(DBConnector):
    """
    CRUD operations for UserPool model.
    """

    async def create_user_pool(self, user_id: uuid.UUID,
                               pool_id: uuid.UUID, 
                               token: str, amount: Decimal) -> UserPool:
        """
        Create a new user pool entry.

        Args:
            user_id (uuid.UUID): The ID of the user.
            pool_id (uuid.UUID): The ID of the pool.
            token (str): The token associated with the pool.
            amount (Decimal): The amount invested in the pool.

        Returns:
            UserPool: The newly created user pool entry.
        """
        async with self.session() as db:
            user_pool = UserPool(user_id=user_id, pool_id=pool_id,
                                 token=token, amount=amount)
            db.add(user_pool)
            await db.commit()
            await db.refresh(user_pool)
            return user_pool

    async def update_user_pool(self, user_pool_id: uuid.UUID, 
                               token: Optional[str] = None, amount:
                    Optional[Decimal] = None) -> Optional[UserPool]:
        """
        Update user pool details.

        Args:
            user_pool_id (uuid.UUID): The ID of the user pool entry to update.
            token (str, optional): The new token value.
            amount (Decimal, optional): The new amount value.

        Returns:
            Optional[UserPool]: The updated user pool entry, or None if not found.
        """
        async with self.session() as db:
            user_pool = await db.get(UserPool, user_pool_id)
            if not user_pool:
                return None  # Not found
            
            if token:
                user_pool.token = token
            if amount:
                user_pool.amount = amount

            await db.commit()
            await db.refresh(user_pool)
            return user_pool
