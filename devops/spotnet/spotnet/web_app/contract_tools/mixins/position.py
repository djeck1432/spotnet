"""
Mixins for position related methods
"""

from web_app.contract_tools.blockchain_call import CLIENT


class PositionMixin:
    """
    Mixin for position related methods
    """

    @classmethod
    async def is_opened_position(cls, contract_address: str) -> bool:
        """
        Check if the position is opened.
        :param contract_address: Contract address
        :return: True if the position is opened, False otherwise
        """
        response = await CLIENT.is_opened_position(contract_address)
        try:
            return bool(response[0])
        except IndexError:
            return False
