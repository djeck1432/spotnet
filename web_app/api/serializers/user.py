from pydantic import BaseModel, Field


class CheckUserResponse(BaseModel):
    is_contract_deployed: bool = Field(
        ..., example=False, description="Indicates if the user's contract is deployed."
    )


class UpdateUserContractResponse(BaseModel):
    is_contract_deployed: bool = Field(
        ..., example=False, description="Indicates if the user's contract is deployed."
    )


class GetUserContractAddressResponse(BaseModel):
    contract_address: str | None = Field(
        None,
        example="0xabc123...",
        description="The contract address of the user, or None if not deployed.",
    )
