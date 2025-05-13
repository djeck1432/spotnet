"""
This module defines the serializers for the user data.
"""

from datetime import datetime
from decimal import Decimal

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


class GetStatsResponse(BaseModel):
    """
    Pydantic model for the get_stats response.
    """

    total_opened_amount: Decimal = Field(
        default=None,
        example="1000.0",
        description="Total amount for all open positions across all users.",
    )
    unique_users: int = Field(
        default=0,
        example=5,
        description="Number of unique users in the database.",
    )


class PositionHistoryItem(BaseModel):
    """
    Represents a single user position in the trading history.

    ### Attributes:
    - **status** (str): The current status of the position (e.g., "OPENED", "CLOSED", "LIQUIDATED").
    - **created_at** (datetime): The timestamp when the position was created.
    - **start_price** (float): The price of the asset when the position was opened.
    - **amount** (str): The quantity of the asset involved in the position.
    - **multiplier** (int): The leverage multiplier applied to the position.
    """

    status: str
    created_at: datetime
    start_price: float
    amount: str
    multiplier: int


class UserHistoryResponse(BaseModel):
    """
    Represents the response containing the history of positions for a user.

    ### Attributes:
    - **positions** (List[PositionHistoryItem]): A list of positions that include details such as:
        - `status`: The status of the position.
        - `created_at`: When the position was created.
        - `start_price`: The initial price of the asset.
        - `amount`: The quantity of the asset involved.
        - `multiplier`: The leverage multiplier applied to the position.
    """

    positions: list[PositionHistoryItem]


class SubscribeToNotificationRequest(BaseModel):
    """
    Pydantic model for the notification subscription request.
    """

    telegram_id: str | None = Field(
        None, example="123456789", description="Telegram ID of the user"
    )
    wallet_id: str = Field(..., example="0xabc123", description="Wallet ID of the user")


class BugReportRequest(BaseModel):
    """
    Pydantic model for bug report request.
    """

    wallet_id: str = Field(
        ..., pattern=r"^0x[a-fA-F0-9]+$", description="User's wallet ID"
    )
    telegram_id: str | None = Field(
        None, pattern=r"^\d+$", description="User's Telegram ID"
    )
    bug_description: str = Field(
        ..., min_length=1, description="Description of the bug"
    )


class BugReportResponse(BaseModel):
    """
    Pydantic model for bug report response.
    """

    message: str = Field(..., example="Bug report submitted successfully")
