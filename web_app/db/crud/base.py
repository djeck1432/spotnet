"""
This module contains the base crud database configuration.
"""

import logging
import uuid
from typing import Type, TypeVar

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker

from web_app.db.database import SQLALCHEMY_DATABASE_URL
from web_app.db.models import AirDrop, Base

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class DBConnector:
    """
    Provides database connection and operations management using SQLAlchemy
    in a FastAPI application context.

    Methods:
    - write_to_db: Writes an object to the database.
    - get_object: Retrieves an object by its ID in the database.
    - remove_object: Removes an object by its ID from the database.
    """

    def __init__(self, db_url: str = SQLALCHEMY_DATABASE_URL):
        """
        Initialize the database connection and session factory.
        :param db_url: str = None
        """
        self.engine = create_engine(db_url)
        self.session_factory = sessionmaker(bind=self.engine)
        self.Session = scoped_session(self.session_factory)

    def write_to_db(self, obj: Base = None) -> Base:
        """
        Writes an object to the database. Rolls back the transaction if there's an error.
        Refreshes the object to keep it attached to the session.
        :param obj: Base = None
        :raise SQLAlchemyError: If the database operation fails.
        :return: Base - the updated object
        """
        with self.Session() as session:
            try:
                session.add(obj)
                session.commit()
                session.refresh(obj)
                return obj

            except SQLAlchemyError as e:
                session.rollback()
                raise e

    def get_object(
        self, model: Type[ModelType] = None, obj_id: uuid = None
    ) -> ModelType | None:
        """
        Retrieves an object by its ID from the database.
        :param: model: type[Base] = None
        :param: obj_id: uuid = None
        :return: Base | None
        """
        db = self.Session()
        try:
            return db.query(model).filter(model.id == obj_id).first()
        finally:
            db.close()

    def get_object_by_field(
        self, model: Type[ModelType] = None, field: str = None, value: str = None
    ) -> ModelType | None:
        """
        Retrieves an object by a specified field from the database.
        :param model: type[Base] = None
        :param field: str = None
        :param value: str = None
        :return: Base | None
        """
        db = self.Session()
        try:
            return db.query(model).filter(getattr(model, field) == value).first()
        finally:
            db.close()

    def delete_object_by_id(
        self, model: Type[Base] = None, obj_id: uuid = None
    ) -> None:
        """
        Delete an object by its ID from the database. Rolls back if the operation fails.
        :param model: type[Base] = None
        :param obj_id: uuid = None
        :return: None
        :raise SQLAlchemyError: If the database operation fails
        """
        db = self.Session()

        try:
            obj = db.query(model).filter(model.id == obj_id).first()
            if obj:
                db.delete(obj)
                db.commit()

            db.rollback()

        except SQLAlchemyError as e:
            db.rollback()
            raise e

        finally:
            db.close()

    def delete_object(self, object: Base) -> None:
        """
        Deletes an object from the database.
        :param object: Object to delete
        """
        db = self.Session()
        try:
            db.delete(object)
            db.commit()

        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error deleting object: {e}")

        finally:
            db.close()

    def create_empty_claim(self, user_id: uuid.UUID) -> AirDrop:
        """
        Creates a new empty AirDrop instance for the given user_id.
        :param user_id: uuid.UUID
        :return: AirDrop
        """
        airdrop = AirDrop(user_id=user_id)
        self.write_to_db(airdrop)
        return airdrop
