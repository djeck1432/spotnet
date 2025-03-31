"""
This module contains Celery tasks for the application.

It imports the logging module to facilitate logging operations and the
Celery app instance from the `celery_config` module.

Tasks:
- test_task: A simple test task that logs a confirmation message.
"""

import asyncio
import logging
import time

from web_app.contract_tools.mixins.alert import AlertMixin
from web_app.tasks.claim_airdrops import AirdropClaimer

from .celery_config import app

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


@app.task(name="check_users_health_ratio")
def check_users_health_ratio() -> None:
    """
    Background task to check health ratio levels for users with opened positions.

    :return: None
    """
    try:
        alert_mixin = AlertMixin()
        alert_mixin.check_users_health_ratio_level()
    except Exception as e:
        logger.error(f"Error in check_users_health_ratio task: {e}")


@app.task(name="claim_airdrop_task")
def claim_airdrop_task() -> None:
    """
    Background task to claim user airdrops.

    :return: None
    """
    try:
        logger.info("Running claim_airdrop_task.")
        logger.info("Task started at: ", time.strftime("%a, %d %b %Y %H:%M:%S"))
        airdrop_claimer = AirdropClaimer()
        asyncio.run(airdrop_claimer.claim_airdrops())
        logger.info("Task started at: ", time.strftime("%a, %d %b %Y %H:%M:%S"))
    except Exception as e:
        logger.error(f"Error in claiming airdrop task: {e}")
