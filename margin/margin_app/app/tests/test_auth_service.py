"""
Test auth service.
"""

import pytest
from app.services.auth.security import get_password_hash, verify_password
from app.services.auth.base import create_access_token, get_current_user


def test_verify_password():
    """
    Test verify password function.
    """
    plain_password = "secretPassword"
    hashed_password = get_password_hash(plain_password)

    assert verify_password(plain_password, hashed_password)
    assert not verify_password("wrongPassword", hashed_password)


def test_get_password_hash():
    """
    Test get password hash function.
    """
    plain_password = "secretPassword"
    hashed_password = get_password_hash(plain_password)

    assert hashed_password != plain_password
    assert isinstance(hashed_password, str)
