"""
This module contains the deposit mixin class.
"""

from decimal import Decimal
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.blockchain_call import CLIENT


# alternative ARGENT_X_POSITION_URL
# "https://cloud.argent-api.com/v1/tokens/defi/decomposition/{wallet_id}?chain=starknet"
ARGENT_X_POSITION_URL = "https://cloud.argent-api.com/v1/tokens/defi/"


class DepositMixin:
    """
    Mixin class for deposit related methods.
    """

    @classmethod
    async def get_transaction_data(
        cls,
        deposit_token: str,
        amount: str,
        multiplier: Decimal,
        wallet_id: str,
        borrowing_token: str,
        ekubo_contract: "Contract",
    ) -> dict:
        """
        Get transaction data for the deposit.
        :param deposit_token: Deposit token
        :param amount: Amount to deposit
        :param multiplier: Multiplier
        :param wallet_id: Wallet ID
        :param borrowing_token: Borrowing token
        :param ekubo_contract: Contract instance
        :return: approve_data and loop_liquidity_data
        """
        deposit_token_address = TokenParams.get_token_address(deposit_token)
        decimal = TokenParams.get_token_decimals(deposit_token_address)
        amount = int(Decimal(amount) * 10**decimal)

        loop_liquidity_data = await CLIENT.get_loop_liquidity_data(
            deposit_token_address,
            amount,
            multiplier,
            wallet_id,
            borrowing_token,
            ekubo_contract,
        )

        return loop_liquidity_data

    @classmethod
    async def get_repay_data(
        cls, supply_token: str, ekubo_contract: "Contract"
    ) -> dict:
        """
        Get transaction data for the repay.
        :param supply_token: Deposit token
        :param ekubo_contract: Contract instance
        :return: dict with repay data
        """
        deposit_token_address = TokenParams.get_token_address(supply_token)
        debt_token_address = (
            TokenParams.USDC.address
            if supply_token != TokenParams.USDC.name
            else TokenParams.ETH.address
        )
        repay_data = {
            "supply_token": deposit_token_address,
            "debt_token": debt_token_address,
        }

        return repay_data | await CLIENT.get_repay_data(
            deposit_token_address, debt_token_address, ekubo_contract
        )
