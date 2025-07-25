"""
Pydantic schemas for admin user management.

This module defines request and response models for admin-related API endpoints,
including validation rules and serialization configurations.
"""

from uuid import UUID
from typing import Optional
from .base import GetAll, BaseSchema
from pydantic import EmailStr, ConfigDict


class AdminBase(BaseSchema):
    """
    Admin base model
    """

    name: Optional[str] = None
    email: EmailStr


class AdminRequest(AdminBase):
    """
    Admin request model
    """

    email: EmailStr
    name: Optional[str] = None

    class Config:
        "Only allow fields that are defined in the model"
        extra = "forbid"


class AdminResetPassword(BaseSchema):
    """
    Schema for token-based admin password reset.

    This schema is used when an admin user resets their password
    using a secure reset token received via email. It requires
    the token and the new password.
    """
    token: str
    new_password: str


class AdminResponse(AdminBase):
    """
    Admin response model
    """

    id: UUID

    model_config = ConfigDict(from_attributes=True)


class AdminGetAllResponse(GetAll[AdminResponse]):
    """
    Admin get all response model
    """


class AdminUpdateRequest(BaseSchema):
    """
    Admin update request model (for updating admin fields)
    """

    name: Optional[str] = None


class AdminLogin(BaseSchema):
    """
    Request model for admin login
    """

    email: str
    password: str
