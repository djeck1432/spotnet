"""Module provides extra functionallity
for using INTERVAL in RANGE clause for window function"""

from datetime import timedelta
from enum import Enum, auto

from sqlalchemy.sql.elements import Over, _IntOrRange as IntOrBaseRange


class RangeType(Enum):
    """
    Enum with Range types, where:
    PRECEDING = window frame before current row
    FOLLOWING = window frame after current row
    """

    PRECEDING = auto()
    FOLLOWING = auto()


class RangeInterval(int):
    """
    Class which allows specify range as interval in SQL window function
    The trick is done by overwriting __abs__ function which is called in sqlalchemy internals
    and result of it is embedded directly in the sql plain query
    """

    def __new__(cls, delta: timedelta, type_: RangeType = RangeType.PRECEDING):
        return super().__new__(
            cls,
            delta.total_seconds()
            if type_ is RangeType.FOLLOWING
            else -delta.total_seconds(),
        )

    def __abs__(self):  # type: ignore
        # abs(range_[0]) called in SQLCompiler._format_frame_clause
        return str(super().__abs__())

    def __str__(self):
        return f"INTERVAL '{super().__str__()}' SECONDS"


_old_interpret_range = Over._interpret_range

# Type alias for Python 3.11 compat (type statement requires Python 3.12+)
_IntOrRange = IntOrBaseRange | RangeInterval


def _interpret_range(
    self,
    range_: tuple[_IntOrRange | None, _IntOrRange | None],
) -> tuple[_IntOrRange, _IntOrRange]:
    """
    Function used to substitute original one in sqlalchemy Over
    Provides only standart range args excluding args which are instance
    of specific RangeInterval class to original sqlalchemy method for further processing.
    Otherwise if RangeInterval will be provided to original method
    sqlalchemy will convert it to int which will break range interval functionallity
    """
    sa_lower, customer_lower = (
        (None, range_[0]) if isinstance(range_[0], RangeInterval) else (range_[0], None)
    )
    sa_upper, custom_upper = (
        (None, range_[1]) if isinstance(range_[1], RangeInterval) else (range_[1], None)
    )
    sa_lower, sa_upper = _old_interpret_range(self, (sa_lower, sa_upper))
    return customer_lower or sa_lower, custom_upper or sa_upper


Over._interpret_range = _interpret_range
