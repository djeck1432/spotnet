"""
This module contains the BaseSchema class definition.
"""

from pydantic import BaseModel, ConfigDict

class BaseSchema(BaseModel):
    """
    Represents Base Class That Serves As Parent For Other Schemas
    """
    model_config = ConfigDict(from_attributes=True)
    
