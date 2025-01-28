This document provides instructions on how to set up and run the Telegram bot, as well as how to configure webhooks.

## Prerequisites

- A Telegram bot token (create a bot using [BotFather](https://core.telegram.org/bots#botfather))

## Setting Up the Environment

2. **Create a `.env` file in the root directory and add your environment variables:**
   ```env
   TELEGRAM_TOKEN=<your-telegram-bot-token>
   TELEGRAM_WEBAPP_URL=<your-webapp-url>
   REACT_APP_BOT_ID=<your-telegram-bot-id>
   ```
   Note: You can obtain the bot ID directly from your Telegram bot token in the format `bot_id:secret`.

## Running the Bot

To run the bot, execute the following command:
`bash
    python -m web_app.telegram
    `

## Setting Up Webhooks

To set the webhook for your Telegram bot, follow these steps:

1. Start your FastAPI application (make sure it's accessible from the internet).
2. Call the following endpoint to set the webhook:

   ```http
   GET /api/webhook/telegram
   ```

   This will set the webhook URL to the current request URL.

3. Ensure that your server is publicly accessible so that Telegram can send updates to your webhook.
   @@ -48,4 +52,4 @@ To set the webhook for your Telegram bot, follow these steps:

- Make sure your server is running and accessible to Telegram for the webhook to function correctly.
- You can test the bot by sending the `/start` command after setting up the webhook.

For any issues or further assistance, please refer to the documentation or contact support.
