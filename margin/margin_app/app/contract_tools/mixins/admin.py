"""
This module contains mixins for admin-related contract interactions.
"""

import logging
from decimal import Decimal
from typing import Dict, List, Optional

from app.contract_tools.constants import AVNU_PRICE_URL, TokenParams
from app.contract_tools.api_client import BaseAPIClient
from app.crud.pool import user_pool_crud

logger = logging.getLogger(__name__)


class AdminMixin:
    """A mixin class containing admin-related contract interaction methods."""

    @classmethod
    async def get_current_prices(
        cls, api_client: Optional[BaseAPIClient] = None
    ) -> Dict[str, Decimal]:
        """
        Fetch current token prices from AVNU API.

        This method is designed to be testable by allowing an API client
        to be injected. If no client is provided, it creates its own.

        :param api_client: An instance of BaseAPIClient for making API calls.
                           If None, a new instance will be created.
        :return: Returns dictionary mapping token symbols to their current prices as Decimal.
        """
        prices = {}
        
        if api_client is None:
            api_client = BaseAPIClient(base_url=AVNU_PRICE_URL)

        response_data = await api_client.get("")

        if not response_data:
            logger.warning("Received no data from AVNU price API.")
            return prices

        if not isinstance(response_data, list):
            logger.error(
                "Unexpected data format from AVNU API. Expected list, got %s.",
                type(response_data)
            )
            return prices

        for token_data in response_data:
            address = token_data.get("address")
            current_price = token_data.get("currentPrice")

            if not (address and current_price is not None):
                logger.debug("Skipping token data due to missing address or price: %s", token_data)
                continue

            try:
                address_with_leading_zero = TokenParams.add_underlying_address(address)
                symbol = TokenParams.get_token_symbol(address_with_leading_zero)

                if symbol:
                    prices[symbol] = Decimal(str(current_price))
            except (AttributeError, TypeError, ValueError) as e:
                logger.debug("Error parsing price for address %s: %s", address, e)

        return prices

    @classmethod
    async def get_asset_statistics(
        cls, api_client: Optional[BaseAPIClient] = None
    ) -> List[Dict[str, Decimal]]:
        """
        Calculate asset statistics by summing token amounts across all user_pools 
        and multiplying them by their current prices.

        This method retrieves all user pools, groups them by token,
        sums the amounts, and calculates the total value using current prices.

        :param api_client: An instance of BaseAPIClient for making API calls.
                           If None, a new instance will be created.
        :return: List of dictionaries containing token statistics with total_amount and total_value.
        :raises Exception: If there's an error retrieving data or calculating statistics.
        """
        logger.info("Starting asset statistics calculation")
        
        try:
            # Get all user pools with their associated pool information
            user_pools = await user_pool_crud.get_all_objects()
            logger.debug(f"Retrieved {len(user_pools)} user pool entries")
            
            if not user_pools:
                logger.warning("No user pools found")
                return []

            # Get current token prices
            current_prices = await cls.get_current_prices(api_client)
            logger.debug(f"Retrieved prices for {len(current_prices)} tokens")

            # Group user pools by token and sum amounts
            token_statistics = {}
            
            for user_pool in user_pools:
                token = user_pool.pool.token
                amount = user_pool.amount
                
                if token not in token_statistics:
                    token_statistics[token] = {
                        'token': token,
                        'total_amount': Decimal('0'),
                        'total_value': Decimal('0')
                    }
                
                token_statistics[token]['total_amount'] += amount
                
                # Calculate value using current price
                if token in current_prices:
                    token_value = amount * current_prices[token]
                    token_statistics[token]['total_value'] += token_value
                    logger.debug(f"Token {token}: amount={amount}, price={current_prices[token]}, value={token_value}")
                else:
                    logger.warning(f"No price data available for token: {token}")

            result = list(token_statistics.values())
            logger.info(f"Calculated statistics for {len(result)} tokens")
            
            return result

        except Exception as e:
            logger.error(f"Error calculating asset statistics: {str(e)}")
            raise Exception(f"Failed to calculate asset statistics: {str(e)}") from e
