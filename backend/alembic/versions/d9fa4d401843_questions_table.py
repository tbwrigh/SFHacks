"""questions table

Revision ID: d9fa4d401843
Revises: cb9a99894e22
Create Date: 2024-04-06 17:32:50.219084

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9fa4d401843'
down_revision: Union[str, None] = 'cb9a99894e22'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'questions',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('question', sa.String, nullable=False),
        sa.Column('answer', sa.String, nullable=False),
        sa.Column('incorrect', sa.String, nullable=False),
        sa.Column('position', sa.Integer, nullable=False),
        sa.Column('module_id', sa.Integer, sa.ForeignKey('course_modules.id', ondelete="CASCADE"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('questions')
