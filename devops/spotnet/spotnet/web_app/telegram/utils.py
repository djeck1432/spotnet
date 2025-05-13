"""
This module contains utility functions for the Telegram bot.

It includes functions for building response writers for webhook responses.
"""

import hashlib
import hmac
import json
import secrets
import time
from typing import Any, Dict, Generator

from aiogram import Bot
from aiogram.methods import TelegramMethod
from aiogram.methods.base import TelegramType
from aiogram.types import InputFile
from fastapi import Response
from fastapi.responses import StreamingResponse


def check_telegram_authorization(
    token: str, auth_data: dict, expired: int = None
) -> bool:
    """
    Verify the Telegram authorization data.

    Args:
        token (str): The bot's token used for verification.
        auth_data (dict): The authorization data received from Telegram,
                          including the hash and auth_date.

    Raises:
        Exception: If the data is not from Telegram or if it is outdated.

    Returns:
        dict: The verified authorization data.
    """
    check_hash = auth_data.get("hash")
    if not check_hash:
        return False
    data_check_arr = [
        f"{key}={value}" for key, value in auth_data.items() if key != "hash"
    ]
    data_check_arr.sort()
    data_check_string = "\n".join(data_check_arr)

    secret_key = hashlib.sha256(token.encode()).digest()
    hash_value = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if hash_value != check_hash:
        return False

    if expired and (int(time.time()) - auth_data["auth_date"]) > expired:
        return False

    return True


def generate_multipart_telegram_response(
    bot: Bot, result: TelegramMethod[TelegramType], boundary: str
) -> Generator[bytes, None, None]:
    """
    Generate a multipart/form-data response for Telegram webhook.

    Args:
        bot (Bot): The instance of the Bot to use for handled requests.
        result (TelegramMethod[TelegramType]): The result of a Telegram method call.
        boundary (str): Custom boundary for multipart data.

    Yields:
        bytes: Multipart form-data chunks
    """
    # Prepare a dictionary to store file attachments
    files: Dict[str, InputFile] = {}

    # Prepare method and its parameters
    method_data = result.model_dump(warnings=False)

    # Yield method part
    method_part = (
        f"--{boundary}\r\n"
        'Content-Disposition: form-data; name="method"\r\n'
        "Content-Type: text/plain; charset=utf-8\r\n\r\n"
        f"{result.__api_method__}\r\n"
    )
    yield method_part.encode("utf-8")

    # Process non-file parameters
    for key, value in method_data.items():
        # Prepare the value, converting it to a format suitable for sending
        prepared_value = bot.session.prepare_value(value, bot=bot, files=files)

        if prepared_value is not None:
            # Convert value to string for text parts
            if isinstance(prepared_value, (dict, list)):
                prepared_value = json.dumps(prepared_value)

            part = (
                f"--{boundary}\r\n"
                f'Content-Disposition: form-data; name="{key}"\r\n'
                "Content-Type: text/plain; charset=utf-8\r\n\r\n"
                f"{prepared_value}\r\n"
            )
            yield part.encode("utf-8")

    # Process file attachments
    for key, file in files.items():
        # Read file content
        file_content = file.read(bot)

        # Yield file part headers
        file_part_header = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="{key}"; filename="{file.filename}"\r\n'
            f"Content-Type: application/octet-stream\r\n\r\n"
        )
        yield file_part_header.encode("utf-8")

        # Yield file content
        yield file_content
        yield b"\r\n"

    # Final boundary
    yield f"--{boundary}--\r\n".encode("utf-8")


def build_multipart_response(bot: Bot, result: Any) -> Response:
    """
    Build a multipart response for Telegram webhook.
    """
    # if not result return empty response
    if not result or not isinstance(result, TelegramMethod):
        return Response(status_code=200)

    # generate boundary
    boundary = f"webhookBoundary{secrets.token_urlsafe(16)}"

    # return streaming response
    return StreamingResponse(
        generate_multipart_telegram_response(bot, result, boundary),
        media_type=f"multipart/form-data; boundary={boundary}",
        status_code=200,
    )
