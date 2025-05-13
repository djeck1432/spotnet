"""
This module handles command-related functionality for the Telegram bot.

It defines the command router and the behavior for the /start command.
"""

from aiogram import Router
from aiogram.filters import CommandStart, CommandObject
from aiogram.types import Message

from web_app.db.models import User
from ..markups import launch_main_web_app_kb
from ..texts import WELCOME_MESSAGE, NOTIFICATION_ALLOWED_MESSAGE
from web_app.db.crud.telegram import TelegramUserDBConnector
from web_app.db.crud import DBConnector

# Create a router for handling commands
cmd_router = Router()

telegram_db = TelegramUserDBConnector()
db_connector = DBConnector()


@cmd_router.message(CommandStart(deep_link=True, deep_link_encoded=True))
async def notification_allowed(message: Message, command: CommandObject):
    """
    Handle the /start command with user id parameter.

    Args:
        message (Message): The incoming message containing the command.
        command (CommandObject): The command object containing the user id.
    """
    user_id = command.args
    user = db_connector.get_object(User, user_id)
    telegram_db.update_telegram_user(
        str(message.from_user.id), dict(wallet_id=user.wallet_id)
    )
    telegram_db.set_allow_notification(str(message.from_user.id), user.wallet_id)

    return await message.answer(
        NOTIFICATION_ALLOWED_MESSAGE, reply_markup=launch_main_web_app_kb
    )


@cmd_router.message(CommandStart())
async def start_cmd(message: Message):
    """
    Handle the /start command.

    Args:
        message (Message): The incoming message containing the command.

    Returns:
        None: Sends a welcome message with a button to launch the web app.
    """
    return message.answer(WELCOME_MESSAGE, reply_markup=launch_main_web_app_kb)
