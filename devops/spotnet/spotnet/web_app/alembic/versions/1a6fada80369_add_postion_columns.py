"""
Add new columns to the `position` table.

Revision ID: 1a6fada80369
Revises: 0537a9a5e841
Create Date: 2024-11-25 07:34:11.693095

This migration introduces the following changes to the `position` table:
- Adds `is_protection` (Boolean): Indicates whether the position has protection enabled.
- Adds `liquidation_bonus` (Float): Represents any bonus applied during the liquidation process.
- Adds `is_liquidated` (Boolean): Marks whether the position has been liquidated.
- Adds `datetime_liquidation` (DateTime): Stores the timestamp of when the position was liquidated.
These changes enhance the functionality of the `position` table by
allowing better tracking of liquidation-related events and attributes.
"""

from alembic import op
import sqlalchemy as sa


# Revision identifiers, used by Alembic.
revision = "1a6fada80369"
down_revision = "0537a9a5e841"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Apply the upgrade.

    This function adds four new columns to the `position` table:
    - `is_protection`: A boolean field that indicates whether protection is enabled.
    - `liquidation_bonus`: A float field to store any bonuses applied during liquidation.
    - `is_liquidated`: A boolean field to indicate if the position has been liquidated.
    - `datetime_liquidation`: A datetime field to record when the liquidation occurred,
     allowing null values.
    """
    op.add_column("position", sa.Column("is_protection", sa.Boolean(), nullable=True))
    op.add_column("position", sa.Column("liquidation_bonus", sa.Float(), nullable=True))
    op.add_column("position", sa.Column("is_liquidated", sa.Boolean(), nullable=True))
    op.add_column(
        "position", sa.Column("datetime_liquidation", sa.DateTime(), nullable=True)
    )


def downgrade() -> None:
    """
    Revert the upgrade.

    This function removes the four columns added to the `position` table:
    - `is_protection`
    - `liquidation_bonus`
    - `is_liquidated`
    - `datetime_liquidation`
    """
    op.drop_column("position", "datetime_liquidation")
    op.drop_column("position", "is_liquidated")
    op.drop_column("position", "liquidation_bonus")
    op.drop_column("position", "is_protection")
