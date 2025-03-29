"""
Security utilities for password handling.
"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """
    Hashes the provided password according to the specified hashing context.

    :param password: str - The password to be hashed.

    :return: str - The hashed password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify that a plain text password matches a hashed password.

    :param plain_password: str - The plain password to be verified.
    :param hashed_password: str - The hashed password against which the plain
    one will be verified.

    :return: bool - True if the plain password matches the hashed password,
    False if not.
    """
    return pwd_context.verify(plain_password, hashed_password) 