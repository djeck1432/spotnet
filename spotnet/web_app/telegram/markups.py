"""
This module defines the inline keyboard markup used in the Telegram bot.

It includes the keyboard for launching the main web application.
"""

from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

from .config import WEBAPP_URL

launch_main_web_app_kb = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="Launch app", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
)
