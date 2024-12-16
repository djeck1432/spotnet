"""
This module contains SQLAlchemy models for the application, including
User, Position, AirDrop, and TelegramUser. Each model represents a
table in the database and defines the structure and relationships
between the data entities.
"""

from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import (
    DECIMAL,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    NUMERIC,
    String,
    Float,
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
    wallet_id = Column(String, nullable=False, unique=True, index=True)
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
    multiplier = Column(NUMERIC, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    status = Column(
        Enum(
            Status, name="status_enum", values_callable=lambda x: [e.value for e in x]
        ),
        nullable=True,
        default="pending",
    )
    start_price = Column(DECIMAL, nullable=False)
    is_protection = Column(Boolean, default=False)
    liquidation_bonus = Column(Float, default=0.0)
    is_liquidated = Column(Boolean, default=False)
    datetime_liquidation = Column(DateTime, nullable=True)


class AirDrop(Base):
    """
    SQLAlchemy model for the airdrop table.
    """

    __tablename__ = "airdrop"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("user.id"), index=True, nullable=False
    )
    created_at = Column(DateTime, nullable=False, default=func.now())
    amount = Column(DECIMAL, nullable=True)
    is_claimed = Column(Boolean, default=False, index=True)
    claimed_at = Column(DateTime, nullable=True)


class TelegramUser(Base):
    """
    SQLAlchemy model for the telegram_user table.
    """

    __tablename__ = "telegram_user"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    telegram_id = Column(String, nullable=False, unique=True, index=True)
    username = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    wallet_id = Column(String, ForeignKey("user.wallet_id"))
    photo_url = Column(String)
    is_allowed_notification = Column(Boolean, default=False)

    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )


class Vault(Base):
    """
    SQLAlchemy model for the vault table.
    """

    __tablename__ = "vault"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("user.id"), index=True, nullable=False
    )
    symbol = Column(String)
    amount = Column(String)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

class TransactionStatus(PyEnum):
    """
    Enum for the transaction status.
    """
    OPENED = "opened"
    CLOSED = "closed"

    @classmethod
    def choices(cls):
        """
        Returns the list of transaction status choices.
        """
        return [status.value for status in cls]

class Transaction(Base):
    """
    SQLAlchemy model for the transaction table.
    Stores transaction information related to positions.
    """
    __tablename__ = "transaction"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    position_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("position.id"), 
        index=True, 
        nullable=False
    )
    status = Column(
        Enum(
            TransactionStatus, 
            name="transaction_status_enum", 
            values_callable=lambda x: [e.value for e in x]
        ),
        nullable=False,
        default="opened",
    )
    transaction_hash = Column(String, nullable=False, unique=True, index=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, 
        nullable=False, 
        default=func.now(), 
        onupdate=func.now()
    )
