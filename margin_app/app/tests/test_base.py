"""Test to check if worklow works properly"""

import pytest

@pytest.fixture
def sample_data():
    """Test fixture"""
    return {"key": "value"}

def test_sample(sample_data):
    """Test function"""
    assert sample_data["key"] == "value"
