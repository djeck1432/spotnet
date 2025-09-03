"""
This module contains the base CRUD database configuration.
"""

import logging
from uuid import UUID

from contextlib import asynccontextmanager
from typing import AsyncIterator, Type, TypeVar, Optional, Any, Generic


from sqlalchemy import func, select
from sqlalchemy.sql import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.models.base import BaseModel

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=BaseModel)


class DBConnector(Generic[ModelType]):
    """
    Provides database connection and operations management using SQLAlchemy
    in a FastAPI application context.

    Methods:
    - write_to_db: Writes an object to the database.
    - get_object: Retrieves an object by its ID in the database.
    - remove_object: Removes an object by its ID from the database.
    - get_objects: Retrieves all objects from the database.
    """

    def __init__(self, model: Type[ModelType]):
        """
        Initialize the database connection, session factory, and table model.

        :param model: Type[ModelType] - The SQLAlchemy model to operate on.
        """
        self.engine = create_async_engine(settings.db_url)
        self.session_maker = async_sessionmaker(bind=self.engine)
        self.model = model

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
            logger.error(f"Error while processing database operation: {e}")
            raise Exception("Error while processing database operation") from e
        finally:
            await session.close()

    async def write_to_db(self, obj: ModelType) -> ModelType:
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

    async def get_object(self, obj_id: UUID) -> ModelType | None:
        """
        Retrieves an object by its ID from the database.
        :param obj_id: uuid = None
        :return: Base | None
        """
        async with self.session() as db:
            return await db.get(self.model, obj_id)

    async def get_object_by_field(
        self, field: str, value: Optional[str] = None
    ) -> ModelType | None:
        """
        Retrieves an object by a specified field from the database.
        :param field: str = None
        :param value: str = None
        :return: Base | None
        """
        async with self.session() as db:
            result = await db.execute(
                select(self.model).where(getattr(self.model, field) == value)
            )
            return result.scalar_one_or_none()

    async def delete_object_by_id(self, obj_id: UUID) -> None:
        """
        Delete an object by its ID from the database. Rolls back if the operation fails.
        :param obj_id: uuid = None
        :return: None
        :raise SQLAlchemyError: If the database operation fails
        """
        async with self.session() as db:
            obj = await db.get(self.model, obj_id)
            if obj:
                await db.delete(obj)
                await db.commit()

    async def delete_object(self, model: ModelType) -> None:
        """
        Deletes an object from the database.
        :param model: Object to delete
        """
        async with self.session() as db:
            await db.delete(model)
            await db.commit()

    async def get_objects(
        self,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        where_clause: Optional[Any] = None,
        **kwargs,
    ) -> list[ModelType] | None:
        """
        Retrieves objects by filter from the database.
        :param limit: Optional[int] = None
        :param offset: Optional[int] = None
        :param where_clause: Optional[Any] = None - SQLAlchemy expression for filtering
                             Example: Model.field == value or Model.field.isnot(None)
        :return: list[Base] | None
        """
        async with self.session() as db:
            query = select(self.model).limit(limit).offset(offset)

            # Apply where_clause if provided (for complex SQLAlchemy expressions)
            if where_clause is not None:
                query = query.where(where_clause)

            # Apply filter_by for keyword arguments (simple equality filters)
            if kwargs:
                query = query.filter_by(**kwargs)

            result = await db.execute(query)
            return list(result.scalars().all())

    async def test_connection(self):
        """
        Test the database connection.
        :return
        """
        async with self.session() as session:
            result = await session.execute(text("SELECT version()"))
            return f"PostgreSQL version: {result.scalar()}"

    async def get_objects_amounts(self, where_clause: Optional[Any] = None) -> int:
        """
        Count total number of objects.
        :return int.
        """
        async with self.session() as db:
            query = select(func.count()).select_from(self.model)

            if where_clause is not None:
                query = query.where(where_clause)

            result = await db.execute(query)
            return result.scalar_one()
