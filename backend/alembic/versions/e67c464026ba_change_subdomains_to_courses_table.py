"""change subdomains to courses table

Revision ID: e67c464026ba
Revises: 91e414890d4c
Create Date: 2024-04-06 03:35:01.459804

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e67c464026ba'
down_revision: Union[str, None] = '91e414890d4c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table('subdomains')
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('description', sa.String, nullable=False),
        sa.Column('subdomain', sa.String, nullable=False, unique=True),
        sa.Column('owner_id', sa.Integer, nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"]),
    )


def downgrade() -> None:
    op.drop_table('courses')
    op.create_table(
        'subdomains',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('subdomain', sa.String(), nullable=False, unique=True),
        sa.PrimaryKeyConstraint('id')
    )
