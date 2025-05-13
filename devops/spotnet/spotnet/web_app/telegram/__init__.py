"""
This module initializes the Telegram bot and sets up the dispatcher for handling updates.

It imports necessary components from the aiogram library and configures logging.
"""

from aiogram import Bot, Dispatcher
import logging

from .config import TELEGRAM_TOKEN
from .handlers import cmd_router

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the Telegram bot (None for the ability to run without a bot token)
bot: Bot = None
if TELEGRAM_TOKEN:
    # Create a Bot instance using the provided token
    bot = Bot(TELEGRAM_TOKEN)
else:
    logger.warning(
        "Telegram token is not set. Telegram bot functionality will be limited."
    )

# Create a Dispatcher for handling updates
dp = Dispatcher()
# Include command routers for handling specific commands
dp.include_routers(cmd_router)
