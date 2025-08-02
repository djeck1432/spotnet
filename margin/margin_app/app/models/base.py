"""
Base model definitions for the application.
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import as_declarative
from sqlalchemy.orm import Mapped, mapped_column


@as_declarative()
class Base:
    """Base model for all database tables"""


class BaseModel(Base):
    """
    Abstract model which includes common fields such as
    id, created_at, and updated_at.
    """

    __abstract__ = True

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

