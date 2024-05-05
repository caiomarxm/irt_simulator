from typing import Optional, List

from models.exams import (ExamBase)
from models.questions import Question


class ExamOut(ExamBase):
    questions: Optional[List[Question]]
