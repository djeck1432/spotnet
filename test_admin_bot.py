#!/usr/bin/env python3
"""
Simplified bot runner for testing admin handlers.
This runs just the admin functionality without database dependencies.
"""

import asyncio
import logging
import os
import sys
from unittest.mock import MagicMock

# Add the spotnet directory to Python path
spotnet_path = os.path.join(os.path.dirname(__file__), 'spotnet')
sys.path.insert(0, spotnet_path)

# Mock database modules to avoid connection issues
sys.modules['web_app.db'] = MagicMock()
sys.modules['web_app.db.models'] = MagicMock()
sys.modules['web_app.db.database'] = MagicMock()
sys.modules['web_app.db.crud'] = MagicMock()
sys.modules['web_app.db.crud.telegram'] = MagicMock()

from aiogram import Bot, Dispatcher
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    """Run the admin bot for testing."""
    
    # Get bot token from environment
    bot_token = os.getenv('TELEGRAM_TOKEN')
    if not bot_token:
        print("❌ TELEGRAM_TOKEN not found in environment variables!")
        print("Make sure your .env file contains TELEGRAM_TOKEN=your_bot_token")
        return
    
    admin_ids = os.getenv('TELEGRAM_ADMIN_IDS', '')
    if not admin_ids:
        print("❌ TELEGRAM_ADMIN_IDS not found in environment variables!")
        print("Make sure your .env file contains TELEGRAM_ADMIN_IDS=your_user_id")
        return
    
    print(f"🚀 Starting bot with admin IDs: {admin_ids}")
    print(f"🔑 Using token: {bot_token[:20]}...")
    
    # Create bot and dispatcher
    bot = Bot(token=bot_token)
    dp = Dispatcher()
    
    # Import and register only the admin router
    try:
        from web_app.telegram.handlers.admin import router as admin_router
        dp.include_router(admin_router)
        print("✅ Admin router loaded successfully!")
        
        print("\n🎯 Bot is running! Try these commands in Telegram:")
        print("📱 Send /assets to see the asset statistics dashboard")
        print("❓ Send /admin_help to see available admin commands")
        print("🔐 Send /admin_status to check your admin status")
        print("\n💡 Instructions:")
        print("1. Open Telegram")
        print("2. Find your bot")
        print("3. Send /assets command")
        print("4. Take a screenshot of the response!")
        print("\n🛑 Press Ctrl+C to stop the bot")
        
        # Start polling
        await dp.start_polling(bot)
        
    except ImportError as e:
        print(f"❌ Error importing admin router: {e}")
        print("🔍 Checking if admin handler file exists...")
        admin_file = os.path.join(spotnet_path, 'web_app', 'telegram', 'handlers', 'admin.py')
        if os.path.exists(admin_file):
            print(f"✅ Admin handler file found at: {admin_file}")
        else:
            print(f"❌ Admin handler file not found at: {admin_file}")
    except Exception as e:
        print(f"❌ Error starting bot: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped by user")
    except Exception as e:
        print(f"❌ Bot error: {e}") 