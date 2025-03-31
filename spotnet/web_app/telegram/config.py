"""
This module loads environment variables and retrieves configuration settings for the Telegram bot.

It specifically retrieves the Telegram bot token and web app URL from environment variables.
"""

from os import getenv

from dotenv import load_dotenv

load_dotenv()

# Retrieve the Telegram bot token from environment variables
TELEGRAM_TOKEN = getenv("TELEGRAM_TOKEN")
WEBAPP_URL = getenv("TELEGRAM_WEBAPP_URL", "https://spotnet.xyz")
