"""
Test script for the admin handler functionality.

This script demonstrates how to test the admin handler components
without running the full Telegram bot.
"""

import asyncio
import os
from unittest.mock import MagicMock

# Set up test environment
os.environ["TELEGRAM_ADMIN_IDS"] = "123456789,987654321"
os.environ["API_BASE_URL"] = "http://localhost:8000"

# Import the admin handler components
from web_app.telegram.handlers.admin import AdminFilter, get_asset_statistics


async def test_admin_filter():
    """Test the AdminFilter functionality."""
    print("Testing AdminFilter...")

    # Create admin filter
    admin_filter = AdminFilter()
    print(f"Admin IDs loaded: {admin_filter.admin_ids}")

    # Create mock message
    mock_message = MagicMock()
    mock_message.from_user.id = 123456789  # Admin ID

    # Test admin access
    is_admin = await admin_filter(mock_message)
    print(f"User 123456789 is admin: {is_admin}")

    # Test non-admin access
    mock_message.from_user.id = 999999999  # Non-admin ID
    is_admin = await admin_filter(mock_message)
    print(f"User 999999999 is admin: {is_admin}")


async def test_asset_statistics():
    """Test the asset statistics retrieval."""
    print("\nTesting asset statistics...")

    try:
        stats = await get_asset_statistics()
        print("Statistics retrieved successfully:")
        print(f"  Users: {stats.get('users', 0):,}")
        print(f"  Opened Positions: {stats.get('opened_positions', 0):,}")
        print(f"  Liquidated Positions: {stats.get('liquidated_positions', 0):,}")
        print(f"  Opened Orders: {stats.get('opened_orders', 0):,}")

        # Calculate metrics
        total_positions = stats.get("opened_positions", 0)
        liquidated_positions = stats.get("liquidated_positions", 0)
        liquidation_rate = (liquidated_positions / max(total_positions, 1)) * 100

        print(f"  Liquidation Rate: {liquidation_rate:.2f}%")

        # Health status
        if liquidation_rate < 10:
            health = "🟢 Healthy"
        elif liquidation_rate < 20:
            health = "🟡 Moderate"
        else:
            health = "🔴 High Risk"

        print(f"  Platform Health: {health}")

    except Exception as e:
        print(f"Error retrieving statistics: {e}")


async def test_markdown_formatting():
    """Test the markdown formatting for Telegram."""
    print("\nTesting Markdown formatting...")

    stats = await get_asset_statistics()

    # Format similar to the handler
    total_positions = stats.get("opened_positions", 0)
    liquidated_positions = stats.get("liquidated_positions", 0)
    total_orders = stats.get("opened_orders", 0)
    total_users = stats.get("users", 0)

    liquidation_rate = (liquidated_positions / max(total_positions, 1)) * 100
    avg_positions_per_user = total_positions / max(total_users, 1)

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
{"🟢 *Healthy*" if liquidation_rate < 10 else "🟡 *Moderate*" if liquidation_rate < 20 else "🔴 *High Risk*"}

_Last updated: Just now_
    """.strip()

    print("Formatted message:")
    print(response_text)


async def main():
    """Run all tests."""
    print("=" * 50)
    print("Admin Handler Test Suite")
    print("=" * 50)

    await test_admin_filter()
    await test_asset_statistics()
    await test_markdown_formatting()

    print("\n" + "=" * 50)
    print("Test completed successfully!")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
