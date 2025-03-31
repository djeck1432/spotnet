"""
Liquidation model
"""

import uuid

from decimal import Decimal
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel


class Liquidation(BaseModel):
    """
    Liquidation Model
    Columns:
        margin_position_id: Foreign key referencing MarginPosition.id.
        bonus_amount: The amount of bonus given during liquidation.
        bonus_token: The token in which the bonus is given.
        created_at: Timestamp when the liquidation was created.
    """

    __tablename__ = "liquidation"

    margin_position_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("margin_position.id"),
        nullable=False
    )
    bonus_amount: Mapped[Decimal] = mapped_column(nullable=False)
    bonus_token: Mapped[str] = mapped_column(String, nullable=False)
