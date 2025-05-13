"""
This module contains the Pool and UserPool models.
"""

import uuid
from decimal import Decimal
from enum import Enum
from typing import List

from sqlalchemy import ForeignKey, String, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel

class PoolRiskStatus(Enum):
    """PoolRiskStatus Enum"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Pool(BaseModel):
    """
    Represents a pool in the application.
    """

    __tablename__ = "pool"

    token: Mapped[str] = mapped_column(String, nullable=False)
    risk_status: Mapped[PoolRiskStatus] = mapped_column(
        SQLAlchemyEnum(
            PoolRiskStatus,
            name="pool_risk_status",
            values_callable=lambda obj: [e.value for e in obj],
        )
    )
    user_pools: Mapped[List["UserPool"]] = relationship(back_populates="pool")

    def __repr__(self) -> str:
        """
        Returns a string representation of the Pool object.
        """
        return f"<Pool(id={self.id}, token={self.token})>"


class UserPool(BaseModel):
    """
    Represents a user's participation in a pool.
    This acts as an association table between users and pools,
    and stores additional information about the user's participation.
    """

    __tablename__ = "user_pool"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id"), nullable=False
    )
    pool_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pool.id"), nullable=False
    )
    amount: Mapped[Decimal] = mapped_column(nullable=False)
    pool: Mapped["Pool"] = relationship(back_populates="user_pools", lazy="selectin")

    def __repr__(self) -> str:
        """
        Returns a string representation of the UserPool object.
        """
        return (
            f"<UserPool(id={self.id}, user_id={self.user_id}, pool_id={self.pool_id}, "
            f"token={self.pool.token}, amount={self.amount})>"
        )
