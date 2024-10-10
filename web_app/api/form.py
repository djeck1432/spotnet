from fastapi import APIRouter, Depends, Request

from web_app.api.serializers.transaction import (
    ApproveData,
    LoopLiquidityData,
    TransactionDataRequest,
    TransactionDataResponse,
)
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.mixins.deposit import DepositMixin

router = APIRouter()  # Initialize the router


@router.get("/transaction-data", response_model=TransactionDataResponse)
async def get_transaction_data(
    request: Request,
    transaction_data: TransactionDataRequest = Depends(),
) -> TransactionDataResponse:
    """
    Get transaction data for the deposit.
    :param request: Request object
    :param transaction_data: Pydantic model for the query parameters
    :return: List of dicts containing the transaction data
    """
    # Get the transaction data from the DepositMixin
    transaction_result = await DepositMixin.get_transaction_data(
        transaction_data.token,
        transaction_data.amount,
        transaction_data.multiplier,
        transaction_data.wallet_id,
        TokenParams.USDC.address,
    )

    # Pass the raw result to the models, they will handle the conversion
    approve_data = ApproveData(**transaction_result[0])
    loop_liquidity_data = LoopLiquidityData(**transaction_result[1])

    response = TransactionDataResponse(
        approve_data=approve_data, loop_liquidity_data=loop_liquidity_data
    )
    print("response", response.dict())
    return response.dict()
