"""
This module defines the Deposit model for the Spotnet application.
"""

from uuid import UUID
from sqlalchemy import ForeignKey, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from decimal import Decimal
from .base import BaseModel

class Deposit(BaseModel):
    """
    Represents a deposit transaction in the Spotnet application.
    """

    __tablename__ = "deposit"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    token: Mapped[str] = mapped_column(String, nullable=False)
    amount: Mapped[Decimal] = mapped_column(
        Numeric(precision=10, scale=2), 
        nullable=False
    )
    transaction_id: Mapped[str] = mapped_column(
        String, 
        nullable=False, 
        unique=True
    )

    user: Mapped["User"] = relationship(back_populates="deposits")