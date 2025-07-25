"""
This module contains mixins for admin-related contract interactions.
"""

import logging
from decimal import Decimal
from typing import Dict, Optional

from app.contract_tools.constants import AVNU_PRICE_URL, TokenParams
from app.contract_tools.api_client import BaseAPIClient

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
