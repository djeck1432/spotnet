"""
Test cases for DepositDBConnector functionality in web_app.
"""

from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from web_app.db.crud import DepositDBConnector
from web_app.db.models import User, Vault


@pytest.fixture
def deposit_db_connector_fixture(mock_db_connector):
    """
    Fixture to provide a mocked DepositDBConnector instance using mock_db_connector.
    """
    connector = DepositDBConnector()
    connector.Session = mock_db_connector.Session
    connector.get_object_by_field = mock_db_connector.get_object_by_field
    connector.write_to_db = mock_db_connector.write_to_db
    return connector


@pytest.fixture
def mock_user_fixture():
    """
    Mocked User instance.
    """
    return User(id="user123", wallet_id="wallet123")


@pytest.fixture
def mock_vault_fixture():
    """
    Mocked Vault instance.
    """
    return Vault(id="vault123", user_id="user123", symbol="ETH", amount="100.00")


# pylint: disable=too-few-public-methods
class TestCreateVault:
    """
    Tests for creating a vault using DepositDBConnector.
    """

    def test_create_vault_success(
        self,
        deposit_db_connector: DepositDBConnector,
        mock_user: User,
        mock_db_connector,
    ):
        """
        Test successful creation of a vault using fixtures.
        """
        mock_db_connector.write_to_db = MagicMock()  # Use mock_db_connector's method

        vault = deposit_db_connector.create_vault(
            user=mock_user,
            symbol="BTC",
            amount="50.00",
        )

        assert vault.symbol == "BTC"
        assert vault.amount == "50.00"
        assert vault.user_id == mock_user.id
        mock_db_connector.write_to_db.assert_called_once_with(vault)

    def test_create_vault_failure_invalid_user(
        self,
        deposit_db_connector: DepositDBConnector,
    ):
        """
        Test failure when creating a vault with an invalid user.
        """
        with pytest.raises(ValueError, match="Invalid user provided"):
            deposit_db_connector.create_vault(
                user=None,
                symbol="BTC",
                amount="50.00",
            )


# pylint: disable=too-few-public-methods
class TestAddVaultBalance:
    """
    Tests for adding to a vault's balance using DepositDBConnector.
    """

    def test_add_balance_success(
        self,
        deposit_db_connector: DepositDBConnector,
        mock_vault: Vault,
        mock_db_connector,
    ):
        """
        Test successfully adding to a vault's balance using fixtures.
        """
        mock_db_connector.get_object_by_field = MagicMock(return_value=mock_vault)
        mock_db_connector.Session().query().filter_by().update = MagicMock()

        deposit_db_connector.add_vault_balance(
            wallet_id="wallet123",
            symbol="ETH",
            amount="50.00",
        )

        updated_amount = Decimal(mock_vault.amount) + Decimal("50.00")
        mock_db_connector.Session().query().filter_by().update.assert_called_once_with(
            {"amount": str(updated_amount)}
        )

    def test_add_balance_failure_vault_not_found(
        self,
        deposit_db_connector: DepositDBConnector,
        mock_db_connector,
    ):
        """
        Test failure when adding to a vault balance that doesn't exist.
        """
        mock_db_connector.get_object_by_field = MagicMock(return_value=None)

        with pytest.raises(ValueError, match="Vault not found"):
            deposit_db_connector.add_vault_balance(
                wallet_id="invalid_wallet",
                symbol="ETH",
                amount="50.00",
            )
