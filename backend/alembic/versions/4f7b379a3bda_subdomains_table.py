"""subdomains table

Revision ID: 4f7b379a3bda
Revises: 
Create Date: 2024-04-05 20:46:09.170652

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4f7b379a3bda'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'subdomains',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('subdomain', sa.String(), nullable=False, unique=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('subdomains')
