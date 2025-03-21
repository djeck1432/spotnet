from pydantic import BaseModel

class Admin(BaseModel):
    """Admin schema for authentication."""
    username: str
    email: str

class Token(BaseModel):
    """Schema for JWT response."""
    access_token: str
    token_type: str
