"""
This module contains the base crud database configuration.
"""

import logging
import uuid
from typing import Type, TypeVar
from app.models.base import BaseModel

from typing import AsyncIterator, Callable
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from app.core.config import settings
logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=BaseModel)


class DBConnector:
    """
    Provides database connection and operations management using SQLAlchemy
    in a FastAPI application context.

    Methods:
    - write_to_db: Writes an object to the database.
    - get_object: Retrieves an object by its ID in the database.
    - remove_object: Removes an object by its ID from the database.
    """

    def __init__(self):
        """
        Initialize the database connection and session factory.
        :param db_url: str = None
        """
        self.engine = create_async_engine(settings.db_url)
        self.session_maker = async_sessionmaker(bind=self.engine)
            
    @asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        """
        Asynchronous context manager for handling database sessions.

        This method creates and yields an asynchronous 
            database session using `self.session_maker()`.  
        It ensures proper handling of transactions and session cleanup.

        Yields:
            AsyncSession: An asynchronous database session.

        Raises:
            Exception: If a database operation fails, 
            an exception is raised after rolling back the transaction.

        Example:
            async with db.session() as session:
                await session.execute(query)
                await session.commit()
        """
        session: AsyncSession = self.session_maker()

        try:
            yield session
        except SQLAlchemyError as e:
            await session.rollback()
            logger.error(f"Error while process database operation: {e}")
            raise Exception("Error while process database operation") from e
        finally:
            await session.close()


    async def write_to_db(self, obj: ModelType = None) -> ModelType:
        """
        Writes an object to the database. Rolls back the transaction if there's an error.
        Refreshes the object to keep it attached to the session.
        :param obj: Base = None
        :raise SQLAlchemyError: If the database operation fails.
        :return: Base - the updated object
        """
        async with self.session() as db:
            obj = await db.merge(obj)
            await db.commit()
            await db.refresh(obj)
            return obj

    async def get_object(
        self, model: Type[ModelType] = None, obj_id: uuid = None
    ) -> ModelType | None:
        """
        Retrieves an object by its ID from the database.
        :param: model: type[Base] = None
        :param: obj_id: uuid = None
        :return: Base | None
        """
        async with self.session() as db:
            return await db.get(model, obj_id)

    async def get_object_by_field(
        self, model: Type[ModelType] = None, field: str = None, value: str = None
    ) -> ModelType | None:
        """
        Retrieves an object by a specified field from the database.
        :param model: type[Base] = None
        :param field: str = None
        :param value: str = None
        :return: Base | None
        """
        async with self.session() as db:
            result = await db.execute(select(model).where(getattr(model, field) == value))
            return result.scalar_one()

    async def delete_object_by_id(
        self, model: Type[ModelType] = None, obj_id: uuid = None
    ) -> None:
        """
        Delete an object by its ID from the database. Rolls back if the operation fails.
        :param model: type[Base] = None
        :param obj_id: uuid = None
        :return: None
        :raise SQLAlchemyError: If the database operation fails
        """
        async with self.session() as db:
            obj = await db.get(model, obj_id)
            if obj:
                await db.delete(obj)
                await db.commit()

    async def delete_object(self, model: ModelType) -> None:
        """
        Deletes an object from the database.
        :param object: Object to delete
        """
        async with self.session() as db:
            await db.delete(model)
            await db.commit()
