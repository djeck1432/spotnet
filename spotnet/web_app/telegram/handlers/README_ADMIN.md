# Admin Handler Documentation

## Overview

The admin handler provides administrative commands for the Telegram bot, specifically designed to give authorized users access to asset statistics and platform monitoring capabilities.

## Features

### Commands Available

1. **`/assets`** - View comprehensive asset statistics dashboard

   - Total users count
   - Active positions
   - Liquidated positions
   - Pending orders
   - Key metrics (liquidation rate, average positions per user)
   - Platform health status

2. **`/admin_help`** - Display available admin commands and usage tips

3. **`/admin_status`** - Show admin authentication status and configuration

## Setup Instructions

### 1. Environment Configuration

Add the following environment variable to your `.env` file:

```bash
# Comma-separated list of Telegram user IDs that have admin access
TELEGRAM_ADMIN_IDS=123456789,987654321

# Optional: API base URL for statistics (defaults to localhost:8000)
API_BASE_URL=http://localhost:8000
```

### 2. Admin Filter

The admin handler uses an `AdminFilter` that:

- Loads admin IDs from the `TELEGRAM_ADMIN_IDS` environment variable
- Validates user permissions before executing admin commands
- Provides secure access control

### 3. Statistics Integration

The handler attempts to fetch statistics from:

1. **Primary**: Local API endpoint (`/api/dashboard/statistic`)
2. **Fallback**: Mock data for development/testing

## Usage Examples

### Setting Up Admin Users

1. Get your Telegram user ID (you can use @userinfobot)
2. Add your ID to the environment variable:
   ```bash
   TELEGRAM_ADMIN_IDS=123456789
   ```
3. Restart the bot
4. Test with `/admin_status` command

### Viewing Asset Statistics

Send `/assets` command to get a formatted dashboard:

```
Asset Statistics Dashboard

Total Users: 1,250
Active Positions: 342
Liquidated Positions: 28
Pending Orders: 156

Key Metrics:
Total Active Trades: 498
Liquidation Rate: 8.19%
Avg Positions/User: 0.27

Platform Health:
Healthy

Last updated: Just now
```

## Security Features

- **Access Control**: Only users with IDs in `TELEGRAM_ADMIN_IDS` can execute admin commands
- **Error Handling**: Graceful error messages without exposing sensitive information
- **Logging**: All admin command usage is logged for security auditing
- **Timeout Protection**: API calls have timeouts to prevent hanging

## Platform Health Indicators

The system provides automatic health assessment:

- **Healthy**: Liquidation rate < 10%
- **Moderate**: Liquidation rate 10-20%
- **High Risk**: Liquidation rate > 20%

## Troubleshooting

### Common Issues

1. **"Not authorized" error**

   - Verify your Telegram ID is in `TELEGRAM_ADMIN_IDS`
   - Check environment variable format (comma-separated, no spaces)
   - Restart the bot after configuration changes

2. **Statistics not loading**

   - Check if the API service is running
   - Verify `API_BASE_URL` is correct
   - Review application logs for errors

3. **Commands not responding**
   - Ensure the admin router is properly included in the dispatcher
   - Check bot token and permissions
   - Verify the handler is registered correctly

### Development Mode

For development, the handler will use mock data if the API is unavailable:

```python
{
    "users": 1250,
    "opened_positions": 342,
    "liquidated_positions": 28,
    "opened_orders": 156
}
```

## Integration Notes

- The handler is designed to work with the existing Spotnet architecture
- Uses aiogram 3.x framework patterns
- Follows the project's coding standards and error handling practices
- Compatible with the existing telegram bot infrastructure

## Future Enhancements

Potential additions for future versions:

- Real-time statistics updates
- Historical data visualization
- Export functionality
- Advanced filtering options
- Alert system for critical metrics
