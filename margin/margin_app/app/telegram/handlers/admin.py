from aiogram import Router
from aiogram.types import Message
from aiogram.filters import Command
from aiogram.enums import ParseMode

from app.telegram.filters.admin import AdminFilter
from app.services.assets_statistic import AssetsStatisticService

router = Router()


@router.message(Command("assets"), AdminFilter())
async def assets_command(message: Message):
    service = AssetsStatisticService()
    stats = await service.get_assets_statistic()

    if not stats:
        await message.answer("No assets data available.", parse_mode=ParseMode.MARKDOWN)
        return

    lines = ["*📊 Assets Statistic*"]
    for asset, data in stats.items():
        lines.append(f"\n*{asset}*")
        if isinstance(data, dict):
            for key, value in data.items():
                lines.append(f"  • `{key}`: `{value}`")
        else:
            lines.append(f"  • `{data}`")

    text = "\n".join(lines)
    await message.answer(text, parse_mode=ParseMode.MARKDOWN)
