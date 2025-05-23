"""new pool-statistic view

Revision ID: f7f3b6e10769
Revises: 247ecdfdc9a7
Create Date: 2025-05-01 13:13:37.013237

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from app.db.extensions import CreateView, DropView
from app.models.pool import _PoolStatisticViewQueryBuilder


# revision identifiers, used by Alembic.
revision: str = "f7f3b6e10769"
down_revision: Union[str, None] = "247ecdfdc9a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create pool_statistic_view"""
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute(
        CreateView("pool_statistic_view", _PoolStatisticViewQueryBuilder.build())
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Drop pool_statistic_view"""
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute(DropView("pool_statistic_view"))
    # ### end Alembic commands ###
