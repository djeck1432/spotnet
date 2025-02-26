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

class UserPoolUpdate(BaseModel):
    """
    User pool update model
    """

    user_pool_id: UUID
    amount: Optional[Decimal] = None

    model_config = ConfigDict(from_attributes=True)

class UserPoolResponse(UserPoolBase):
    """
    User pool response model
    """

    id: UUID

    model_config = ConfigDict(from_attributes=True)

class UserPoolUpdateResponse(UserPoolBase):
    """
    User pool update response model
    """

    id: UUID
    updated_at: str 

    model_config = ConfigDict(from_attributes=True)
