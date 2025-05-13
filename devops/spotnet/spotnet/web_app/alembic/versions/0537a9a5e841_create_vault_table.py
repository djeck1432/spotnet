"""create vault table

Revision ID: 0537a9a5e841
Revises: b1fdf24eae4f
Create Date: 2024-11-21 19:05:34.138052

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "0537a9a5e841"
down_revision = "b1fdf24eae4f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Creates the Vault table with necessary columns and indexes.

    Columns:
        - id: Primary key
        - user_id: The Id of the user
        - symbol: Token symbol
        - amount: Amount of the vault
        - created_at: Timestamp of creation
        - updated_at: Timestamp of last update
    """
    op.create_table(
        "vault",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("symbol", sa.String(), nullable=True),
        sa.Column("amount", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_vault_user_id"), "vault", ["user_id"], unique=False)


def downgrade() -> None:
    """
    Removes the Vault table and its associated indexes.
    This function is called when rolling back the migration.
    """
    op.drop_index(op.f("ix_vault_user_id"), table_name="vault")
    op.drop_table("vault")
