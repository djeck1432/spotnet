"""
This module provides functionalities to send telegram notifications
"""

import asyncio
from decimal import Decimal

from aiogram.exceptions import TelegramRetryAfter
from web_app.db.crud import TelegramUserDBConnector
from web_app.telegram import bot, logger

from .texts import HEALTH_RATIO_WARNING_MESSAGE

telegram_db = TelegramUserDBConnector()

DEFAULT_RETRY_AFTER = 10
DEFAULT_RETRY_COUNT = 1


async def send_health_ratio_notification(
    telegram_id: str, health_ratio: Decimal, retry_count: int = DEFAULT_RETRY_COUNT
) -> None:
    """
    Send notification about health ratio to user
    """
    try:
        await bot.send_message(
            chat_id=telegram_id,
            text=HEALTH_RATIO_WARNING_MESSAGE.format(health_ratio=health_ratio),
        )
    except TelegramRetryAfter as e:
        if retry_count < 1:
            return logger.error(f"Failed to send notification to {telegram_id}: {e}")

        retry_after = DEFAULT_RETRY_AFTER
        if e.retry_after and 0 < e.retry_after:
            retry_after = e.retry_after

        await asyncio.sleep(retry_after)
        await send_health_ratio_notification(
            telegram_id, health_ratio, retry_count=retry_count - 1
        )
    except Exception as e:
        logger.error(f"Failed to send notification to {telegram_id}: {e}")
