from fastapi import HTTPException
from sqlmodel import Session, select
from typing import List, Optional

from models.submissions import (
    SubmissionBase,
    Submission
)


def create_submission(user_in: SubmissionBase, session: Session) -> Submission:
    session.add(user_in)
    session.commit()
    session.refresh(user_in)
    return user_in


def update_submission(updated_submission: SubmissionBase, session: Session, submission: Submission) -> Submission:
    submission_data = updated_submission.model_dump(exclude_unset=True)
    submission.sqlmodel_update(submission_data)

    session.add(submission)
    session.commit()
    session.refresh(submission)
    return submission


def read_submission_by_id(submission_id: int, session: Session) -> Submission | None:
    submission = session.get(Submission, submission_id)
    return submission


def read_all_submissions(*, year: Optional[int] = None, session: Session) -> List[Submission]:
    query = select(Submission)

    if year:
        query = query.where(Submission.year == year)

    submissions = session.exec(
        query
    ).all()

    return submissions
