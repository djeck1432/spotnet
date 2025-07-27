"""Start command handler for Telegram bot."""

from aiogram import Router
from aiogram.types import Message
from aiogram.filters import Command

router = Router()


@router.message(Command("start"))
async def start_handler(message: Message):
    """Send a welcome message when /start is received."""
    await message.answer("Hello! This is the Margin notification bot.")
