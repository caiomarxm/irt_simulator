from typing import Optional, List

from models.exams import (ExamBase)
from models.questions import QuestionOut, QuestionCommited


class ExamOut(ExamBase):
    questions: Optional[List[QuestionOut]]


class ExamCommited(ExamBase):
    questions: Optional[List[QuestionCommited]]
