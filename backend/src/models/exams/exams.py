from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class ExamCreate(SQLModel):
    year: int


class ExamUpdate(SQLModel):
    year: Optional[int] = None
    is_closed: Optional[bool] = None
    is_committed: Optional[bool] = None


class ExamBase(SQLModel):
    id: Optional[int]
    year: int
    is_closed: bool = True
    is_committed: bool = False


class Exam(ExamBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    year: int
    is_closed: bool = True
    is_committed: bool = False

    questions: Optional[List["Question"]] = Relationship(back_populates="exam")
    submissions: Optional[List["Submission"]] = Relationship(back_populates="exam")
