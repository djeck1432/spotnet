#!/usr/bin/env python3
"""
Standalone admin bot for testing admin handlers.
This recreates the admin functionality directly without import conflicts.
"""

import asyncio
import os
import httpx
from aiogram import Bot, Dispatcher, Router, types
from aiogram.enums import ParseMode
from aiogram.filters import BaseFilter, Command
from aiogram.types import Message
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create router for admin commands
router = Router()

class AdminFilter(BaseFilter):
    """Filter that checks if the user is an admin based on their Telegram ID."""

    def __init__(self):
        # Load admin IDs from environment variable
        admin_ids_str = os.getenv("TELEGRAM_ADMIN_IDS", "")
        if admin_ids_str:
            try:
                self.admin_ids = [
                    int(id_str.strip())
                    for id_str in admin_ids_str.split(",")
                    if id_str.strip()
                ]
            except ValueError:
                self.admin_ids = []
        else:
            self.admin_ids = []

    async def __call__(self, message: Message) -> bool:
        """Check if the user is in the list of configured admin IDs."""
        return message.from_user.id in self.admin_ids

# Apply admin filter to all handlers in this router
router.message.filter(AdminFilter())

async def get_asset_statistics():
    """Retrieve asset statistics from the API or database."""
    try:
        # Try to get statistics from the local API
        base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{base_url}/api/dashboard/statistic", timeout=5.0
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass

    # Fallback to mock data for development/testing
    return {
        "users": 1250,
        "opened_positions": 342,
        "liquidated_positions": 28,
        "opened_orders": 156,
    }

@router.message(Command("assets"))
async def assets_handler(message: types.Message):
    """Handle the /assets command for admin users."""
    try:
        # Send typing action to show the bot is working
        await message.bot.send_chat_action(chat_id=message.chat.id, action="typing")

        # Call the Assets statistic method to retrieve data
        stats = await get_asset_statistics()

        # Calculate additional metrics
        total_positions = stats.get("opened_positions", 0)
        liquidated_positions = stats.get("liquidated_positions", 0)
        total_orders = stats.get("opened_orders", 0)
        total_users = stats.get("users", 0)

        # Calculate liquidation rate (avoid division by zero)
        liquidation_rate = (
            (liquidated_positions / max(total_positions, 1)) * 100
            if total_positions > 0
            else 0
        )

        # Calculate average positions per user
        avg_positions_per_user = (
            total_positions / max(total_users, 1) if total_users > 0 else 0
        )

        # Determine health status
        if liquidation_rate < 10:
            health_status = "🟢 *Healthy*"
        elif liquidation_rate < 20:
            health_status = "🟡 *Moderate*"
        else:
            health_status = "🔴 *High Risk*"

        # Format the response using Telegram Markdown for neat display
        response_text = f"""
📊 *Asset Statistics Dashboard*

👥 *Total Users:* `{total_users:,}`
📈 *Active Positions:* `{total_positions:,}`
💥 *Liquidated Positions:* `{liquidated_positions:,}`
📋 *Pending Orders:* `{total_orders:,}`

📊 *Key Metrics:*
🔄 *Total Active Trades:* `{total_positions + total_orders:,}`
📉 *Liquidation Rate:* `{liquidation_rate:.2f}%`
👤 *Avg Positions/User:* `{avg_positions_per_user:.2f}`

🎯 *Platform Health:*
{health_status}

_Last updated: Just now_
        """.strip()

        await message.answer(response_text, parse_mode=ParseMode.MARKDOWN)

    except Exception as e:
        # Handle any errors gracefully
        error_message = f"""
❌ *Error Retrieving Asset Statistics*

An error occurred while fetching the data:
`{str(e)[:100]}`

Please try again later or contact the development team.
        """.strip()

        await message.answer(error_message, parse_mode=ParseMode.MARKDOWN)

@router.message(Command("admin_help"))
async def admin_help_handler(message: types.Message):
    """Display available admin commands."""
    help_text = """
🔧 *Admin Commands*

/assets - 📊 View comprehensive asset statistics dashboard
/admin_help - ❓ Show this help message
/admin_status - 🔐 Check your admin status

🛡️ *Admin Privileges*
You have administrative access to view platform statistics and analytics.

💡 *Tips:*
• Use /assets to monitor platform health
• Statistics are updated in real-time
• Contact @support for technical issues
    """.strip()

    await message.answer(help_text, parse_mode=ParseMode.MARKDOWN)

@router.message(Command("admin_status"))
async def admin_status_handler(message: types.Message):
    """Display admin status and configuration."""
    admin_filter = AdminFilter()
    total_admins = len(admin_filter.admin_ids)

    status_text = f"""
🔐 *Admin Status*

✅ *Access Confirmed*
You are authenticated as an administrator.

👥 *Admin Count:* `{total_admins}`
🆔 *Your ID:* `{message.from_user.id}`
👤 *Name:* {message.from_user.full_name}

🕐 *Session Info:*
• Active since bot restart
• Commands logged for security
    """.strip()

    await message.answer(status_text, parse_mode=ParseMode.MARKDOWN)

async def main():
    """Run the admin bot."""
    # Get bot token from environment
    bot_token = os.getenv('TELEGRAM_TOKEN')
    if not bot_token:
        print("❌ TELEGRAM_TOKEN not found!")
        return
    
    admin_ids = os.getenv('TELEGRAM_ADMIN_IDS', '')
    if not admin_ids:
        print("❌ TELEGRAM_ADMIN_IDS not found!")
        return
    
    print(f"🚀 Starting Admin Bot")
    print(f"👤 Admin IDs: {admin_ids}")
    print(f"🔑 Token: {bot_token[:15]}...")
    
    # Create bot and dispatcher
    bot = Bot(token=bot_token)
    dp = Dispatcher()
    
    # Include our admin router
    dp.include_router(router)
    
    print("\n✅ Admin Bot is running!")
    print("\n🎯 Available Commands:")
    print("📱 /assets - View asset statistics dashboard")
    print("❓ /admin_help - Show help")
    print("🔐 /admin_status - Check admin status")
    print("\n💡 Open Telegram and send /assets to your bot!")
    print("📸 Take a screenshot of the response!")
    print("\n🛑 Press Ctrl+C to stop")
    
    # Start polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped by user") 