"""
This module contains Pydantic schemas for auth.
"""
from pydantic import BaseModel


class Token(BaseModel):
    """
    Auth jwt model
    """

    access_token: str
    token_type: str

