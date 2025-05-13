"""empty message

Revision ID: 247ecdfdc9a7
Revises: 28384c324fea, 797ff25cf0bd
Create Date: 2025-03-29 09:31:45.942000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '247ecdfdc9a7'
down_revision: Union[str, None] = ('28384c324fea', '797ff25cf0bd')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Merge heads"""
    pass


def downgrade() -> None:
    """Merge heads"""
    pass
