from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Boolean
from web_app.db.database import Base


class User(Base):
    """
    SQLAlchemy model for the user table.
    """
    __tablename__ = 'user'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    is_contract_deployed = Column(Boolean, default=False)
    wallet_id = Column(String, nullable=False, index=True)
    deployed_transaction_hash = Column(String)

