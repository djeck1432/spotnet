"""Main entry point for the Telegram bot service."""

import asyncio
from aiogram import Bot, Dispatcher
from .config import BotConfig
from .handlers import start_router


async def main():
    """Initialize and run the Telegram bot."""
    config = BotConfig()
    bot = Bot(token=config.BOT_API_KEY)
    dp = Dispatcher()
    dp.include_router(start_router)
    print("Telegram bot is running...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
