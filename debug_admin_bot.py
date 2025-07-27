#!/usr/bin/env python3
"""
Debug version of admin bot - shows all activity and messages.
"""

import asyncio
import os
import httpx
import logging
from aiogram import Bot, Dispatcher, Router, types
from aiogram.enums import ParseMode
from aiogram.filters import BaseFilter, Command
from aiogram.types import Message
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up detailed logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create router for admin commands
router = Router()

class AdminFilter(BaseFilter):
    """Filter that checks if the user is an admin based on their Telegram ID."""

    def __init__(self):
        # Load admin IDs from environment variable
        admin_ids_str = os.getenv("TELEGRAM_ADMIN_IDS", "")
        print(f"🔑 Raw admin IDs from env: '{admin_ids_str}'")
        
        if admin_ids_str:
            try:
                self.admin_ids = [
                    int(id_str.strip())
                    for id_str in admin_ids_str.split(",")
                    if id_str.strip()
                ]
                print(f"✅ Parsed admin IDs: {self.admin_ids}")
            except ValueError as e:
                print(f"❌ Error parsing admin IDs: {e}")
                self.admin_ids = []
        else:
            self.admin_ids = []

    async def __call__(self, message: Message) -> bool:
        """Check if the user is in the list of configured admin IDs."""
        user_id = message.from_user.id
        is_admin = user_id in self.admin_ids
        print(f"🔍 Admin check: User {user_id} -> {'✅ ADMIN' if is_admin else '❌ NOT ADMIN'}")
        print(f"📋 Configured admins: {self.admin_ids}")
        return is_admin

# Create admin filter instance
admin_filter = AdminFilter()

# Message handler for ALL messages (for debugging)
@router.message()
async def handle_all_messages(message: types.Message):
    """Handle all messages for debugging."""
    user_id = message.from_user.id
    username = message.from_user.username or "No username"
    full_name = message.from_user.full_name or "No name"
    text = message.text or "No text"
    
    print(f"\n📨 MESSAGE RECEIVED:")
    print(f"   👤 User ID: {user_id}")
    print(f"   📛 Username: @{username}")
    print(f"   🏷️ Full Name: {full_name}")
    print(f"   💬 Text: '{text}'")
    print(f"   🔑 Is Admin: {'✅ YES' if user_id in admin_filter.admin_ids else '❌ NO'}")
    
    # Check if it's an admin command
    if text and text.startswith('/'):
        if user_id in admin_filter.admin_ids:
            print(f"   🎯 Processing admin command: {text}")
            await process_admin_command(message)
        else:
            print(f"   🚫 Blocked: Not an admin")
            await message.answer("❌ You don't have admin privileges for this bot.")
    else:
        print(f"   💭 Regular message, sending help")
        await message.answer("👋 Hi! I'm an admin bot. Admins can use /assets, /admin_help, /admin_status")

async def process_admin_command(message: types.Message):
    """Process admin commands."""
    text = message.text.lower()
    
    if text == '/assets':
        await assets_handler(message)
    elif text == '/admin_help':
        await admin_help_handler(message)
    elif text == '/admin_status':
        await admin_status_handler(message)
    elif text == '/start':
        await start_handler(message)
    else:
        await message.answer(f"❓ Unknown admin command: {text}\n\nTry: /assets, /admin_help, /admin_status")

async def start_handler(message: types.Message):
    """Handle /start command."""
    user_id = message.from_user.id
    is_admin = user_id in admin_filter.admin_ids
    
    if is_admin:
        response = f"""
🤖 *Admin Bot Started*

✅ Welcome admin! You have full access.

🎯 *Available Commands:*
/assets - 📊 View asset statistics
/admin_help - ❓ Show help  
/admin_status - 🔐 Check status

Your ID: `{user_id}`
        """.strip()
    else:
        response = f"""
🤖 *Bot Started*

❌ You don't have admin access.

Your ID: `{user_id}`
Contact admin to get access.
        """.strip()
    
    await message.answer(response, parse_mode=ParseMode.MARKDOWN)

async def get_asset_statistics():
    """Get asset statistics."""
    return {
        "users": 1250,
        "opened_positions": 342,
        "liquidated_positions": 28,
        "opened_orders": 156,
    }

async def assets_handler(message: types.Message):
    """Handle /assets command."""
    try:
        print("📊 Processing /assets command...")
        await message.bot.send_chat_action(chat_id=message.chat.id, action="typing")
        
        stats = await get_asset_statistics()
        
        # Calculate metrics
        total_positions = stats.get("opened_positions", 0)
        liquidated_positions = stats.get("liquidated_positions", 0)
        total_orders = stats.get("opened_orders", 0)
        total_users = stats.get("users", 0)
        
        liquidation_rate = (liquidated_positions / max(total_positions, 1)) * 100
        avg_positions_per_user = total_positions / max(total_users, 1)
        
        health_status = "🟢 *Healthy*" if liquidation_rate < 10 else "🟡 *Moderate*" if liquidation_rate < 20 else "🔴 *High Risk*"
        
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
        print("✅ /assets response sent successfully!")
        
    except Exception as e:
        print(f"❌ Error in assets_handler: {e}")
        await message.answer(f"❌ Error: {str(e)}")

async def admin_help_handler(message: types.Message):
    """Handle /admin_help command."""
    help_text = """
🔧 *Admin Commands*

/assets - 📊 View asset statistics dashboard
/admin_help - ❓ Show this help message  
/admin_status - 🔐 Check your admin status

🛡️ Admin access confirmed ✅
    """.strip()
    
    await message.answer(help_text, parse_mode=ParseMode.MARKDOWN)

async def admin_status_handler(message: types.Message):
    """Handle /admin_status command."""
    status_text = f"""
🔐 *Admin Status*

✅ *Access Confirmed*
You are authenticated as an administrator.

🆔 *Your ID:* `{message.from_user.id}`
👤 *Name:* {message.from_user.full_name}
    """.strip()
    
    await message.answer(status_text, parse_mode=ParseMode.MARKDOWN)

async def main():
    """Run the debug admin bot."""
    bot_token = os.getenv('TELEGRAM_TOKEN')
    admin_ids = os.getenv('TELEGRAM_ADMIN_IDS', '')
    
    print(f"🚀 DEBUG ADMIN BOT STARTING")
    print(f"🔑 Token: {bot_token[:20]}..." if bot_token else "❌ No token")
    print(f"👤 Admin IDs: {admin_ids}")
    print(f"📋 Parsed admins: {admin_filter.admin_ids}")
    
    if not bot_token:
        print("❌ No TELEGRAM_TOKEN found!")
        return
        
    bot = Bot(token=bot_token)
    dp = Dispatcher()
    dp.include_router(router)
    
    print("\n✅ DEBUG BOT RUNNING!")
    print("📝 This bot will log ALL messages and admin checks")
    print("💡 Send /start to test basic functionality")
    print("🎯 Send /assets to test admin commands")
    print("🛑 Press Ctrl+C to stop\n")
    
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Debug bot stopped") 