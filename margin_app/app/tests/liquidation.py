"""Tests for LiquidationCRUD in spotnet/margin_app/app/crud/liquidation.py"""
# pylint: disable=redefined-outer-name

import pytest
from app.crud.liquidation import LiquidationCRUD
from app.models.liquidation import Liquidation

@pytest.fixture
def session_fixture():
    """Fixture providing a mock database session."""
    class MockSession:
        """Mock session to simulate database operations."""
        def __init__(self):
            self.data = []

        def add(self, obj):
            """Simulate adding an object to the database."""
            self.data.append(obj)

        def commit(self):
            """Simulate committing a transaction (no operation)."""

        def query(self, _):
            """Return a mock query object."""
            class Query:
                """Mock Query class to filter and retrieve data."""
                def __init__(self, data):
                    self.data = data

                def filter_by(self, **kwargs):
                    """Filter data based on provided keyword arguments."""
                    filtered = [
                        item for item in self.data
                        if all(getattr(item, key, None) == value for key, value in kwargs.items())
                    ]
                    return Query(filtered)

                def first(self):
                    """Return the first element in the filtered data, or None if empty."""
                    return self.data[0] if self.data else None

            return Query(self.data)

    return MockSession()

def test_create_liquidation_success(session_fixture):
    """Test creating a liquidation record with valid data."""
    liquidation_data = {"id": 1, "amount": 1000, "status": "pending"}
    liquidation = LiquidationCRUD().create(session_fixture, liquidation_data)  # pylint: disable=no-member
    assert liquidation is not None
    assert liquidation.id == 1

def test_create_liquidation_failure(session_fixture):
    """Test that creating a liquidation record with invalid data raises an error."""
    liquidation_data = {"amount": -500}  # Invalid data: negative amount
    with pytest.raises(ValueError):
        LiquidationCRUD().create(session_fixture, liquidation_data)  # pylint: disable=no-member

def test_get_liquidation_success(session_fixture):
    """Test retrieving an existing liquidation record."""
    liquidation_instance = Liquidation(id=1, amount=1000, status="pending")
    session_fixture.add(liquidation_instance)
    liquidation = LiquidationCRUD().get(session_fixture, 1)  # pylint: disable=no-member
    assert liquidation is not None
    assert liquidation.id == 1

def test_get_liquidation_not_found(session_fixture):
    """Test retrieving a non-existent liquidation record returns None."""
    liquidation = LiquidationCRUD().get(session_fixture, 999)  # pylint: disable=no-member
    assert liquidation is None
