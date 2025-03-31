"""
This module contains Pydantic schemas for Pools.
"""

from .base import BaseSchema
from uuid import UUID
from typing import Optional
from decimal import Decimal

from app.models.pool import PoolRiskStatus
from datetime import datetime

from typing import Optional



class UserPoolBase(BaseSchema):
    """
    User pool base model
    """

    user_id: UUID
    pool_id: UUID
    amount: Decimal


class UserPoolCreate(UserPoolBase):
    """
    User pool create model
    """

    pass


class UserPoolUpdate(BaseSchema):
    """
    User pool update model
    """

    user_pool_id: UUID
    amount: Optional[Decimal] = None


class UserPoolResponse(UserPoolBase):
    """
    User pool response model
    """

    id: UUID


class UserPoolUpdateResponse(UserPoolBase):
    """
    User pool update response model
    """

    id: UUID
    updated_at: datetime

class PoolBase(BaseSchema):
    """
    Pool base model
    """

    token: str
    risk_status: Optional[PoolRiskStatus] = PoolRiskStatus.LOW


class PoolCreate(PoolBase):
    """
    Pool create model
    """


class PoolUpdate(PoolBase):
    """
    Pool update model
    """


class PoolResponse(PoolBase):
    """
    Pool response model
    """

    id: UUID


class PoolGetAllResponse(BaseSchema):
    """
    User pool update model
    """

    pools: list[PoolResponse]
    total: int


