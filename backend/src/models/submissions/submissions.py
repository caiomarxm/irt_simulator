from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

from models.user import User
from models.exams import Exam


class SubmissionBase(SQLModel):
    is_commited: bool = False
    result: Optional[float] = None

    user_id: int
    exam_id: int


class Submission(SubmissionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="submissions")

    exam_id: int = Field(foreign_key="exam.id")
    exam: Exam = Relationship(back_populates="submissions")

    answers: Optional[List["Answer"]] = Relationship(back_populates="submission")

    def find_answer_index_by_question_id(self, question_id: int):
        for i, answer in enumerate(self.answers):
            if answer.question_id == question_id:
                return answer
        return None
