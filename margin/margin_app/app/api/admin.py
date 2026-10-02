from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from margin_app.app.api.deps import get_current_admin, get_session
from margin_app.app.services.assets.stats import AssetsStatsService
from margin_app.app.schemas.admin import (
    AssetStatisticResponse,
    AssetStatisticDetail,
)

router = APIRouter()


@router.get(
    "/statistic/assets",
    response_model=list[AssetStatisticResponse],
    summary="Get assets statistic",
    description="Returns asset statistics summed across all user_pools with current prices",
)
async def get_assets_statistic(
    session: AsyncSession = Depends(get_session),
    _current_admin=Depends(get_current_admin),
) -> list[AssetStatisticResponse]:
    service = AssetsStatsService(session)
    return await service.get_assets_statistic()
