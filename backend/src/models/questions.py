from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Annotated

from pydantic import BeforeValidator

from models.exams import Exam


class QuestionBase(SQLModel):
    id: Optional[int] = None
    correct_response_index: int
    question: str
    options: str
    difficulty: int

    exam_id: int


class Question(QuestionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    exam_id: int = Field(foreign_key="exam.id")
    exam: Exam = Relationship(back_populates="questions")

    answers: Optional[List["Answer"]] = Relationship(back_populates="question")


class QuestionOut(QuestionBase):
    options: Annotated[List[str], BeforeValidator(lambda ops: ops.split(';'))]
