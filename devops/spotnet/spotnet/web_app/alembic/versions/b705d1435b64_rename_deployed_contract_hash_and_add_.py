"""rename deployed_contract_hash and add status field

Revision ID: b705d1435b64
Revises: d71e1e3e800f
Create Date: 2024-10-14 21:13:19.784033

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = "b705d1435b64"
down_revision = "d71e1e3e800f"
branch_labels = None
depends_on = None


def column_exists(table_name: str, column_name: str) -> bool:
    """Check if a column exists in the specified table.

    Args:
        table_name (str): Name of the table to check
        column_name (str): Name of the column to look for

    Returns:
        bool: True if the column exists, False otherwise
    """
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    columns = [column.get("name") for column in inspector.get_columns(table_name)]
    return column_name in columns


def enum_type_exists(enum_name: str) -> bool:
    """Check if an enum type exists in the database.

    Args:
        enum_name (str): Name of the enum type to check

    Returns:
        bool: True if the enum type exists, False otherwise
    """
    bind = op.get_bind()
    result = bind.execute(
        text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = :enum_name);"),
        {"enum_name": enum_name},
    )
    return result.scalar()


def upgrade() -> None:
    """Upgrade the database schema.

    This function performs the following operations:
    - Creates an enum type 'status_enum' if it doesn't exist
    - Adds a 'status' column to the 'position' table if it doesn't exist
    - Adds a 'contract_address' column to the 'user' table if it doesn't exist
    - Drops the 'deployed_transaction_hash' column from the 'user' table if it exists
    """
    # Create enum type 'status_enum' if it doesn't exist
    if not enum_type_exists("status_enum"):
        op.execute("CREATE TYPE status_enum AS ENUM ('pending', 'opened', 'closed')")

    # Add status column to position table if it doesn't exist
    if not column_exists("position", "status"):
        op.add_column(
            "position",
            sa.Column(
                "status",
                sa.Enum("pending", "opened", "closed", name="status_enum"),
                nullable=True,
            ),
        )

    # Add contract_address column to user table if it doesn't exist
    if not column_exists("user", "contract_address"):
        op.add_column("user", sa.Column("contract_address", sa.String(), nullable=True))

    # Drop deployed_transaction_hash column from user table if it exists
    if column_exists("user", "deployed_transaction_hash"):
        op.drop_column("user", "deployed_transaction_hash")


def downgrade() -> None:
    """Downgrade the database schema.

    This function performs the following operations:
    - Drops the 'status' column from the 'position' table if it exists
    - Drops the enum type 'status_enum' if there are no columns using it
    - Drops the 'contract_address' column from the 'user' table if it exists
    - Adds the 'deployed_transaction_hash' column to the 'user' table if it doesn't exist
    """
    # Drop status column from position table if it exists
    if column_exists("position", "status"):
        op.drop_column("position", "status")

    # Drop the enum type if there are no columns using it
    if enum_type_exists("status_enum"):
        op.execute("DROP TYPE status_enum")

    # Drop contract_address column from user table if it exists
    if column_exists("user", "contract_address"):
        op.drop_column("user", "contract_address")

    # Add deployed_transaction_hash column to user table if it doesn't exist
    if not column_exists("user", "deployed_transaction_hash"):
        op.add_column(
            "user",
            sa.Column(
                "deployed_transaction_hash",
                sa.VARCHAR(),
                autoincrement=False,
                nullable=True,
            ),
        )
