"""
This module contains text messages used in the Telegram bot.

Currently, it includes the welcome message sent to users when they start the bot.
"""

# Welcome message to be sent to users when they start the bot
WELCOME_MESSAGE = (
    "Spotnet allows you to earn by using ETH collateral, "
    "borrowing USDC, and compounding the process. You can get started "
    "right away by clicking the button below to launch the web app! 🚀👇"
)

HEALTH_RATIO_WARNING_MESSAGE = (
    "⚠️ Warning: Your health ratio level is {health_ratio}. "
    "This is getting low - please add more deposit to avoid liquidation.\n\n"
    "Visit spotnet.xyz to manage your position."
)

NOTIFICATION_ALLOWED_MESSAGE = (
    "You have successfully allowed notifications! "
    "You will now receive updates and alerts regarding your account. "
    "Thank you for staying connected with us! 🎉"
)
