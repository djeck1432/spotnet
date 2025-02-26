"""
Pytest-based asynchronous database tests for CRUD operations.

This module defines test cases for verifying the functionality of the database
operations using SQLAlchemy and an async database connection. It includes
fixtures to set up and tear down test environments, as well as tests for
creating, retrieving, updating, and deleting objects in the database.
"""

import uuid

import pytest
import pytest_asyncio
from sqlalchemy import Column, String
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import BaseModel

pytestmark = pytest.mark.asyncio


class TestModel(BaseModel):
    """Test database model representing a simple object with an ID and name."""

    __tablename__ = "test_model"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)


@pytest_asyncio.fixture
async def test_object(db_connector):
    """Fixture to create a test object in the database."""
    obj = TestModel(name="Test Object")
    obj = await db_connector.write_to_db(obj)
    return obj


async def test_write_to_db(db_connector):
    """Test writing an object to the database."""
    obj = TestModel(name="New Object")
    saved_obj = await db_connector.write_to_db(obj)
    assert saved_obj.id is not None
    assert saved_obj.name == "New Object"


async def test_get_object(db_connector, test_object):
    """Test retrieving an object by ID."""
    fetched_obj = await db_connector.get_object(TestModel, test_object.id)
    assert fetched_obj is not None
    assert fetched_obj.id == test_object.id
    assert fetched_obj.name == "Test Object"


async def test_get_object_by_field(db_connector, test_object):
    """Test retrieving an object by field."""
    fetched_obj = await db_connector.get_object_by_field(
        TestModel, "name", "Test Object"
    )
    assert fetched_obj is not None
    assert fetched_obj.name == "Test Object"


async def test_delete_object_by_id(db_connector, test_object):
    """Test deleting an object by ID."""
    await db_connector.delete_object_by_id(TestModel, test_object.id)
    fetched_obj = await db_connector.get_object(TestModel, test_object.id)
    assert fetched_obj is None


async def test_delete_object(db_connector):
    """Test deleting an object directly."""
    obj = TestModel(name="To be deleted")
    obj = await db_connector.write_to_db(obj)
    await db_connector.delete_object(obj)
    fetched_obj = await db_connector.get_object(TestModel, obj.id)
    assert fetched_obj is None


async def test_get_nonexistent_object(db_connector):
    """Test retrieving a non-existent object."""
    non_existing_id = str(uuid.uuid4())
    obj = await db_connector.get_object(TestModel, non_existing_id)
    assert obj is None


async def test_get_object_by_invalid_field(db_connector):
    """Test retrieving an object using an invalid field, expecting an AttributeError."""
    with pytest.raises(AttributeError):
        await db_connector.get_object_by_field(TestModel, "non_existing_field", "value")


async def test_delete_nonexistent_object(db_connector):
    """Test deleting a non-existent object, ensuring no errors are raised."""
    non_existing_id = str(uuid.uuid4())
    await db_connector.delete_object_by_id(TestModel, non_existing_id)


async def test_write_invalid_object(db_connector):
    """Test attempting to write an invalid object, expecting an Exception."""
    with pytest.raises(Exception):
        await db_connector.write_to_db(None)
