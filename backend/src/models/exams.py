from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class ExamCreate(SQLModel):
    year: int


class ExamUpdate(SQLModel):
    year: int
    is_closed: bool = True
    is_committed: bool = False


class Exam(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    year: int
    is_closed: bool = True
    is_committed: bool = False

    questions: Optional[List["Question"]] = Relationship(back_populates="exam")
    submissions: Optional[List["Submission"]] = Relationship(back_populates="exam")
