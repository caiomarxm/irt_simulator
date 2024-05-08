import pytest
from sqlmodel import Session

from core.db import engine

from services.submissions import SubmissionsService
from models import (
    Submission,
    Question,
    Answer
)


def test_incomplete_submission_result():
    submission = Submission(
        user_id=-1,
        exam_id=1,
        answers=[]
    )

    with Session(engine) as session:
        result = SubmissionsService.calculate_result(
            submission=submission, session=session)
        assert isinstance(result, float)
