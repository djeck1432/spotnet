"""
This module contains the alert mixin class.
"""

import asyncio
import logging
from web_app.telegram.notifications import send_health_ratio_notification
from web_app.contract_tools.mixins import HealthRatioMixin
from web_app.db.crud import UserDBConnector


logger = logging.getLogger(__name__)
ALERT_THRESHOLD = 3.2  # FIXME return to 1.1 after testing


class AlertMixin:
    """
    Mixin class for alert related methods.
    """

    @classmethod
    def check_users_health_ratio_level(cls) -> None:
        """
        Check the health ratio level for all users with an OPENED position.
        If a user's health ratio level is lower than 1.1, raise a `HealthRatioLevelLowException`.
        """

        users_data = UserDBConnector().get_users_for_notifications()
        user_number = len([user for user, _ in users_data])
        logger.info(f"Found number of users for notifications: {user_number}")
        for contract_address, telegram_id in users_data:
            health_ratio_level, _ = asyncio.run(
                HealthRatioMixin.get_health_ratio_and_tvl(contract_address)
            )

            if float(health_ratio_level) < ALERT_THRESHOLD:
                logger.info(
                    f"Health ratio level for user {contract_address} is {health_ratio_level}"
                )
                cls.send_notification(telegram_id, health_ratio_level)

    @staticmethod
    def send_notification(telegram_id: int, health_ratio: float):
        """
        Send notification to a user if they have allowed notifications.

        Args:
            telegram_id: ID of the r to notify
            health_ratio: Current health ratio of the user's position
        """
        asyncio.run(send_health_ratio_notification(telegram_id, health_ratio))
        logger.info(
            f"Notification sent to user {telegram_id} with health ratio {health_ratio}"
        )
