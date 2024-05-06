from typing import Optional, List

from models.submissions import SubmissionBase
from models.answers import Answer


class SubmissionOut(SubmissionBase):
    answers: Optional[List[Answer]]
