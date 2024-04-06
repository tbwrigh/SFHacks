from .base import Base

from sqlalchemy import String, UniqueConstraint, ForeignKey, Integer
from sqlalchemy.orm import mapped_column, Mapped

class Module(Base):
    __tablename__ = "course_modules"
    __table_args__ = (UniqueConstraint("course_id", "name"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)

    def __repr__(self):
        return f"<Module(name={self.name!r})>"
    
    def __str__(self):
        return self.name

    