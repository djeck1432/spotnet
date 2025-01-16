"""
This module contains the dashboard mixin class.
"""

import logging
from typing import Dict
from decimal import Decimal


from web_app.contract_tools.constants import TokenParams, MULTIPLIER_POWER
from web_app.contract_tools.api_request import APIRequest
from web_app.contract_tools.blockchain_call import CLIENT
from web_app.db.crud import position as position_db_connector
from web_app.db.models import Position

logger = logging.getLogger(__name__)


# example of ARGENT_X_POSITION_URL
# "https://cloud.argent-api.com/v1/tokens/defi/decomposition/{wallet_id}?chain=starknet"
ARGENT_X_POSITION_URL = "https://cloud.argent-api.com/v1/tokens/defi/"

# New constant for AVNU price endpoint
AVNU_PRICE_URL = "https://starknet.impulse.avnu.fi/v1/tokens/short"


class DashboardMixin:
    """
    Mixin class for dashboard related methods.
    """

    @classmethod
    async def get_current_prices(cls) -> Dict[str, Decimal]:
        """
        Fetch current token prices from AVNU API.
        :return: Returns dictionary mapping token symbols to their current prices as Decimal.
        """
        prices = {}
        try:
            response = await APIRequest(base_url=AVNU_PRICE_URL).fetch("")
            if not response:
                return prices

            for token_data in response:
                address = token_data.get("address")
                current_price = token_data.get("currentPrice")
                try:
                    if address and current_price is not None:
                        address_with_leading_zero = TokenParams.add_underlying_address(
                            address
                        )
                        symbol = TokenParams.get_token_symbol(address_with_leading_zero)
                        if symbol:
                            # Convert to Decimal for precise calculations
                            prices[symbol] = Decimal(str(current_price))
                except (AttributeError, TypeError, ValueError) as e:
                    logger.debug(f"Error parsing price for {address}: {str(e)}")

            return prices
        except Exception as e:
            logger.error(f"Error fetching current prices: {e}")
            return prices

    @classmethod
    async def get_wallet_balances(cls, holder_address: str) -> Dict[str, str]:
        """
        Get the wallet balances for the given holder address.
        :param holder_address: holder address
        :return: Returns the wallet balances for the given holder address.
        """
        wallet_balances = {}

        for token in TokenParams.tokens():
            try:
                balance = await CLIENT.get_balance(
                    token_addr=token.address,
                    holder_addr=holder_address,
                    decimals=token.decimals,
                )
                wallet_balances[token.name] = balance
            except Exception as e:  # handle if contract not found in wallet
                logger.info(
                    f"Failed to get balance for {token.address} due to an error: {e}"
                )

        return wallet_balances

    @classmethod
    def _calculate_sum(
        cls, price: Decimal, amount: Decimal, multiplier: Decimal
    ) -> Decimal:
        """
        Calculate the sum.
        :param price: Price
        :param amount: Token amount
        :param multiplier: Position multiplier
        :return: calculated sum
        """
        try:
            return (
                price * amount * multiplier * (Decimal(100) / Decimal(MULTIPLIER_POWER))
            )
        except (TypeError, ValueError) as e:
            logger.error(f"Error calculating sum: {e}")
            return Decimal(0)

    @staticmethod
    def get_current_position_sum(position: Position, current_prices: Dict[str, float]) -> Decimal:
        """
        Calculate total position value including extra deposits
        """
        # Base position amount
        total_amount = Decimal(position.amount)
        
        # Add extra deposits
        extra_deposits = position_db_connector.get_extra_deposits_data(position.id)
        for token, amount in extra_deposits.items():
            if token in current_prices:
                deposit_amount = Decimal(amount)
                if token != position.token_symbol:
                    # Convert to position token value
                    deposit_amount *= Decimal(current_prices[token])
                    deposit_amount /= Decimal(current_prices[position.token_symbol])
                total_amount += deposit_amount
        
        return total_amount

    @classmethod
    async def get_start_position_sum(
        cls, start_price: str, amount: str, multiplier: str
    ) -> Decimal:
        """
        Calculate the start position sum.
        :param start_price: Start price
        :param amount: Token amount
        :param multiplier: Multiplier
        :return: Decimal sum
        """
        return cls._calculate_sum(
            Decimal(start_price), Decimal(amount), Decimal(multiplier)
        )

    @classmethod
    async def get_position_balance(cls, amount: str, multiplier: str) -> Decimal:
        """
        Calculate the position balance.
        :param amount: Position amount
        :param multiplier: Position multiplier
        :return: Position balance
        """
        return (
            Decimal(amount)
            * Decimal(multiplier)
            * (Decimal(100) / Decimal(MULTIPLIER_POWER))
        )
