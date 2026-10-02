from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from margin_app.app.schemas.assets import TokenAmount
from margin_app.core.db import UserPool


class AssetsStatsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_assets_statistic(self) -> list[dict]:
        """
        Sum token amounts across all user_pools and multiply by current prices.
        Returns a list of asset statistics.
        """
        result = await self.session.execute(
            select(
                UserPool.token_symbol,
                func.sum(UserPool.token_amount).label("total_amount"),
            )
            .group_by(UserPool.token_symbol)
        )
        rows = result.fetchall()

        statistics = []
        for row in rows:
            token_symbol = row.token_symbol
            total_amount = row.total_amount or Decimal("0")

            # Get current price from price service
            price_service = self._get_price_service()
            price = await price_service.get_price(token_symbol)

            statistics.append(
                {
                    "token_symbol": token_symbol,
                    "total_amount": str(total_amount),
                    "price": str(price) if price is not None else "0",
                    "total_value": str(total_amount * (price or Decimal("0"))),
                }
            )

        return statistics

    def _get_price_service(self):
        """Lazy import to avoid circular dependencies."""
        from margin_app.app.services.prices.prices import PriceService
        return PriceService(self.session)
