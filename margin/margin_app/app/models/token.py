from sqlalchemy import Boolean, Column, String, Numeric
from app.models.base import Base
from typing import List

class Token(Base):
    """Model representing supported tokens/assets in the system"""
    __tablename__ = "tokens"

    id = Column(String, primary_key=True, index=True)  # Using symbol as ID (e.g., "BTC")
    name = Column(String, nullable=False, unique=True)  # Full name (e.g., "Bitcoin")
    decimals = Column(Numeric, nullable=False, default=18)  # Token decimals
    is_active = Column(Boolean, default=True)  # Whether token is active for trading
    
    # Optional fields you might want to add later:
    # contract_address = Column(String)  # For ERC20 tokens
    # coin_gecko_id = Column(String)     # For price API lookups
    # logo_url = Column(String)         # For UI display


class TokenAsset(Base):
    """Model representing a token asset with its name, amount, and value."""
    name: str
    amount: float
    value: float

class AssetsResponse(Base):
    """Response model for asset statistics."""
    """Model representing the total value of assets and a list of token assets."""
    total_value: float
    assets: List[TokenAsset]