from sqlalchemy import Boolean, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class Token(Base):
    """Model representing supported tokens/assets in the system"""
    __tablename__ = "tokens"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)  # e.g., "BTC"
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)  # e.g., "Bitcoin"
    decimals: Mapped[int] = mapped_column(Numeric, nullable=False, default=18)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Optional fields you might want to add later:
    # contract_address = Column(String)  # For ERC20 tokens
    # coin_gecko_id = Column(String)     # For price API lookups
    # logo_url = Column(String)         # For UI display

    def __repr__(self):
        return f"<Token(id={self.id}, name={self.name})>"
