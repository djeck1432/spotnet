from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.token import Token
from app.crud.base import DBConnector

class CRUDToken(DBConnector[Token]):
    """CRUD operations for Token model"""
    
    async def get_by_name(self, name: str) -> Token | None:
        result = await self.session.execute(
            select(Token).where(Token.name == name)
        )
        return result.scalars().first()

token_crud = CRUDToken(Token)