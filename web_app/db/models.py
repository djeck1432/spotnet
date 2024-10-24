<<<<<<< HEAD
from enum import Enum as PyEnum
=======
"""
This module contains the SQLAlchemy models for the database.
"""

>>>>>>> b82f7221c5be1e47642e3206ae96a015b4176c77
from uuid import uuid4

from sqlalchemy import (
    DECIMAL,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from web_app.db.database import Base


class Status(PyEnum):
    """
    Enum for the position status.
    """

    PENDING = "pending"
    OPENED = "opened"
    CLOSED = "closed"

    @classmethod
    def choices(cls):
        """
        Returns the list of status choices.
        """
        return [status.value for status in cls]


class User(Base):
    """
    SQLAlchemy model for the user table.
    """

    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    is_contract_deployed = Column(Boolean, default=False)
    wallet_id = Column(String, nullable=False, index=True)
    contract_address = Column(String)


class Position(Base):
    """
    SQLAlchemy model for the position table.
    """

    __tablename__ = "position"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("user.id"), index=True, nullable=False
    )
    token_symbol = Column(String, nullable=False)
    amount = Column(String, nullable=False)
    multiplier = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    status = Column(
        Enum(
            Status, name="status_enum", values_callable=lambda x: [e.value for e in x]
        ),
        nullable=True,
        default="pending",
    )
    start_price = Column(DECIMAL, nullable=False)
