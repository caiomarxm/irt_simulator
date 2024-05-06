from typing import Optional, List

from models.submissions import SubmissionBase
from models.answers import Answer, AnswerBase
from models.user import User


class SubmissionOut(SubmissionBase):
    answers: Optional[List[Answer]]


class SubmissionIn(SubmissionBase):
    exam_year: int

    # Defining both as none so it's not mandatory on payload
    user_id: Optional[int] = None
    exam_id: Optional[int] = None

    answers: Optional[List[AnswerBase]]
