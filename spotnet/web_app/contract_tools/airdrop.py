"""
This module defines the contract tools for the airdrop data.
"""

from typing import List
from web_app.api.serializers.airdrop import AirdropItem, AirdropResponseModel
from web_app.contract_tools.api_request import APIRequest
from web_app.contract_tools.constants import TokenParams


class ZkLendAirdrop:
    """
    A class to fetch and validate airdrop data
    for a specified contract.
    """

    REWARD_API_ENDPOINT = "https://app.zklend.com/api/reward/all/"

    def __init__(self):
        """
        Initializes the ZkLendAirdrop class with an APIRequest instance.
        """
        self.api = APIRequest(base_url=self.REWARD_API_ENDPOINT)

    async def get_contract_airdrop(self, contract_id: str) -> AirdropResponseModel:
        """
        Fetches all available airdrops
        for a specific contract asynchronously.
        Args:
            contract_id (str): The ID of the contract
            for which to fetch airdrop data.
        Returns:
            AirdropResponseModel: A validated list of airdrop items
            for the specified contract.
        Raises:
            ValueError: If contract_id is None
        """
        if contract_id is None:
            raise ValueError("Contract ID cannot be None")

        underlying_contract_id = TokenParams.add_underlying_address(contract_id)
        response = await self.api.fetch(underlying_contract_id)
        return self._validate_response(response)

    @staticmethod
    def _validate_response(data: List[dict]) -> AirdropResponseModel:
        """
        Validates and formats the response data, keeping only necessary fields.
        Args:
            data (List[dict]): Raw response data from the API.
        Returns:
            AirdropResponseModel: Structured and validated airdrop data.
        """
        validated_items = []
        for item in data:
            validated_item = AirdropItem(
                amount=item["amount"],
                proof=item[
                    "proof"
                ],  # This is correct now as AirdropItem expects List[str]
                is_claimed=item["is_claimed"],
                recipient=item["recipient"],
            )
            validated_items.append(validated_item)
        return AirdropResponseModel(airdrops=validated_items)


if __name__ == "__main__":
    airdrop_fetcher = ZkLendAirdrop()
    result = airdrop_fetcher.get_contract_airdrop(
        "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0"
    )
    print(result)
