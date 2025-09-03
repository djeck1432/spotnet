from decimal import Decimal
from typing import List, Dict
from app.crud.admin import admin_crud
from app.contract_tools.mixins.admin import AdminMixin
from app.models.token import Token
from sqlalchemy import select, func
from app.models import Pool, UserPool



class StatisticsService:
    @staticmethod
    async def get_asset_statistics(session):
        """
        Get asset statistics including total value and breakdown by token
        """
        token_amounts = await admin_crud.get_token_statistics(session)
        
        # Get current prices using existing AdminMixin
        prices = await AdminMixin.get_current_prices()
        
        # Calculate values
        assets = []
        total_value = Decimal('0')
        
        for token_name, amount in token_amounts.items():
            current_price = prices.get(Token.name, Decimal('0'))
            value = amount * current_price
            assets.append({
                "name": Token.name,
                "amount": float(amount),
                "value": float(value)
            })
            total_value += value
        
        return {
            "total_value": float(total_value),
            "assets": assets
        }
    
    @staticmethod
    async def _get_token_amounts(session) -> Dict[str, Decimal]:
        """
        Get total token amounts across all user pools grouped by token
        """
     
        result = await session.execute(
            select(
                Pool.token,
                func.sum(UserPool.amount).label("total_amount")
            )
            .join(UserPool, UserPool.pool_id == Pool.id)
            .group_by(Pool.token)
        )
        
        return {row.token_id: row.total_amount for row in result.all()}
