"""
This module contains the BaseSchema class definition.
"""

from pydantic import BaseModel, ConfigDict
from typing import TypeVar, Generic, List


class BaseSchema(BaseModel):
    """
    Represents Base Class That Serves As Parent For Other Schemas
    """

    model_config = ConfigDict(from_attributes=True)


T = TypeVar("T", bound=BaseModel)


class GetAll(BaseModel, Generic[T]):
    """
    Represents a generic response schema for getting all items.
    """

    items: List[T]
    total: int
