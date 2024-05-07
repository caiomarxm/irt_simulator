from sqlmodel import Session, select
from core.db import engine
from services.submissions import SubmissionsService, Answer, Submission

from models import *


def test_submission_service():
    assert len(SubmissionsService._get_domain()) == SubmissionsService.granularity
    with Session(engine) as session:
        submission = session.exec(select(Submission)).first()
        answers = session.exec(select(Answer).where(Submission.id == submission.id)).all()
        if submission:
            assert Submission.model_validate(submission)
            submission.answers = answers
            result = SubmissionsService.calculate_submission_result(submission=submission)
            return result
