"""course materials table

Revision ID: cb9a99894e22
Revises: e67c464026ba
Create Date: 2024-04-06 09:29:32.441108

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cb9a99894e22'
down_revision: Union[str, None] = 'e67c464026ba'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "course_modules",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("course_id", sa.Integer, sa.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
        sa.UniqueConstraint("course_id", "name")
    )
    op.create_table(
        "course_materials",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("course_id", sa.Integer, sa.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("filename", sa.String, nullable=False),
        sa.Column("module_id", sa.Integer, sa.ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=True),
        sa.Column("position", sa.Integer, nullable=False),
        sa.UniqueConstraint("course_id", "name")
    )


def downgrade() -> None:
    op.drop_table("course_materials")
    op.drop_table("course_modules")
