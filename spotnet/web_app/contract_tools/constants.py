"""
This module contains constants for the contract tools.
"""

from decimal import Decimal
from dataclasses import dataclass
from enum import Enum
from typing import Iterator

EKUBO_MAINNET_ADDRESS: str = (
    "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b"  # mainnet address
)

ZKLEND_MARKET_ADDRESS: str = (
    "0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05"
)
MULTIPLIER_POWER = 99
ETH = "ETH"
STRK = "STRK"
kSTRK = "kSTRK"
USDC = "USDC"

ZKLEND_SCALE_DECIMALS = Decimal("1000000000000000000000000000")


@dataclass(frozen=True)
class TokenConfig:
    """
    Class to hold the token configuration for the pools.
    """

    address: str
    name: str
    decimals: Decimal
    collateral_factor: Decimal = Decimal("0.0")
    borrow_factor: Decimal = Decimal("0.0")


@dataclass(frozen=True)
class TokenMultipliers:
    """
    Class to hold the predefined multipliers for supported tokens/
    """

    ETH: float = 4.6
    STRK: float = 1.9
    kSTRK: float = 1.8
    USDC: float = 5.0


class TokenParams:
    """
    Class to hold the token configurations for tokens as class-level variables.
    """

    ETH = TokenConfig(
        name=ETH,
        address="0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        decimals=Decimal("18"),
        collateral_factor=Decimal("0.80"),
        borrow_factor=Decimal("1"),
    )
    STRK = TokenConfig(
        name=STRK,
        address="0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        decimals=Decimal("18"),
        collateral_factor=Decimal("0.60"),
        borrow_factor=Decimal("1"),
    )
    kSTRK = TokenConfig(
        name=kSTRK,
        address="0x45cd05ee2caaac3459b87e5e2480099d201be2f62243f839f00e10dde7f500c",
        decimals=Decimal("18"),
        collateral_factor=Decimal("0.60"),
        borrow_factor=Decimal("1"),
    )
    USDC = TokenConfig(
        name=USDC,
        address="0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
        decimals=Decimal("6"),
        collateral_factor=Decimal("0.80"),
        borrow_factor=Decimal("1"),
    )

    @classmethod
    def tokens(cls) -> Iterator[TokenConfig]:
        """
        Return an iterator over all token configurations.
        """
        return iter([cls.ETH, cls.STRK, cls.USDC, cls.kSTRK])

    @classmethod
    def get_token_address(cls, token_name: str) -> str:
        """
        Get the token address for a given token name.
        :param token_name: Token name
        :return: Token address
        """
        for token in cls.tokens():
            if token.name == token_name:
                return token.address
        raise ValueError(f"Token {token_name} not found")

    @classmethod
    def get_borrow_factor(cls, token_identifier):
        """
        Get the borrow factor for a given token.
        :param token_identifier: Token identifier: symbol or address
        :return: Token borrow factor
        """
        for token in cls.tokens():
            if token.address == token_identifier or token.name == token_identifier:
                return token.borrow_factor
        raise ValueError(f"Token {token_identifier} not found")

    @classmethod
    def get_token_decimals(cls, token_address: str) -> int:
        """
        Get the token decimals for a given token address.
        :param token_address: Token address
        :return: Token decimals
        """
        for token in cls.tokens():
            if token.address == token_address:
                return token.decimals
        raise ValueError(f"Token with address {token_address} not found")

    @classmethod
    def get_token_symbol(cls, token_address: str) -> str:
        """
        Get the token symbol for a given token address.
        :param token_address: Token address
        :return: Token symbol
        """
        for token in cls.tokens():
            if token.address == token_address:
                return token.name
        raise ValueError(f"Token with address {token_address} not found")

    @classmethod
    def get_token_collateral_factor(cls, token_identifier: str) -> Decimal:
        """
        Get the collateral factor for a given token.
        :param token_identifier: Token identifier: symbol or address
        :return: Token collateral factor
        """
        for token in cls.tokens():
            if token.address == token_identifier or token.name == token_identifier:
                return token.collateral_factor
        raise ValueError(f"Token {token_identifier} not found")

    @staticmethod
    def convert_int_to_str(token_address: int) -> str:
        """
        Converts an integer to a string representation of the token balance.
        :param token_address: Token address as an integer
        :return: String representation of the token balance
        """
        return str(hex(token_address))

    @staticmethod
    def add_underlying_address(token_address: str) -> str:
        """
        Add underlying address to the token address.
        :param token_address:
        :return: underlying address
        """
        return token_address[:2] + "0" + token_address[2:]


class ProtocolAddress(Enum):
    """
    Enum for the protocol addresses.
    """

    zklend: str = "0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05"
    nostra: str = "0x00c530f2c0aa4c16a0806365b0898499fba372e5df7a7172dc6fe9ba777e8007"
