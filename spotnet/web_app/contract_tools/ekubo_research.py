"""
Ekubo Flash Loan Research and Implementation Guide
================================================

This research document outlines how to implement flash loans on Ekubo AMM platform,
based on their documentation and implementation examples.

Key Concepts:
------------
1. Flash Accounting: Ekubo's internal token balance accounting system.
2. Free Flash Loans: No fees for borrowing within same transaction.
3. Atomic Execution: All operations must complete in single transaction.

Contract Reference:
------------------
https://docs.ekubo.org/integration-guides/reference/contract-addresses#immutable-contracts


Documentation: 
------------------
https://docs.ekubo.org/


Additional: 
------------------
https://github.com/EkuboProtocol/abis/blob/main/src/interfaces/router.cairo
https://mainnet-api.ekubo.org/openapi.json
https://petstore3.swagger.io/?url=https://mainnet-api.ekubo.org/openapi.json
https://petstore3.swagger.io/?url=https://mainnet-api.ekubo.org/openapi.json#/Swap/get_Na


Implementation Flow:
------------------
API Endpoints(https://mainnet-api.ekubo.org/openapi.json) and Data Structures
"""

from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
from decimal import Decimal
import httpx
from pydantic import BaseModel


@dataclass
class PoolKey:
    """Ekubo pool identification structure"""

    token0: str
    token1: str
    fee: int
    tick_spacing: int
    extension: str


@dataclass
class RouteNode:
    """Structure for defining swap path"""

    pool_key: PoolKey
    sqrt_ratio_limit: int
    skip_ahead: int


@dataclass
class TokenAmount:
    """Token amount with direction"""

    token: str
    amount: int
    is_positive: bool


class Split(BaseModel):
    """
    Represents a single split in a quote response.
    """

    specifiedAmount: str
    amount: str
    route: List[RouteNode]


class QuoteResponse(BaseModel):
    """
    Represents the response for a quote,
    containing details about the total result and individual splits.
    """

    total: str
    splits: List[Split]


class EkuboFlashLoan:
    """
    Main class for handling Ekubo Flash Loan operations

    Key Features:
    - No upfront fees required
    - Must repay within same transaction
    - Uses flash accounting for internal balance management
    """

    def __init__(self, router_contract: str):
        self.router_contract = router_contract
        self.api_url = "https://mainnet-api.ekubo.org"

    async def get_profitable_route(
        self, input_token: str, amount: int, min_profit_bps: int = 50
    ) -> Optional[Tuple[List[RouteNode], int]]:
        """
        Find profitable arbitrage route using Ekubo API

        Example API call:
        GET https://mainnet-api.ekubo.org/quote/{amount}/{input_token}/{input_token}

        Args:
        - input_token: Token address
        - amount: Amount in token decimals
        - min_profit_bps: Minimum profit required in basis points

        Returns:
            Tuple of (route, expected_output_amount) if profitable route found,
            None otherwise
        """

        try:
            async with httpx.AsyncClient() as client:
                # Get quote for potential arbitrage route
                response = await client.get(
                    f"{self.api_url}/quote/{amount}/{input_token}/{input_token}"
                )
                response.raise_for_status()

                quote_data = QuoteResponse.model_validate(response.json())
                return self._find_best_route(quote_data, amount, min_profit_bps)

        except (httpx.RequestError, ValueError) as e:
            print(f"Error getting quote: {e}")
            return None

    def _find_best_route(
        self, quote_data: QuoteResponse, input_amount: int, min_profit_bps: int
    ) -> Optional[Tuple[List[RouteNode], int]]:
        """
        Select most profitable route from quote response
        """
        best_profit = 0
        best_route = None
        best_output = 0

        for route_quote in quote_data.routes:
            output_amount = int(route_quote.amount)
            profit_bps = (output_amount - input_amount) * 10000 // input_amount

            # Consider price impact (converted from percentage to bps)
            price_impact_bps = int(Decimal(route_quote.priceImpact) * 100)
            effective_profit_bps = profit_bps - abs(price_impact_bps)

            if (
                effective_profit_bps > best_profit
                and effective_profit_bps >= min_profit_bps
            ):
                best_profit = effective_profit_bps
                best_route = [
                    self._parse_route_node(node) for node in route_quote.route
                ]
                best_output = output_amount

        if best_route:
            return best_route, best_output
        return None

    def _parse_route_node(self, node: Dict) -> RouteNode:
        """Parse single route node from API response"""
        return RouteNode(
            pool_key=PoolKey(
                token0=node["pool_key"]["token0"],
                token1=node["pool_key"]["token1"],
                fee=int(node["pool_key"]["fee"], 16),
                tick_spacing=node["pool_key"]["tick_spacing"],
                extension=node["pool_key"]["extension"],
            ),
            sqrt_ratio_limit=int(node["sqrt_ratio_limit"], 16),
            skip_ahead=int(node["skip_ahead"], 16),
        )

    def prepare_flash_loan_tx(
        self, route: List[RouteNode], token_amount: TokenAmount
    ) -> Dict:
        """
        Prepare transaction for flash loan arbitrage

        Transaction flow:
        1. Borrow tokens via flash accounting (no explicit borrow call needed)
        2. Execute swaps through provided route
        3. Verify profit
        4. Repay loan automatically from swap proceeds
        """
        return {
            "contract_address": self.router_contract,
            "entry_point_selector": "multihop_swap",
            "calldata": self._encode_multihop_swap(route, token_amount),
        }

    def _encode_multihop_swap(
        self, route: List[RouteNode], token_amount: TokenAmount
    ) -> List[int]:
        """Encode parameters for multihop_swap"""
        calldata = [len(route)]  # Route length

        # Encode route
        for node in route:
            calldata.extend(
                [
                    int(node.pool_key.token0, 16),
                    int(node.pool_key.token1, 16),
                    node.pool_key.fee,
                    node.pool_key.tick_spacing,
                    int(node.pool_key.extension, 16),
                    node.sqrt_ratio_limit,
                    node.skip_ahead,
                ]
            )

            # Encode amount
        calldata.extend([int(token_amount.token, 16), token_amount.amount])

        return calldata


# get_transaction_data rework
async def get_transaction_data(
    deposit_token: str,
    scaled_amount: int,
) -> Optional[dict]:
    """
    Modified version using flash loans

    Flow:
    1. Calculate profitable route
    2. Prepare flash loan transaction
    3. Return transaction data
    """
    # Initialize flash loan handler
    ekubo = EkuboFlashLoan(
        router_contract="0x0199741822c2dc722f6f605204f35e56dbc23bceed54818168c4c49e4fb8737e"
    )

    # Find profitable route
    route_result = await ekubo.get_profitable_route(
        input_token=deposit_token,
        amount=scaled_amount,
        min_profit_bps=50,  # Minimum 0.5% profit
    )

    if not route_result:
        return None

    route, _output_amount = route_result

    # Prepare borrow amount
    token_amount = TokenAmount(
        token=deposit_token, amount=scaled_amount, is_positive=True
    )

    return ekubo.prepare_flash_loan_tx(route, token_amount)
