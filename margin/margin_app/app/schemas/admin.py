"""
This module contains Pydantic schemas for admin.
"""
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class AdminBase(BaseModel):
    """
    Admin base model
    """

    name: str
    email: EmailStr


class AdminRequest(AdminBase):
    """
    Admin request model
    """

    password: str


class AdminResetPassword(BaseModel):
    """
    Admin reset password model
    """

    old_password: str
    new_password: str


class AdminResponse(AdminBase):
    """
    Admin response model
    """

    id: UUID

    model_config = ConfigDict(from_attributes=True)
