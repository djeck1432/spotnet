"""
Tests for the AirdropClaimer class, covering comprehensive airdrop claim operations.

Fixtures:
- airdrop_claimer: Fixture creating a mock AirdropClaimer instance for consistent testing
- mock_airdrop: Fixture generating a standard mock airdrop object for reusable test scenarios

Test Cases:
- test_claim_airdrops_successful: Validates successful airdrop claim workflow
- test_claim_airdrops_no_unclaimed: Checks behavior when no unclaimed airdrops exist
- test_claim_airdrops_partial_failure: Tests mixed success and failure scenarios
- test_claim_airdrops_database_error: Verifies database error handling
- test_claim_airdrop_timeout_error: Ensures proper handling of request timeout errors
- test_claim_airdrop_invalid_proof: Checks processing of invalid proof data
- test_claim_airdrop_unexpected_error: Validates unexpected error management
"""

import logging
from unittest.mock import AsyncMock, MagicMock

import pytest
from requests.exceptions import Timeout
from sqlalchemy.exc import SQLAlchemyError

from web_app.tasks.claim_airdrops import AirdropClaimer


@pytest.fixture
def airdrop_claimer():
    """
    Fixture to create a mock AirdropClaimer instance for each test.

    Yields:
        claimer
    """
    claimer = AirdropClaimer()
    claimer.db_connector = MagicMock()
    claimer.starknet_client = AsyncMock()
    claimer.zk_lend_airdrop = MagicMock()
    yield claimer


@pytest.fixture
def mock_airdrop():
    """
    Create a standard mock airdrop for reusable test setup.

    Yields:
        mock_airdrop
    """
    mock_airdrop = MagicMock()
    mock_airdrop.user.contract_address = "0x123"
    mock_airdrop.id = 1
    mock_airdrop.amount = 100
    yield mock_airdrop


@pytest.mark.asyncio
async def test_claim_airdrops_successful(airdrop_claimer, mock_airdrop):
    """
    Test the claim_airdrops method for successful claims.
    """
    # Arrange
    airdrop_claimer.db_connector.get_all_unclaimed.return_value = [mock_airdrop]
    airdrop_claimer.zk_lend_airdrop.get_contract_airdrop.return_value = [
        "proof1",
        "proof2",
    ]
    airdrop_claimer.starknet_client.claim_airdrop.return_value = True

    # Act
    await airdrop_claimer.claim_airdrops()

    # Assertions
    airdrop_claimer.zk_lend_airdrop.get_contract_airdrop.assert_called_with("0x123")
    airdrop_claimer.starknet_client.claim_airdrop.assert_awaited_with(
        "0x123", ["proof1", "proof2"]
    )
    airdrop_claimer.db_connector.save_claim_data.assert_called_with(1, 100)


@pytest.mark.asyncio
async def test_claim_airdrops_no_unclaimed(airdrop_claimer):
    """
    Test claim_airdrops when no unclaimed airdrops exist.
    """
    # Arrange
    airdrop_claimer.db_connector.get_all_unclaimed.return_value = []

    # Act
    await airdrop_claimer.claim_airdrops()

    # Assertions
    airdrop_claimer.zk_lend_airdrop.get_contract_airdrop.assert_not_called()
    airdrop_claimer.starknet_client.claim_airdrop.assert_not_called()
    airdrop_claimer.db_connector.save_claim_data.assert_not_called()


@pytest.mark.asyncio
async def test_claim_airdrops_partial_failure(airdrop_claimer):
    """
    Test claim_airdrops with multiple airdrops, some failing and some succeeding.
    """
    # Arrange
    mock_airdrop1 = MagicMock(
        user=MagicMock(contract_address="0x123"), id=1, amount=100
    )
    mock_airdrop2 = MagicMock(
        user=MagicMock(contract_address="0x456"), id=2, amount=200
    )

    airdrop_claimer.db_connector.get_all_unclaimed.return_value = [
        mock_airdrop1,
        mock_airdrop2,
    ]

    # Mock different behaviors for different airdrops
    airdrop_claimer.zk_lend_airdrop.get_contract_airdrop.side_effect = [
        ["proof1"],
        ["proof2"],
    ]
    airdrop_claimer.starknet_client.claim_airdrop.side_effect = [
        True,
        ValueError("Claim failed"),
    ]

    # Act
    await airdrop_claimer.claim_airdrops()

    # Assertions
    # Verify first airdrop was claimed and saved
    airdrop_claimer.db_connector.save_claim_data.assert_any_call(1, 100)
    # Verify second airdrop was not saved due to claim failure
    assert airdrop_claimer.db_connector.save_claim_data.call_count == 1


@pytest.mark.asyncio
async def test_claim_airdrops_database_error(airdrop_claimer, mock_airdrop, caplog):
    """
    Test handling of database errors during airdrop claiming.
    """
    # Arrange
    airdrop_claimer.db_connector.get_all_unclaimed.return_value = [mock_airdrop]
    airdrop_claimer.zk_lend_airdrop.get_contract_airdrop.return_value = ["proof1"]
    airdrop_claimer.starknet_client.claim_airdrop.return_value = True

    # Simulate database save error
    airdrop_claimer.db_connector.save_claim_data.side_effect = SQLAlchemyError(
        "Database error"
    )

    # Act
    with caplog.at_level(logging.ERROR):
        await airdrop_claimer.claim_airdrops()

    # Assertions
    assert "Database error while updating claim data" in caplog.text
    airdrop_claimer.starknet_client.claim_airdrop.assert_called_once()
    airdrop_claimer.db_connector.save_claim_data.assert_called_once()


@pytest.mark.asyncio
async def test_claim_airdrop_timeout_error(airdrop_claimer):
    """
    Test _claim_airdrop method handling of timeout errors.
    """
    # Arrange
    airdrop_claimer.starknet_client.claim_airdrop.side_effect = Timeout(
        "Request timed out"
    )

    # Act
    result = await airdrop_claimer._claim_airdrop("0x123", ["proof1"])

    # Assertions
    assert result is False
    airdrop_claimer.starknet_client.claim_airdrop.assert_awaited_with(
        "0x123", ["proof1"]
    )


@pytest.mark.asyncio
async def test_claim_airdrop_invalid_proof(airdrop_claimer):
    """
    Test _claim_airdrop method with invalid proof data.
    """
    # Arrange
    airdrop_claimer.starknet_client.claim_airdrop.side_effect = ValueError(
        "Invalid proof"
    )

    # Act
    result = await airdrop_claimer._claim_airdrop("0x123", ["invalid_proof"])

    # Assertions
    assert result is False
    airdrop_claimer.starknet_client.claim_airdrop.assert_awaited_with(
        "0x123", ["invalid_proof"]
    )


@pytest.mark.asyncio
async def test_claim_airdrop_unexpected_error(airdrop_claimer, caplog):
    """
    Test _claim_airdrop method handling of unexpected errors.
    """
    # Arrange
    unexpected_error = Exception("Completely unexpected error")
    airdrop_claimer.starknet_client.claim_airdrop.side_effect = unexpected_error

    # Act
    with caplog.at_level(logging.ERROR):
        result = await airdrop_claimer._claim_airdrop("0x123", ["proof1"])

    # Assertions
    assert result is False
    assert "Unexpected error claiming address" in caplog.text
    airdrop_claimer.starknet_client.claim_airdrop.assert_awaited_with(
        "0x123", ["proof1"]
    )
