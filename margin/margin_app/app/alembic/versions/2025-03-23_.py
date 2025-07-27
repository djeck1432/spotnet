"""Merge heads

Revision ID: 7a89efc80ab6
Revises: 7017e8115be7, 8f73c45f2caa
Create Date: 2025-03-23 18:01:07.829206

"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "7a89efc80ab6"
down_revision: Union[str, None] = ("7017e8115be7", "8f73c45f2caa")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Merge heads"""
    pass


def downgrade() -> None:
    """Merge heads"""
    pass
