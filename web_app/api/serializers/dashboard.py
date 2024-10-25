"""
This module defines the serializers for the dashboard data.
"""

from datetime import datetime
from decimal import Decimal
from typing import Dict, List, Optional, Any

from pydantic import BaseModel, Field, RootModel, field_validator
from web_app.contract_tools.constants import TokenParams


class Data(BaseModel):
    """
    Data class for position details.
    """

    collateral: bool
    debt: bool


class TotalBalances(RootModel):
    """
    TotalBalances class for total balances.
    """

    # Since the keys are dynamic (addresses), we use a generic Dict
    root: Dict[str, str]


class Position(BaseModel):
    """
    Position class for position details.
    """

    data: Data
    token_address: Optional[str] = Field(None, alias="tokenAddress")
    total_balances: TotalBalances = Field(alias="totalBalances")

    @field_validator("total_balances", mode="before")
    def convert_total_balances(cls, balances):
        """
        Convert total_balances to their decimal values based on token decimals.
        """
        converted_balances = {}
        for token_address, balance in balances.items():
            try:
                # Fetch the token decimals from TokenParams
                decimals = TokenParams.get_token_decimals(token_address)
                # Convert the balance using the decimals
                converted_balances[token_address] = str(
                    Decimal(balance) / Decimal(10**decimals)
                )
            except ValueError as e:
                raise ValueError(f"Error in balance conversion: {str(e)}")
        return converted_balances

    class Config:
        """
        Configuration for the Position class.
        """

        populate_by_name = True


class Product(BaseModel):
    """
    Product class for product details.
    """

    name: str
    health_ratio: str
    positions: List[Position]


class ZkLendPositionResponse(BaseModel):
    """
    ZkLendPositionResponse class for ZkLend position details.
    """

    products: List[Product] = Field(default_factory=list)

    @field_validator("products", mode="before")
    def convert_products(cls, products):
        """
        Convert products to their respective models.
        """
        converted_products = []
        for product in products:
            groups = product.pop("groups", None)
            product["health_ratio"] = groups.get("1", {}).get("healthRatio")
            converted_products.append(Product(**product))
            # For debugging purposes  # noqa: F841 (unused variable)
        return converted_products

    class Config:
        """
        Configuration for the ZkLendPositionResponse class.
        """

        populate_by_name = True


class DashboardResponse(BaseModel):
    """
    DashboardResponse class for dashboard details.
    """

    balances: Dict[str, Any] = Field(
        ...,
        example={"ETH": 5.0, "USDC": 1000.0},
        description="The wallet balances for the user.",
    )
    multipliers: Dict[str, int | None] = Field(
        ..., example={"ETH": 1.5}, description="The multipliers applied to each asset."
    )
    start_dates: Dict[str, datetime | None] = Field(
        ...,
        example={"ETH": "2024-01-01T00:00:00"},
        description="The start date for each position.",
    )
    zklend_position: ZkLendPositionResponse = Field(
        ...,
        example={"ETH": {"borrowed": 5000, "collateral": 10}},
        description="Details of the ZkLend position for each asset.",
    )
