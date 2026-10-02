from pydantic import BaseModel, Field
from decimal import Decimal


class AssetStatisticDetail(BaseModel):
    token_symbol: str = Field(..., description="Token symbol")
    total_amount: Decimal = Field(..., description="Total token amount across all user pools")
    price: Decimal = Field(..., description="Current token price")
    total_value: Decimal = Field(..., description="Total value (amount * price)")


class AssetStatisticResponse(BaseModel):
    token_symbol: str = Field(..., description="Token symbol")
    total_amount: str = Field(..., description="Total token amount across all user pools")
    price: str = Field(..., description="Current token price")
    total_value: str = Field(..., description="Total value (amount * price)")


class AdminDashboardResponse(BaseModel):
    total_users: int = Field(..., description="Total number of users")
    total_deposits: Decimal = Field(..., description="Total deposit amount")
    total_withdrawals: Decimal = Field(..., description="Total withdrawal amount")
