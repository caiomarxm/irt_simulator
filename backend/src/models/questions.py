from sqlmodel import SQLModel, Field
from typing import Optional


class Question(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    correct_response_index: int
    question: str
    options: str
    difficulty: int

    exam_id: int = Field(foreign_key="exam.id")
