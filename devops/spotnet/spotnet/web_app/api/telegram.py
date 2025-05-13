"""
Handles Telegram webhook integration for the web application.

Provides FastAPI endpoints for setting up webhooks and processing updates
using aiogram and a database connector.
"""

import os
from typing import Literal

from aiogram.types import Update
from aiogram.utils.deep_linking import create_start_link
from aiogram.utils.web_app import check_webapp_signature

from fastapi import APIRouter, HTTPException, Request

from web_app.api.serializers.telegram import TelegramUserAuth, TelegramUserCreate
from web_app.db.crud import DBConnector, TelegramUserDBConnector, UserDBConnector
from web_app.telegram import TELEGRAM_TOKEN, bot, dp, logger
from web_app.telegram.utils import (
    build_multipart_response,
    check_telegram_authorization,
)

# Create a FastAPI router for handling Telegram webhook requests
router = APIRouter()
db_connector = DBConnector()
user_db = UserDBConnector()
telegram_user_db_connector = TelegramUserDBConnector()


@router.get(
    "/api/generate-telegram-link",
    tags=["Telegram Operations"],
    summary="Generate a Telegram subscription link",
)
async def generate_telegram_link(wallet_id: str):
    """
    Generate a Telegram subscription link for a user by wallet ID.

    Args:
        wallet_id (str): The wallet ID of the user

    Returns:
        dict: Contains the generated subscription link
    """
    if not wallet_id:
        raise HTTPException(status_code=400, detail="Wallet ID is required")

    user = user_db.get_user_by_wallet_id(wallet_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    subscription_link = await create_start_link(bot, user.id, encode=True)
    return {"subscription_link": subscription_link}


@router.get(
    "/api/webhook/telegram",
    tags=["Telegram Operations"],
    summary="Setup telegram webhook",
)
async def set_telegram_webhook(request: Request) -> Literal["ok"]:
    """
    Set the webhook for the Telegram bot.

    This endpoint sets the webhook URL for the Telegram bot based on the request URL.

    Args:
        request (Request): The FastAPI request object.

    Returns:
        Literal["ok"]: A confirmation message indicating the webhook has been set.
    """
    host_url = os.getenv("HOST_URL", "https://spotnet.xyz/api/webhook/telegram")
    await bot.set_webhook(url=host_url)
    return "ok"


@router.post("/api/webhook/telegram", include_in_schema=False)
async def telegram_webhook(update: Update):
    """
    Handle incoming updates from Telegram.

    This endpoint processes updates sent to the webhook by Telegram.

    Args:
        update (Update): The update object received from Telegram.

    Returns:
        StreamingResponse: A streaming response containing the result of the update processing.
    """
    try:
        result = await dp.feed_webhook_update(bot, update, db=db_connector)
        return build_multipart_response(bot, result)
    except Exception as e:
        logger.error(f"Error processing Telegram update {update.update_id}: {e}")
        return b"", 200


@router.post(  # FIXME REMOVE IT (delete and frontend, not used)
    "/api/telegram/save-user",
    tags=["Telegram Operations"],
    summary="Save or update Telegram user information",
)
async def save_telegram_user(user: TelegramUserCreate):
    """
    Save or update Telegram user information in the database.

    Args:
        user (TelegramUserCreate): The user information to save or update.

    Returns:
        dict: A dictionary with a success message.
    """
    try:
        telegram_user_db_connector.save_or_update_user(user.model_dump())
        return {"message": "Telegram user saved successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error saving Telegram user: {str(e)}"
        )


@router.post(
    "/api/telegram/get-wallet-id/{telegram_id}",
    tags=["Telegram Operations"],
    summary="Get wallet ID for a Telegram user",
)
async def get_wallet_id(telegram_auth: TelegramUserAuth, telegram_id: str):
    """
    Retrieve the wallet ID associated with a Telegram user.

    Args:
        telegram_auth (TelegramUserAuth): Telegram authorization data or webapp init data.
        telegram_id (str): The Telegram user ID.

    Returns:
        dict: A dictionary containing the wallet ID or None if not found.
    """
    if telegram_auth.is_webapp:
        is_valid = check_webapp_signature(TELEGRAM_TOKEN, telegram_auth.raw)
    else:
        is_valid = check_telegram_authorization(TELEGRAM_TOKEN, telegram_auth.raw)

    if not is_valid:
        raise HTTPException(400, "Telegram auth data is invalid.")

    wallet_id = telegram_user_db_connector.get_wallet_id_by_telegram_id(telegram_id)
    return {"wallet_id": wallet_id}
