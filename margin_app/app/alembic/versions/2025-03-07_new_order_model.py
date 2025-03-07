"""new order model

Revision ID: a1b2c3d4e5f6
Revises: fe041c2f01ee
Create Date: 2025-03-07 09:00:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision = "a1b2c3d4e5f6"
down_revision = "fe041c2f01ee"
branch_labels = None
depends_on = None


def upgrade():
    """Create order table."""
    op.create_table(
        "order",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "user_id", UUID(as_uuid=True), sa.ForeignKey("user.id"), nullable=False
        ),
        sa.Column("price", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("token", sa.VARCHAR(), nullable=False),
        sa.Column("position", UUID(as_uuid=True), nullable=False),
    )


def downgrade():
    """Drop order table."""
    op.drop_table("order")
