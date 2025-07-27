"""
Admin model definitions for the application.
"""

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from .base import BaseModel


class Admin(BaseModel):
    """
    Represents an administrative user with elevated privileges.

    Attributes:
        email (str): The unique email address of the admin.
        name (str): The full name of the admin.
        is_super_admin (bool): Indicates if the admin has super admin privileges.
        password (str): The hashed password of the admin (stored as a hashed value).
    """

    __tablename__ = "admins"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        comment="The unique email address of the admin.",
    )
    name: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, comment="The full name of the admin."
    )
    is_super_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Indicates if the admin has super admin privileges.",
    )
    password: Mapped[Optional[str]] = mapped_column(
        String(255), comment="The hashed password of the admin."
    )
