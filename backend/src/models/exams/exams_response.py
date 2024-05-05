from typing import Optional, List

from models.exams import (ExamBase)
from models.questions import QuestionOut


class ExamOut(ExamBase):
    questions: Optional[List[QuestionOut]]
