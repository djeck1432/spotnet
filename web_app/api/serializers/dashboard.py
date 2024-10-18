from decimal import Decimal
from typing import Dict, List, Optional, Any

from pydantic import BaseModel, RootModel, Field, validator

from web_app.contract_tools.constants import TokenParams


class Data(BaseModel):
    collateral: bool
    debt: bool


class TotalBalances(RootModel):
    # Since the keys are dynamic (addresses), we use a generic Dict
    root: Dict[str, str]


class Position(BaseModel):
    data: Data
    token_address: Optional[str] = Field(None, alias="tokenAddress")
    total_balances: TotalBalances = Field(alias="totalBalances")

    @validator("total_balances", pre=True)
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
        populate_by_name = True


class Product(BaseModel):
    name: str
    health_ratio: str
    positions: List[Position]


class ZkLendPositionResponse(BaseModel):
    products: List[Product]

    @validator("products", pre=True)
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
        populate_by_name = True


class DashboardResponse(BaseModel):
    balances: Dict[str, Any] = Field(..., example={"ETH": 5.0, "USDC": 1000.0}, description="The wallet balances for the user.")
    multipliers: Dict[str, float] = Field(..., example={"ETH": 1.5}, description="The multipliers applied to each asset.")
    start_dates: Dict[str, str] = Field(..., example={"ETH": "2024-01-01T00:00:00"}, description="The start date for each position.")
    zklend_position: Dict[str, Any] = Field(..., example={"ETH": {"borrowed": 5000, "collateral": 10}}, description="Details of the ZkLend position for each asset.")
