from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

from models.questions import Question
from models.submissions.submissions import Submission


class AnswerBase(SQLModel):
    response_index: int
    question_id: int


class Answer(AnswerBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    question_id: int = Field(foreign_key="question.id")
    question: Question = Relationship(back_populates="answers")

    submission_id: int = Field(foreign_key="submission.id")
    submission: Submission = Relationship(back_populates="answers")
