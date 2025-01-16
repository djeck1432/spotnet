"""create extra deposits table

Revision ID: create_extra_deposits

"""
from alembic import op
import sqlalchemy as sa
from uuid import uuid4
from datetime import datetime

def upgrade():
    op.create_table(
        'extra_deposits',
        sa.Column('id', sa.UUID(), nullable=False, default=uuid4),
        sa.Column('token_symbol', sa.String(), nullable=False),
        sa.Column('amount', sa.String(), nullable=False),
        sa.Column('added_at', sa.DateTime(), nullable=False, default=datetime.utcnow),
        sa.Column('position_id', sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(['position_id'], ['position.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token_symbol', 'position_id', name='uix_token_position')
    )

def downgrade():
    op.drop_table('extra_deposits') 