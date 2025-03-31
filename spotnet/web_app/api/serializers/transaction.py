"""
This module defines the serializers for the transaction data.
"""

from decimal import Decimal
from pydantic import BaseModel, field_validator


class PoolKey(BaseModel):
    """
    Pydantic model for the pool key.
    """

    token0: str
    token1: str
    fee: str
    tick_spacing: str
    extension: str

    @field_validator(
        "token0",
        "token1",
        "fee",
        "tick_spacing",
        "extension",
        mode="before",
    )
    def convert_int_to_str(cls, value) -> str:
        """
        Convert the integer values to strings.
        :param value: Value to convert
        :return: str
        """
        return str(value)


class DepositData(BaseModel):
    """
    Pydantic model for the deposit data.
    """

    token: str
    amount: str
    multiplier: Decimal
    borrow_portion_percent: int

    @field_validator("token", "amount", "multiplier", mode="before")
    def convert_int_to_str(cls, value: int) -> str:
        """
        Convert the integer values to strings.
        :param value: The integer value to convert
        :return: str
        """
        return str(value)


class LoopLiquidityData(BaseModel):
    """
    Pydantic model for the loop liquidity data.
    """

    pool_price: int  # Assuming this should remain an integer
    pool_key: PoolKey
    deposit_data: DepositData
    contract_address: str
    ekubo_limits: dict[str, str]
    position_id: str


class RepayTransactionDataResponse(BaseModel):
    """
    Pydantic model for the repay transaction data response.
    """

    supply_token: str
    debt_token: str
    pool_key: PoolKey
    supply_price: str
    debt_price: str
    contract_address: str
    ekubo_limits: dict[str, str]
    borrow_portion_percent: int
    position_id: str

    @field_validator("supply_price", "debt_price", mode="before")
    def convert_int_to_str(cls, value: int) -> str:
        """
        Convert the integer values to strings.
        :param value: The integer value to convert
        :return: str
        """
        return str(value)


class UpdateUserContractRequest(BaseModel):
    """
    Pydantic model for the update user contract request.
    """

    wallet_id: str
    contract_address: str



class WithdrawAllData(BaseModel):
    """
    Response model to withdraw all containing repay data and a list of token addresses
    """
    repay_data: RepayTransactionDataResponse
    tokens: list[str]
