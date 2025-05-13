'''
Transaction model for the application.
'''

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from .base import BaseModel
import uuid

class Transaction(BaseModel):
    """
    Represents a financial transaction associated with a user.

    Attributes:
        transaction_id (str): Unique identifier for the transaction.
        event_name (str): Name of the event related to the transaction.
        user_id (uuid.UUID): ID of the user who made the transaction.
    """
    __tablename__ = "transaction"

    transaction_id: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    event_name: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id"), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="transactions")