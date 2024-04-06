from .base import Base

from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped

class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("username"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30))
    password: Mapped[str] = mapped_column(String(60))

    def __repr__(self):
        return f"<User(name={self.username!r})>"

    def __str__(self):
        return self.username