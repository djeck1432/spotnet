from typing import Dict

from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.api_request import APIRequest
from web_app.api.serializers.dashboard import ZkLendPositionResponse

CLIENT = StarknetClient()
# ARGENT_X_POSITION_URL = "https://cloud.argent-api.com/v1/tokens/defi/decomposition/{wallet_id}?chain=starknet"
ARGENT_X_POSITION_URL = "https://cloud.argent-api.com/v1/tokens/defi/"

# [ADDED] New constant for AVNU price endpoint
AVNU_PRICE_URL = "https://starknet.impulse.avnu.fi/v1/tokens/short"


class DashboardMixin:
    """
    Mixin class for dashboard related methods.
    """

    # [ADDED] New method to fetch current token prices
    @classmethod
    async def get_current_prices(cls) -> Dict[str, float]:
        """
        Fetch current token prices from AVNU API.
        
        Returns:
            Dict[str, float]: Dictionary mapping token symbols to their current prices
                            Example: {'ETH': 2000.0, 'USDC': 1.0}
        """
        try:
            response = await APIRequest(base_url=AVNU_PRICE_URL).fetch("")
            if not response:
                return {}

            prices = {}
            for token_data in response:
                address = token_data.get("address")
                current_price = token_data.get("currentPrice")
                
                if address and current_price is not None:
                    symbol = TokenParams.get_token_symbol(address)
                    if symbol:
                        prices[symbol] = float(current_price)

            return prices
        except Exception as e:
            print(f"Failed to fetch current prices: {e}")
            return {}

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
    async def get_zklend_position(cls, contract_address: str) -> ZkLendPositionResponse:
        """
        Get the zkLend position for the given wallet ID.
        :param contract_address: contract address
        :return: zkLend position validated by Pydantic models
        """
        modified_contract_address = contract_address[:2] + "0" + contract_address[2:]
        response = await APIRequest(base_url=ARGENT_X_POSITION_URL).fetch(
            f"decomposition/{modified_contract_address}", params={"chain": "starknet"}
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