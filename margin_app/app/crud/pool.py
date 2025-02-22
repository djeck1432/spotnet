"""This module contains the PoolCRUD class for managing Pool relation in database."""
from app.crud.base import DBConnector
from app.models.pool import Pool


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
    

