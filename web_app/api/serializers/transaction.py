from pydantic import BaseModel, validator


class PoolKey(BaseModel):
    """
    Pydantic model for the pool key.
    """

    token0: str
    token1: str
    fee: str
    tick_spacing: str
    extension: str

    @validator(
        "token0", "token1", "fee", "tick_spacing", "extension", pre=True, always=True
    )
    def convert_int_to_str(cls, value) -> str:
        """
        Convert the integer values to strings.
        :param value: Value to convert
        :return: str
        """
        return str(value)


class DepositData(BaseModel):
    token: str
    amount: str
    multiplier: str

    @validator("token", "amount", "multiplier", pre=True, always=True)
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

    caller: str
    pool_price: int  # Assuming this should remain an integer
    pool_key: PoolKey
    deposit_data: DepositData
    contract_address: str
    position_id: str

    @validator("caller", pre=True, always=True)
    def convert_caller_to_str(cls, value: int) -> str:
        """
        Convert the caller address to a string.
        :param value: Caller address as an integer
        :return: str
        """
        return str(value)


class RepayTransactionDataResponse(BaseModel):
    """
    Pydantic model for the repay transaction data response.
    """

    supply_token: str
    debt_token: str
    pool_key: PoolKey
    supply_price: int
    debt_price: int
    contract_address: str
    position_id: str


class UpdateUserContractRequest(BaseModel):
    """
    Pydantic model for the update user contract request.
    """

    wallet_id: str
    contract_address: str


class DeploymentStatus(BaseModel):
    is_contract_deployed: bool


class ContractAddress(BaseModel):
    contract_address: str | None
