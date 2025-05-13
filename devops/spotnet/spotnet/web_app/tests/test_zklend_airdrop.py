"""Test module for ZkLendAirdrop class"""

from unittest.mock import AsyncMock, Mock

import pytest

from web_app.api.serializers.airdrop import AirdropResponseModel
from web_app.contract_tools.airdrop import ZkLendAirdrop


@pytest.fixture
def mock_api_response() -> list:
    """Fixture providing mock API response data."""
    return [
        {
            "amount": "1000000000000000000",
            "proof": ["0xabcd", "0x1234"],
            "is_claimed": False,
            "recipient": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        }
    ]


@pytest.fixture
def zklend_airdrop():
    """Fixture providing a ZkLendAirdrop instance with mocked API."""
    instance = ZkLendAirdrop()
    instance.api = Mock()
    instance.api.fetch = AsyncMock()
    return instance


class TestZkLendAirdrop:
    """Test suite for ZkLendAirdrop class."""

    def test_init(self, zklend_airdrop):
        """Test ZkLendAirdrop initialization."""
        assert isinstance(zklend_airdrop, ZkLendAirdrop)
        assert (
            zklend_airdrop.REWARD_API_ENDPOINT
            == "https://app.zklend.com/api/reward/all/"
        )
        assert hasattr(zklend_airdrop, "api")

    @pytest.mark.asyncio
    async def test_get_contract_airdrop_success(
        self, zklend_airdrop, mock_api_response
    ):
        """Test successful retrieval of airdrop data."""

        contract_id = "0x123456"
        zklend_airdrop.api.fetch.return_value = mock_api_response

        result = await zklend_airdrop.get_contract_airdrop(contract_id)

        # Assert
        assert isinstance(result, AirdropResponseModel)
        assert len(result.airdrops) == 1
        airdrop = result.airdrops[0]
        assert airdrop.amount == "1000000000000000000"
        assert airdrop.proof == ["0xabcd", "0x1234"]
        assert airdrop.is_claimed is False
        assert airdrop.recipient == "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"

    @pytest.mark.asyncio
    async def test_get_contract_airdrop_empty_response(self, zklend_airdrop):
        """Test handling of empty API response."""

        contract_id = "0x123456"
        zklend_airdrop.api.fetch.return_value = []

        result = await zklend_airdrop.get_contract_airdrop(contract_id)

        # Assert
        assert isinstance(result, AirdropResponseModel)
        assert len(result.airdrops) == 0

    @pytest.mark.asyncio
    async def test_get_contract_airdrop_with_invalid_contract_id(self, zklend_airdrop):
        """Test handling of invalid contract IDs."""

        invalid_ids = ["", "0x"]
        zklend_airdrop.api.fetch.return_value = []

        for invalid_id in invalid_ids:
            result = await zklend_airdrop.get_contract_airdrop(invalid_id)
            assert isinstance(result, AirdropResponseModel)
            assert len(result.airdrops) == 0

    @pytest.mark.asyncio
    async def test_get_contract_airdrop_none_contract_id(self, zklend_airdrop):
        """Test handling of None contract ID."""
        with pytest.raises(ValueError):
            await zklend_airdrop.get_contract_airdrop(None)

    def test_validate_response(self, zklend_airdrop, mock_api_response):
        """Test response validation."""

        result = zklend_airdrop._validate_response(mock_api_response)

        assert isinstance(result, AirdropResponseModel)
        assert len(result.airdrops) == 1
        airdrop = result.airdrops[0]
        assert isinstance(airdrop.proof, list)
        assert airdrop.proof == ["0xabcd", "0x1234"]

    def test_validate_response_empty(self, zklend_airdrop):
        """Test validation of empty response."""

        result = zklend_airdrop._validate_response([])

        assert isinstance(result, AirdropResponseModel)
        assert len(result.airdrops) == 0

    def test_validate_response_missing_fields(self, zklend_airdrop):
        """Test validation with missing required fields."""

        invalid_data = [{"amount": "1000"}]

        with pytest.raises(KeyError):
            zklend_airdrop._validate_response(invalid_data)

    @pytest.mark.asyncio
    async def test_underlying_contract_id_formatting(self, zklend_airdrop):
        """Test correct formatting of underlying contract ID."""

        contract_id = "0x123456"
        expected_underlying_id = "0x0123456"
        zklend_airdrop.api.fetch.return_value = []

        await zklend_airdrop.get_contract_airdrop(contract_id)

        zklend_airdrop.api.fetch.assert_called_once_with(expected_underlying_id)
