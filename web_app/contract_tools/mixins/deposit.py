from decimal import Decimal
from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.contract_tools.constants import SPOTNET_CORE_ADDRESS, TokenParams

CLIENT = StarknetClient()
# ARGENT_X_POSITION_URL = "https://cloud.argent-api.com/v1/tokens/defi/decomposition/{wallet_id}?chain=starknet"
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
        multiplier: int,
        wallet_id: str,
        borrowing_token: str,
    ) -> list[dict, dict]:
        """
        Get transaction data for the deposit.
        :param deposit_token: Deposit token
        :param amount: Amount to deposit
        :param multiplier: Multiplier
        :param wallet_id: Wallet ID
        :param borrowing_token: Borrowing token
        :return: approve_data and loop_liquidity_data
        """
        deposit_token_address = TokenParams.get_token_address(deposit_token)
        amount = int(Decimal(amount) * Decimal(10 ** 18))
        approve_data = {
            "to_address": int(deposit_token_address, 16),
            "spender": int(SPOTNET_CORE_ADDRESS, 16),
            "amount": amount,
        }
        loop_liquidity_data = await CLIENT.get_loop_liquidity_data(
            deposit_token_address, amount, multiplier, wallet_id, borrowing_token
        )
        return [approve_data, loop_liquidity_data]