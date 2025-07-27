"""
UserOrder model "Order" word is reserved in sql, so can not be used
"""

from decimal import Decimal
from sqlalchemy import VARCHAR, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class UserOrder(BaseModel):
    """
    Represents an order placed by a user.

    Attributes:
    - user_id (UUID): The unique identifier of the user who placed the order.
                      Acts as both a primary key and a foreign key referencing the "user" table.
    - price (Decimal): The price of the order.
    - token (str): The token associated with the order.
    - position (UUID): The identifier of the position related to the order.

    Table:
    - Name: "user_order"
    """

    __tablename__ = "user_order"
    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id"), primary_key=True
    )
    price: Mapped[Decimal] = mapped_column(nullable=False)
    token: Mapped[str] = mapped_column(VARCHAR)
    position: Mapped[UUID] = mapped_column(UUID(as_uuid=True))
