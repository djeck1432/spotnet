"""Handlers package for Telegram bot."""

from .start import router as start_router
from .admin_check import router as admin_check_router

__all__ = [
    "start_router",
    "admin_check_router",
]
