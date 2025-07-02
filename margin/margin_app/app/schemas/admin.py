"""
This module contains Pydantic schemas for admin.
"""

from uuid import UUID
from typing import Optional, List
from decimal import Decimal
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


class AssetStatisticResponse(BaseSchema):
    """
    Asset statistic response model
    """
    token: str
    total_amount: Decimal
    total_value: Decimal

    model_config = ConfigDict(from_attributes=True)


class AssetStatisticsResponse(BaseSchema):
    """
    Asset statistics response model
    """
    assets: List[AssetStatisticResponse]
    total_portfolio_value: Decimal

    model_config = ConfigDict(from_attributes=True)
