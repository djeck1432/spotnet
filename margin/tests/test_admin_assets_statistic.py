import pytest
from decimal import Decimal
from unittest.mock import MagicMock, AsyncMock, patch
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from margin_app.app.api.admin import get_assets_statistic
from margin_app.app.services.assets.stats import AssetsStatsService


@pytest.mark.asyncio
async def test_get_assets_statistic_success(async_session: AsyncSession):
    """Test that assets statistic returns correct data when user_pools exist."""
    # Mock the database result
    mock_row = MagicMock()
    mock_row.token_symbol = "ETH"
    mock_row.total_amount = Decimal("10.5")

    mock_result = MagicMock()
    mock_result.fetchall.return_value = [mock_row]

    with patch.object(async_session, "execute", new_callable=AsyncMock) as mock_execute:
        mock_execute.return_value = mock_result

        with patch(
            "margin_app.app.services.assets.stats.AssetsStatsService._get_price_service"
        ) as mock_price_service:
            mock_price_svc = MagicMock()
            mock_price_svc.get_price = AsyncMock(return_value=Decimal("3500.00"))
            mock_price_service.return_value = mock_price_svc

            service = AssetsStatsService(async_session)
            result = await service.get_assets_statistic()

            assert len(result) == 1
            assert result[0]["token_symbol"] == "ETH"
            assert result[0]["total_amount"] == "10.5"
            assert result[0]["price"] == "3500.00"
            assert result[0]["total_value"] == "36750.000"


@pytest.mark.asyncio
async def test_get_assets_statistic_empty(async_session: AsyncSession):
    """Test that assets statistic returns empty list when no user_pools exist."""
    mock_result = MagicMock()
    mock_result.fetchall.return_value = []

    with patch.object(async_session, "execute", new_callable=AsyncMock) as mock_execute:
        mock_execute.return_value = mock_result

        service = AssetsStatsService(async_session)
        result = await service.get_assets_statistic()

        assert result == []


@pytest.mark.asyncio
async def test_get_assets_statistic_multiple_tokens(async_session: AsyncSession):
    """Test statistic with multiple tokens."""
    mock_rows = [
        MagicMock(token_symbol="ETH", total_amount=Decimal("5.0")),
        MagicMock(token_symbol="USDC", total_amount=Decimal("1000.0")),
    ]
    mock_result = MagicMock()
    mock_result.fetchall.return_value = mock_rows

    with patch.object(async_session, "execute", new_callable=AsyncMock) as mock_execute:
        mock_execute.return_value = mock_result

        with patch(
            "margin_app.app.services.assets.stats.AssetsStatsService._get_price_service"
        ) as mock_price_service:
            mock_price_svc = MagicMock()
            mock_price_svc.get_price = AsyncMock(side_effect=[
                Decimal("3500.00"),
                Decimal("1.00"),
            ])
            mock_price_service.return_value = mock_price_svc

            service = AssetsStatsService(async_session)
            result = await service.get_assets_statistic()

            assert len(result) == 2
            assert result[0]["token_symbol"] == "ETH"
            assert result[1]["token_symbol"] == "USDC"
            assert result[1]["total_value"] == "1000.000"


@pytest.mark.asyncio
async def test_get_assets_statistic_missing_price(async_session: AsyncSession):
    """Test statistic when price is not found for a token."""
    mock_row = MagicMock()
    mock_row.token_symbol = "UNKNOWN"
    mock_row.total_amount = Decimal("1.0")

    mock_result = MagicMock()
    mock_result.fetchall.return_value = [mock_row]

    with patch.object(async_session, "execute", new_callable=AsyncMock) as mock_execute:
        mock_execute.return_value = mock_result

        with patch(
            "margin_app.app.services.assets.stats.AssetsStatsService._get_price_service"
        ) as mock_price_service:
            mock_price_svc = MagicMock()
            mock_price_svc.get_price = AsyncMock(return_value=None)
            mock_price_service.return_value = mock_price_svc

            service = AssetsStatsService(async_session)
            result = await service.get_assets_statistic()

            assert len(result) == 1
            assert result[0]["token_symbol"] == "UNKNOWN"
            assert result[0]["price"] == "0"
            assert result[0]["total_value"] == "0.0"


@pytest.mark.asyncio
async def test_get_assets_statistic_zero_amount(async_session: AsyncSession):
    """Test statistic when total amount is zero (NULL sum)."""
    mock_row = MagicMock()
    mock_row.token_symbol = "BTC"
    mock_row.total_amount = None

    mock_result = MagicMock()
    mock_result.fetchall.return_value = [mock_row]

    with patch.object(async_session, "execute", new_callable=AsyncMock) as mock_execute:
        mock_execute.return_value = mock_result

        with patch(
            "margin_app.app.services.assets.stats.AssetsStatsService._get_price_service"
        ) as mock_price_service:
            mock_price_svc = MagicMock()
            mock_price_svc.get_price = AsyncMock(return_value=Decimal("50000.00"))
            mock_price_service.return_value = mock_price_svc

            service = AssetsStatsService(async_session)
            result = await service.get_assets_statistic()

            assert len(result) == 1
            assert result[0]["total_amount"] == "0"
            assert result[0]["total_value"] == "0.0000"
