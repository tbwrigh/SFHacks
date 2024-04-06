from .base import Base

from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped

class Subdomain(Base):
    __tablename__ = "subdomains"
    __table_args__ = (UniqueConstraint("subdomain"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    subdomain: Mapped[str] = mapped_column(String(30))

    def __repr__(self):
        return f"<Subdomain(name={self.subdomain!r})>"

    def __str__(self):
        return self.subdomain
