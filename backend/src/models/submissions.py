from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

from models.user import User
from models.exams import Exam


class Submission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    is_commited: bool = False
    result: Optional[float]

    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="submissions")

    exam_id: int = Field(foreign_key="exam.id")
    exam: Exam = Relationship(back_populates="submissions")
