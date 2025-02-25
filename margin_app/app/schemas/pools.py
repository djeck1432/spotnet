"""
This module contains Pydantic schemas for Pools.
"""

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from decimal import Decimal


class UserPoolBase(BaseModel):
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


class UserPoolResponse(UserPoolBase):
    """
    User pool response model
    """

    id: UUID

    model_config = ConfigDict(from_attributes=True)
