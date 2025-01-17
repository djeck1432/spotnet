"""create extra deposits table

Revision ID: 9a132b70dc8c
Revises: 8a132b70dc8b
Create Date: 2024-01-17 08:52:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = '9a132b70dc8c'
down_revision = '8a132b70dc8b'
branch_labels = None
depends_on = None

def upgrade():
    """
    Create extra_deposits table with UUID primary key, token symbol, amount,
    timestamp and position foreign key reference.
    """
    # First check if the uuid-ossp extension exists
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    
    bind = op.get_bind()
    inspector = inspect(bind)
    if "extra_deposits" not in inspector.get_table_names():
        op.create_table(
            'extra_deposits',
            sa.Column(
                'id', 
                sa.UUID(), 
                server_default=sa.text('uuid_generate_v4()'), 
                nullable=False
            ),
            sa.Column('token_symbol', sa.String(), nullable=False),
            sa.Column('amount', sa.String(), nullable=False),
            sa.Column(
                'added_at', 
                sa.DateTime(), 
                server_default=sa.text('CURRENT_TIMESTAMP'), 
                nullable=False
            ),
            sa.Column('position_id', sa.UUID(), nullable=False),
            sa.ForeignKeyConstraint(['position_id'], ['position.id'], ),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('token_symbol', 'position_id', name='uix_token_position')
        )
        print("Created extra_deposits table")
    else:
        print("extra_deposits table already exists")

def downgrade():
    """
    Remove extra_deposits table from the database.
    """
    op.drop_table('extra_deposits')
