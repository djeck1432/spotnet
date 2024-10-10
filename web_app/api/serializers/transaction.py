from pydantic import BaseModel, Field, validator


class ApproveData(BaseModel):
    """
    Pydantic model for the approve data.
    """

    to_address: str = Field(
        ..., description="Address of the recipient in string format"
    )
    spender: str = Field(..., description="Spender address in string format")
    amount: str = Field(..., description="Amount of tokens to approve as a string")

    @validator("to_address", "spender", "amount", pre=True, always=True)
    def convert_int_to_str(cls, value: int) -> str:
        """
        Convert the integer values to strings.
        :param value: value to convert
        :return: str
        """
        return str(value)


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

    @validator("caller", pre=True, always=True)
    def convert_caller_to_str(cls, value: int) -> str:
        """
        Convert the caller address to a string.
        :param value: Caller address as an integer
        :return: str
        """
        return str(value)


class TransactionDataResponse(BaseModel):
    """
    Pydantic model for the transaction data response.
    """

    approve_data: ApproveData
    loop_liquidity_data: LoopLiquidityData


class TransactionDataRequest(BaseModel):
    """
    Pydantic model for the transaction data request.
    """

    wallet_id: str = Field(..., description="Wallet ID for the transaction")
    token: str = Field(..., description="Token name for the transaction")
    multiplier: int = Field(..., description="Multiplier for the transaction")
    amount: str = Field(..., description="Amount to deposit as a string")


class UpdateUserContractRequest(BaseModel):
    wallet_id: str
    transaction_hash: str
