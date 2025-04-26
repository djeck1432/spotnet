"""
This module contains Pydantic schemas for Pools.
"""

from .base import BaseSchema
from uuid import UUID
from typing import Optional
from decimal import Decimal
from pydantic import ConfigDict
from .base import GetAll
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


class UserPoolGetAllResponse(GetAll[UserPoolResponse]):
    """
    User pool get all response model
    """


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


class PoolGetAllResponse(GetAll[PoolResponse]):
    """
    User pool update model
    """


class PoolStatisticResponse(PoolBase):
    """
    Pool statistic response model
    """

    total_amount: Decimal
    amount_delta_per_day: Decimal
