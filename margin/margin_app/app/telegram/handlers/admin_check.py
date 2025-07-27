"""Handler for the /admin_check Telegram command using AdminFilter."""

from aiogram import Router, types
from aiogram.filters import Command

from app.telegram.filters.admin_filter import AdminFilter

router = Router()
router.message.filter(AdminFilter())


@router.message(Command("admin_check"))
async def admin_check_handler(message: types.Message):
    """
    Responds with an admin verification message if user passes the AdminFilter.
    """
    await message.answer("✅ You are an admin!")
