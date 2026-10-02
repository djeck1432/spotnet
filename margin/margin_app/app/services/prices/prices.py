from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from margin_app.core.db import TokenPrice


class PriceService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_price(self, token_symbol: str) -> Decimal | None:
        """Get current price for a token symbol."""
        from sqlalchemy import select
        result = await self.session.execute(
            select(TokenPrice.price).where(TokenPrice.token_symbol == token_symbol)
        )
        row = result.scalar_one_or_none()
        return Decimal(str(row)) if row is not None else None
