"""users table

Revision ID: 91e414890d4c
Revises: 4f7b379a3bda
Create Date: 2024-04-06 02:10:39.816584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91e414890d4c'
down_revision: Union[str, None] = '4f7b379a3bda'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String(30), unique=True, nullable=False),
        sa.Column("password", sa.String(60), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("users")
