"""
The module contains tests for `app/api/liquidation.py`
"""

from decimal import Decimal
from uuid import UUID, uuid4

import pytest
from app.api.liquidation import liquidate_position
from app.schemas.liquidation import LiquidationResponse
from fastapi import HTTPException, status


class MockLiquidationEntry:
    """
    A mock liquidation entry.
    """

    def __init__(
        self, margin_position_id: UUID, bonus_amount: Decimal, bonus_token: str
    ):
        self.margin_position_id = margin_position_id
        self.bonus_amount = bonus_amount
        self.bonus_token = bonus_token


class TestLiquidation:
    """
    Test cases for the liquidation endpoint.
    """

    @pytest.fixture(autouse=True)
    def setup_test_data(self):
        """
        Setup test data.
        :return: None
        """
        self.test_margin_position_id = uuid4()
        self.test_bonus_amount = Decimal("1.2345")
        self.test_bonus_token = "USDC"

    @pytest.mark.asyncio
    async def test_liquidate_position_success(self, monkeypatch):
        """
        Test a successful liquidation endpoint.
        :param monkeypatch: pytest fixture.
        :return: None
        """
        mock_entry = MockLiquidationEntry(
            margin_position_id=self.test_margin_position_id,
            bonus_amount=self.test_bonus_amount,
            bonus_token=self.test_bonus_token,
        )

        async def mock_liquidate_position(
            margin_position_id: UUID, bonus_amount: Decimal, bonus_token: str
        ):
            """
            Mock liquidate position.
            :param margin_position_id: Margin position id.
            :param bonus_amount: Bonus amount.
            :param bonus_token: Bonus token.
            :return: None
            """
            assert margin_position_id == self.test_margin_position_id
            assert bonus_amount == self.test_bonus_amount
            assert bonus_token == self.test_bonus_token

            return mock_entry

        monkeypatch.setattr(
            "app.crud.liquidation.liquidation_crud.liquidate_position",
            mock_liquidate_position,
        )

        response = await liquidate_position(
            self.test_margin_position_id, self.test_bonus_amount, self.test_bonus_token
        )

        assert isinstance(response, LiquidationResponse)
        assert response.margin_position_id == self.test_margin_position_id
        assert response.bonus_amount == self.test_bonus_amount
        assert response.bonus_token == self.test_bonus_token

    @pytest.mark.asyncio
    async def test_liquidate_position_failure(self, monkeypatch):
        """
        Test the liquidation endpoint when the operation fails.
        :param monkeypatch: pytest fixture.
        :return: None
        """
        error_message = "Liquidation failed due to insufficient collateral"

        async def mock_liquidate_position(
            margin_position_id: UUID, bonus_amount: Decimal, bonus_token: str
        ):
            """
            Mock liquidate position.
            :param margin_position_id: Margin position id.
            :param bonus_amount: Bonus amount.
            :param bonus_token: Bonus token.
            :return: None
            """
            raise Exception(error_message)

        monkeypatch.setattr(
            "app.crud.liquidation.liquidation_crud.liquidate_position",
            mock_liquidate_position,
        )

        with pytest.raises(HTTPException) as exc_info:
            await liquidate_position(
                self.test_margin_position_id,
                self.test_bonus_amount,
                self.test_bonus_token,
            )

        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert error_message in exc_info.value.detail
