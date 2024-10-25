"""
This module defines the serializers for the user data.
"""

from pydantic import BaseModel, Field


class CheckUserResponse(BaseModel):
    """
    Pydantic model for the check user response.
    """

    is_contract_deployed: bool = Field(
        ..., example=False, description="Indicates if the user's contract is deployed."
    )


class UpdateUserContractResponse(BaseModel):
    """
    Pydantic model for the update user contract response.
    """

    is_contract_deployed: bool = Field(
        ..., example=False, description="Indicates if the user's contract is deployed."
    )


class GetUserContractAddressResponse(BaseModel):
    """
    Pydantic model for the get user contract address response.
    """

    contract_address: str | None = Field(
        None,
        example="0xabc123...",
        description="The contract address of the user, or None if not deployed.",
    )


class GetStats(BaseModel):
    """
    Pydantic model for the get_stats API response.
    """

    users_amounts: dict[str, float] = Field(
        ...,
        example={"user1": 1000.0, "user2": 1500.5},
        description="A dictionary where the key is the user ID and the value is the total amount for that user.",
    )
    unique_users: int = Field(
        ..., example=2, description="The number of unique users with open positions."
    )
