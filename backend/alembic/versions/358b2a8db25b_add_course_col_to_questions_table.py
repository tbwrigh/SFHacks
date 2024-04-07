"""add course col to questions table

Revision ID: 358b2a8db25b
Revises: d9fa4d401843
Create Date: 2024-04-06 19:57:33.030311

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '358b2a8db25b'
down_revision: Union[str, None] = 'd9fa4d401843'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('questions', sa.Column('course_id', sa.Integer, sa.ForeignKey('courses.id', ondelete="CASCADE"), nullable=False))


def downgrade() -> None:
    op.drop_column('questions', 'course_id')
