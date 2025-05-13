"""
Tests for liquidation API endpoints.
"""

from decimal import Decimal
from uuid import UUID, uuid4

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.schemas.liquidation import LiquidationResponse


MARGIN_POSITION_URL = "api/margin"


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
    async def test_liquidate_position_success(self, client: TestClient, monkeypatch):
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

        request_data = {
            "margin_position_id": str(self.test_margin_position_id),
            "bonus_amount": str(self.test_bonus_amount),
            "bonus_token": self.test_bonus_token,
        }
        response = client.post(MARGIN_POSITION_URL + "/liquidate", json=request_data)
        assert response.status_code == status.HTTP_200_OK

        response_data = response.json()
        assert response_data["margin_position_id"] == str(self.test_margin_position_id)
        assert response_data["bonus_amount"] == str(self.test_bonus_amount)
        assert response_data["bonus_token"] == self.test_bonus_token
        assert response_data["status"] == "success"

    @pytest.mark.asyncio
    async def test_liquidate_position_failure(self, client, monkeypatch):
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

        request_data = {
            "margin_position_id": str(self.test_margin_position_id),
            "bonus_amount": str(self.test_bonus_amount),
            "bonus_token": self.test_bonus_token,
        }

        response = client.post(MARGIN_POSITION_URL + "/liquidate", json=request_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "detail" in response.json()
