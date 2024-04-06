from .base import Base

from sqlalchemy import String, UniqueConstraint, ForeignKey, Integer
from sqlalchemy.orm import mapped_column, Mapped

class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (UniqueConstraint("subdomain"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)
    subdomain: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)


    def __repr__(self):
        return f"<Subdomain(name={self.subdomain!r})>"

    def __str__(self):
        return self.subdomain
