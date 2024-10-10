from typing import Dict

from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.api_request import APIRequest
from web_app.api.serializers.dashboard import ZkLendPositionResponse

CLIENT = StarknetClient()
# ARGENT_X_POSITION_URL = "https://cloud.argent-api.com/v1/tokens/defi/decomposition/{wallet_id}?chain=starknet"
ARGENT_X_POSITION_URL = "https://cloud.argent-api.com/v1/tokens/defi/"


class DashboardMixin:
    """
    Mixin class for dashboard related methods.
    """

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
                print(f"Failed to get balance for {token.address} due to an error: {e}")

        return wallet_balances

    @classmethod
    async def get_zklend_position(cls, wallet_id: str) -> ZkLendPositionResponse:
        """
        Get the zkLend position for the given wallet ID.
        :param wallet_id: Wallet ID
        :return: zkLend position validated by Pydantic models
        """
        # FIXME - This is a dummy wallet ID. Replace it with the actual wallet ID.
        response = await APIRequest(base_url=ARGENT_X_POSITION_URL).fetch(
            f"decomposition/{wallet_id}", params={"chain": "starknet"}
        )

        if not response:
            return ZkLendPositionResponse(products=[])

        # Validate the response using Pydantic models
        dapps = response.get("dapps", [])
        products = cls._get_products(dapps)
        zk_lend_position_response = ZkLendPositionResponse(products=products)

        return zk_lend_position_response

    @classmethod
    def _get_products(cls, dapps: list) -> list[dict]:
        """
        Get the products from the dapps.
        :param dapps: List of dapps
        :return: List of positions
        """
        return [product for dapp in dapps for product in dapp.get("products", [])]
