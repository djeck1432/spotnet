"""
Tests for the AirDropDBConnector class, covering key database operations for airdrops.

Fixtures:
- db_connector: Provides an AirDropDBConnector instance with test user and airdrop data.

Test Cases:
- test_create_empty_claim_positive: Verifies airdrop creation for an existing user.
- test_create_empty_claim_non_existent_user: Checks error handling for invalid user IDs.
- test_save_claim_data_positive: Ensures claim data updates correctly.
- test_save_claim_data_non_existent_airdrop: Confirms logging for invalid airdrop IDs.
- test_get_all_unclaimed_positive: Retrieves unclaimed airdrops.
- test_get_all_unclaimed_after_claiming: Excludes claimed airdrops from unclaimed results.
"""

import uuid
from decimal import Decimal

import pytest
from sqlalchemy.exc import SQLAlchemyError

from web_app.db.crud import AirDropDBConnector
from web_app.db.models import AirDrop, User


@pytest.fixture
def db_connector():
    """
    Sets up an AirDropDBConnector with a test user and airdrop record, then cleans
    up after the test.
    This fixture:
    - Initializes an AirDropDBConnector instance.
    - Creates and saves a test user and associated airdrop record.
    - Yields the connector, user, and airdrop instances for test use.
    - Cleans up the database by removing the test user and airdrop after the test.

    Yields:
        tuple: (AirDropDBConnector, User, AirDrop)
    """
    connector = AirDropDBConnector()
    test_user = User(wallet_id="test_wallet_id")
    connector.write_to_db(test_user)
    airdrop = AirDrop(user_id=test_user.id)
    connector.write_to_db(airdrop)
    yield connector, test_user, airdrop
    connector.delete_object_by_id(AirDrop, airdrop.id)
    connector.delete_object_by_id(User, test_user.id)


def test_create_empty_claim_positive(db_connector):
    """
    Tests that create_empty_claim successfully creates a new airdrop for an
    existing user.

    Steps:
    - Calls create_empty_claim with a valid user ID.
    - Asserts the airdrop is created with the correct user_id and
    is initially unclaimed.

    Args:
        db_connector (fixture): Provides the AirDropDBConnector, test user,
        and test airdrop.
    """
    connector, test_user, _ = db_connector
    new_airdrop = connector.create_empty_claim(test_user.id)
    assert new_airdrop is not None
    assert new_airdrop.user_id == test_user.id
    assert not new_airdrop.is_claimed
    connector.delete_object_by_id(AirDrop, new_airdrop.id)


def test_create_empty_claim_non_existent_user(db_connector):
    """
    Tests that create_empty_claim raises an error when called with
    a non-existent user ID.

    Steps:
    - Generates a fake user ID that does not exist in the database.
    - Verifies that calling create_empty_claim with this ID raises
    an SQLAlchemyError.

    Args:
    db_connector (fixture): Provides the AirDropDBConnector
    and test setup.
    """
    connector, _, _ = db_connector
    fake_user_id = uuid.uuid4()
    with pytest.raises(SQLAlchemyError):
        connector.create_empty_claim(fake_user_id)


def test_save_claim_data_positive(db_connector):
    """
    Tests that save_claim_data correctly updates an existing airdrop
    with claim details.

    Steps:
    - Calls save_claim_data with a valid airdrop ID and amount.
    - Asserts the airdrop's amount, is_claimed status, and claimed_at
    timestamp are updated correctly.

    Args:
    db_connector (fixture): Provides the AirDropDBConnector, test user,
    and test airdrop.
    """
    connector, _, airdrop = db_connector
    amount = Decimal("100.50")
    connector.save_claim_data(airdrop.id, amount)
    updated_airdrop = connector.get_object(AirDrop, airdrop.id)
    assert updated_airdrop.amount == amount
    assert updated_airdrop.is_claimed
    assert updated_airdrop.claimed_at is not None


def test_save_claim_data_non_existent_airdrop(db_connector, caplog):
    """
    Tests that save_claim_data logs an error when called with a non-existent
    airdrop ID.

    Steps:
    - Generates a fake airdrop ID that is not in the database.
    - Calls save_claim_data with this ID and checks that the appropriate
        error message is logged.

    Args:
        db_connector (fixture): Provides the AirDropDBConnector and
        test setup.
        caplog (fixture): Captures log output for verification.
    """
    connector, _, _ = db_connector
    fake_airdrop_id = uuid.uuid4()
    connector.save_claim_data(fake_airdrop_id, Decimal("50.00"))
    assert f"AirDrop with ID {fake_airdrop_id} not found" in caplog.text


def test_get_all_unclaimed_positive(db_connector):
    """
    Tests that get_all_unclaimed retrieves unclaimed airdrops correctly.

    Steps:
    - Calls get_all_unclaimed to fetch unclaimed airdrops.
    - Asserts that the test airdrop (unclaimed) is present in the retrieved
    list by matching IDs.

    Args:
        db_connector (fixture): Provides the AirDropDBConnector, test user,
        and test airdrop.
    """
    connector, _, airdrop = db_connector
    unclaimed_airdrops = connector.get_all_unclaimed()
    assert any(airdrop.id == unclaimed.id for unclaimed in unclaimed_airdrops)


def test_get_all_unclaimed_after_claiming(db_connector):
    """
    Tests that get_all_unclaimed excludes airdrops that have been claimed.

    Steps:
    - Marks the test airdrop as claimed using save_claim_data.
    - Calls get_all_unclaimed to fetch unclaimed airdrops.
    - Asserts that the claimed airdrop is not included in the
    returned list.

    Args:
        db_connector (fixture): Provides the AirDropDBConnector,
        test user, and test airdrop.
    """
    connector, _, airdrop = db_connector
    connector.save_claim_data(airdrop.id, Decimal("50.00"))
    unclaimed_airdrops = connector.get_all_unclaimed()
    assert airdrop not in unclaimed_airdrops
