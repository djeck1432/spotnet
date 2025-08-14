import aiohttp
from app.telegram.config import BotConfig

config = BotConfig()

async def get_assets_statistics():
    """
    Fetch assets statistics from the backend `/admin/statistic/assets` endpoint.
    """
    url = f"{config.API_BASE_URL}/admin/statistic/assets"
    headers = {
        "Accept": "application/json"
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as resp:
            if resp.status != 200:
                raise Exception(f"Backend returned status {resp.status}")
            return await resp.json()
