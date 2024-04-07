from .base import Base

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, ForeignKey

class Question(Base):
    __tablename__ = 'questions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question: Mapped[str] = mapped_column(String, nullable=False)
    answer: Mapped[str] = mapped_column(String, nullable=False)
    incorrect: Mapped[str] = mapped_column(String, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    module_id: Mapped[int] = mapped_column(Integer, ForeignKey('course_modules.id', ondelete="CASCADE"), nullable=False)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey('courses.id', ondelete="CASCADE"), nullable=False)