# app/services/statistics.py
from typing import List, Dict
from app.crud.admin import admin_crud
from app.external.price_oracle import get_current_prices 

class StatisticsService:
    @staticmethod
    async def get_asset_statistics():
        # Get token amounts from database
        token_amounts = await admin_crud.get_token_statistics()
        
        # Get current prices (implement this based on your price source)
        token_names = [token.name for token in token_amounts]
        prices = await get_current_prices(token_names)
        
        # Calculate values
        assets = []
        total_value = 0.0
        
        for token in token_amounts:
            current_price = prices.get(token.name, 0)
            value = token.total_amount * current_price
            assets.append({
                "name": token.name,
                "amount": token.total_amount,
                "value": value
            })
            total_value += value
        
        return {
            "total_value": total_value,
            "assets": assets
        }