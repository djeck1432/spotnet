"""add extra deposit status tx

Revision ID: 8a132b70dc8b
Revises: a5bfd6fdeb77
Create Date: 2025-01-12 19:59:34.084026

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "8a132b70dc8b"
down_revision = "a5bfd6fdeb77"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add extra_deposit status to the transaction_status_enum enum.
    """
    op.execute(
        """
        ALTER TYPE transaction_status_enum 
        ADD VALUE 'extra_deposit' 
        AFTER 'opened'
    """
    )


def downgrade() -> None:
    """
    Remove extra_deposit status from the transaction_status_enum enum.
    """
    op.execute(
        """
        DELETE FROM pg_enum 
        WHERE enumlabel = 'extra_deposit' 
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_status_enum')
    """
    )
