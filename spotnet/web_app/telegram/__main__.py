"""
This module serves as the entry point for the Telegram bot application.
It initializes the bot and starts polling for updates.
This module is made for testing purposes.
"""

from web_app.db.crud import DBConnector

from . import bot, dp

if __name__ == "__main__":
    # Start polling for updates with the bot and database connector
    dp.run_polling(bot, db=DBConnector())
