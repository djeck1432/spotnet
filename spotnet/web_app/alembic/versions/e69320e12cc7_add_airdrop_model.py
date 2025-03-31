"""Add AirDrop model

Revision ID: e69320e12cc7
Revises: a009512f5362
Create Date: 2024-10-25 16:47:37.723379

"""

import logging

import sqlalchemy as sa
from alembic import op
from sqlalchemy.engine.reflection import Inspector

revision = "e69320e12cc7"
down_revision = "a009512f5362"
branch_labels = None
depends_on = None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def upgrade() -> None:
    """
    Perform the upgrade migration to create the 'airdrop' table in the database
    if it does not exist.

    This migration creates a new table, 'airdrop', with the following columns:

    - `id`: Primary key, UUID type, non-nullable.
    - `user_id`: Foreign key referencing `user.id`, UUID type, non-nullable.
    - `created_at`: Timestamp for when the airdrop was created, DateTime type, non-nullable.
    - `amount`: Decimal type, nullable, representing the amount associated with the airdrop.
    - `is_claimed`: Boolean type, indicating if the airdrop has been claimed, nullable.
    - `claimed_at`: Timestamp for when the airdrop was claimed, DateTime type, nullable.

    Additional configuration:

    - Foreign key constraint on `user_id` to reference the `user` table.
    - Primary key constraint on `id`.
    - Index on `user_id` and `is_claimed` for optimized querying.

    This function is part of the Alembic migration and is auto-generated.
    Adjustments may be made if additional configuration or constraints are needed.
    """

    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    if "airdrop" not in inspector.get_table_names():
        op.create_table(
            "airdrop",
            sa.Column("id", sa.UUID(), nullable=False),
            sa.Column("user_id", sa.UUID(), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("amount", sa.DECIMAL(), nullable=True),
            sa.Column("is_claimed", sa.Boolean(), nullable=True),
            sa.Column("claimed_at", sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(
                ["user_id"],
                ["user.id"],
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            op.f("ix_airdrop_user_id"), "airdrop", ["user_id"], unique=False
        )
        op.create_index(
            op.f("ix_airdrop_is_claimed"), "airdrop", ["is_claimed"], unique=False
        )
        logger.info("Table 'airdrop' created successfully with indexes.")
    else:
        logger.info("Table 'airdrop' already exists, skipping creation.")


def downgrade() -> None:
    """
    Perform the downgrade migration to remove the 'airdrop' table from the database if it exists.
    This migration drops the 'airdrop' table and its associated indexes on `user_id`
    and `is_claimed`.
    It is intended to reverse the changes made in the `upgrade` function, allowing
    for a rollback of the database schema to the state before the 'airdrop' table was added.
    """
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    if "airdrop" in inspector.get_table_names():
        op.drop_index(op.f("ix_airdrop_is_claimed"), table_name="airdrop")
        op.drop_index(op.f("ix_airdrop_user_id"), table_name="airdrop")
        op.drop_table("airdrop")
        logger.info("Table 'airdrop' and its indexes were dropped successfully.")
    else:
        logger.info("Table 'airdrop' does not exist, skipping drop.")
