from fastapi import logger
import httpx
from typing import Dict, List

async def get_current_prices(token_names: List[str]) -> Dict[str, float]:
    """Fetch current prices from an external API"""
    # Example implementation using CoinGecko
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={
                    "ids": ",".join(token_names).lower(),
                    "vs_currencies": "usd"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                token: data[token.lower()]["usd"]
                for token in token_names
            }
    except Exception as e:
        logger.error(f"Error fetching prices: {str(e)}")
        # You might want to implement fallback or caching here
        raise