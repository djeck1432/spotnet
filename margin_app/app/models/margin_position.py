"""
MarginPosition model
"""

import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum
from sqlalchemy import String, ForeignKey, CheckConstraint, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel

class MarginPositionStatus(Enum):
    """MarginPositionStatus Enum"""
    OPEN = "Open"
    CLOSED = "Closed"

class MarginPosition(BaseModel):
    """
    MarginPosition Model
    Columns:
        user_id: Foreign key referencing User.id.
        multiplier: Integer value between 1 and 20.
        borrowed_amount: The amount borrowed in the margin position.
        status: Current status of the margin position (Open or Closed).
        transaction_id: Unique identifier for the transaction.
        liquidated_at: Timestamp when the position was liquidated (if applicable).
    """

    __tablename__ = 'margin_position'

    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey('user.id'), 
        nullable=False
    )
    multiplier: Mapped[int] = mapped_column(nullable=False)
    borrowed_amount: Mapped[Decimal] = mapped_column(nullable=False)
    status: Mapped[MarginPositionStatus] = mapped_column(
        SQLAlchemyEnum(
            MarginPositionStatus,
            name="margin_position_status",
            values_callable=lambda obj: [e.value for e in obj],
        ),
        default=MarginPositionStatus.OPEN
    )
    transaction_id: Mapped[str] = mapped_column(String, nullable=False)
    liquidated_at: Mapped[datetime] = mapped_column(nullable=True)

    user: Mapped["User"] = relationship(back_populates="margin_position")

    __table_args__ = (
        CheckConstraint('multiplier >= 1 AND multiplier <= 20', name='check_multiplier_range'),
        CheckConstraint("status IN ('Open', 'Closed')", name='check_valid_status'),
    )

