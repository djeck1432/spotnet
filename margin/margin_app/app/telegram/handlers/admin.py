""" Inside, add a handler called /assets. Use the Admin Filter from this issue to verify the user is an admin. Then, call the Assets statistic method from this issue to retrieve the data. Format the response using Telegram Markdown so it displays neatly.""""
from aiogram import Router, types
from aiogram.filters import Command
from aiogram.utils.formatting import Bold, Code, as_list, as_marked_section

from app.telegram.filters.admin_filter import AdminFilter
from app.telegram.api.admin import get_assets_statistics

router = Router()
router.message.filter(AdminFilter())

@router.message(Command("assets"))
async def assets_handler(message: types.Message):
    """
    Responds with the assets statistics if the user is an admin.
    """
    try:
        stats = await get_assets_statistics()
        breakdown = []
        for asset in stats["assets"]:
            breakdown.append(
                f"{asset['token']}: {asset['amount']} units (${asset['value']:,})"
            )

        text = as_list(
            Bold("Asset Statistics"),
            Bold(f"Total Value: ${stats['total_value']:,}"),
            as_marked_section(
                Bold("Breakdown by Token:"),
                *breakdown,
                marker="•"
            )
        )

        await message.answer(**text.as_kwargs())
       
    except Exception as e:
        error_text = as_list(
            Bold("Failed to fetch asset statistics"),
            Code(str(e))
        )
        await message.answer(**error_text.as_kwargs())


