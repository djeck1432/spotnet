"""Tests for LiquidationCRUD class operations."""

from datetime import date, datetime, timedelta
import random
from itertools import groupby
from decimal import Decimal
import pytest
import asyncio

from sqlalchemy import delete
from app.crud.liquidation import LiquidationCRUD
from app.models.liquidation import Liquidation
from app.crud.margin_position import MarginPositionCRUD
import pytest_asyncio
from app.crud.user import UserCRUD
from app.models.margin_position import MarginPosition
from app.models.user import User
from app.tests.conftest import fake


@pytest_asyncio.fixture
async def user_crud():
    """Create instance of UserCRUD"""
    return UserCRUD(User)


@pytest_asyncio.fixture
async def margin_position_crud():
    """Create instance of MarginPositionCRUD"""
    return MarginPositionCRUD(MarginPosition)


@pytest_asyncio.fixture
async def liquidation_crud():
    """Create instance of LiquidationCRUD"""
    return LiquidationCRUD(Liquidation)


@pytest_asyncio.fixture
async def opened_margin_pos(user_crud, margin_position_crud) -> MarginPosition:
    """Create and save instance of MarginPosition together with related user"""
    user = await user_crud.create_user(fake.md5())
    return await margin_position_crud.open_margin_position(
        user_id=user.id,
        borrowed_amount=Decimal(fake.random_int(10, 100)),
        multiplier=fake.random_int(10, 20),
        transaction_id=fake.credit_card_number(),
    )


@pytest.mark.asyncio
async def test_create_liquidation_success(opened_margin_pos, liquidation_crud):
    """Test successfully creating a liquidation."""
    liquidation = await liquidation_crud.liquidate_position(
        margin_position_id=opened_margin_pos.id,
        bonus_amount=Decimal(fake.random_int(10, 10000)),
        bonus_token=fake.md5(),
    )
    assert liquidation is not None


@pytest.mark.asyncio
async def test_get_totals_for_date(
    opened_margin_pos: MarginPosition, liquidation_crud: LiquidationCRUD
):
    """
    Test successfully retrieving liquidation totals within provided date.
    - Cleans up Liquidation table to ensure test run in isolated environment.
    - Creates set of test records which expected to be returned in result set.
    - Uses itertools.groupby to calculate total amount for each token in created records
    and asserts it matches amount sum got from result set for corresponding token
    """

    def get_max_delta_within_day():
        """
        Returns timedelta with maximum amount of hours required
        to avoid exceeding current date
        """
        return timedelta(hours=fake.random_int(0, 23 - datetime.now().hour))

    async with liquidation_crud.session() as session:
        await session.execute(delete(Liquidation))
        await session.commit()

    tokens = [fake.cryptocurrency_code() for _ in range(3)]
    expected_liquidation_coros = [
        liquidation_crud.write_to_db(
            Liquidation(
                bonus_token=random.choice(tokens),
                bonus_amount=Decimal(fake.random_int(100, 10000)),
                margin_position_id=opened_margin_pos.id,
                created_at=datetime.now() - get_max_delta_within_day(),
            )
        )
        for _ in range(10)
    ]
    # create liquidation which should not be in result set.
    # Presence shouldn't be checked explicitly, because if it presented - sums wont match
    await liquidation_crud.write_to_db(
        Liquidation(
            bonus_token=fake.cryptocurrency_code(),
            bonus_amount=Decimal(fake.random_int(100, 10000)),
            margin_position_id=opened_margin_pos.id,
            created_at=datetime.now() - timedelta(days=1),
        )
    )
    expected_liquidations = await asyncio.gather(*expected_liquidation_coros)
    # sort because groupby requires sorted collection
    expected_liquidations.sort(key=lambda liquidation: liquidation.bonus_token)

    rows = await liquidation_crud.get_totals_for_date(date.today())
    for expected_token, group in groupby(
        expected_liquidations, lambda liquidation: liquidation.bonus_token
    ):
        # find row with corresponding token and compare amounts sum
        for token, total_amount in rows:
            if token == expected_token:
                print("MATCHING", token)
                assert total_amount == sum(
                    [liquidation.bonus_amount for liquidation in group], Decimal(0)
                )
                break
