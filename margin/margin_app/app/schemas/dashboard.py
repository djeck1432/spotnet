"""
This file contains the Pydantic schema for the statistic.
"""

from pydantic import BaseModel


class StatisticResponse(BaseModel):
    """
    Response model for getting total amount of:
    users, opened positions, liquidated positions, opened orders
    """

    users: int
    opened_positions: int
    liquidated_positions: int
    opened_orders: int


class Asset(BaseModel):
    """
    Model representing an asset with its symbol, amount, and value.
    """
    symbol: str
    amount: float
    value: float


class AssetsResponse(BaseModel):
    """Response model for assets information."""
    total: float
    assets: list[Asset]