from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

from models.exams import Exam


class Question(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    correct_response_index: int
    question: str
    options: str
    difficulty: int

    exam_id: int = Field(foreign_key="exam.id")
    exam: Exam = Relationship(back_populates="questions")

    answers: Optional[List["Answer"]] = Relationship(back_populates="question")
