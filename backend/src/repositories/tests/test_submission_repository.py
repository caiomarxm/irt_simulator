from sqlmodel import Session

from core.db import engine
from models import Submission
from repositories import submissions as submissions_repo


def test_read_user_submission_by_year():
    user_id = 1
    year = 2024
    with Session(engine) as session:
        submission = submissions_repo.read_user_submission_for_year(
            user_id=user_id, year=year, session=session)
        
        assert isinstance(submission, (Submission, None))
