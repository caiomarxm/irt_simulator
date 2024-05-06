from fastapi import HTTPException
from sqlmodel import Session, select
from typing import List, Optional

from models.submissions import (
    SubmissionBase,
    Submission,
    SubmissionIn
)
from models.answers import (
    Answer,
    AnswerBase
)
from models.user import User
from models.exams import Exam


def create_submission_(
    submission_in: SubmissionIn,
    answers: Optional[List[AnswerBase]],
    user: User,
    exam: Exam,
    session: Session
) -> Submission:

    if submission_in.answers:
        submission_in.answers = None

    submission_in_dict = submission_in.model_dump()
    submission_in_dict.pop('answers')
    
    submission = Submission(**submission_in_dict, user=user, exam=exam)
    session.add(submission)

    for answer in answers:
        answer_dict = answer.model_dump()
        answer = Answer(**answer_dict, submission=submission)
        session.add(answer)

    session.commit()
    session.refresh(submission)
    return submission


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


def read_all_submissions(*, user_id: int, is_superuser: bool, year: Optional[int] = None, session: Session) -> List[Submission]:
    query = select(Submission)

    if year:
        query = query.where(Submission.year == year)
    if not is_superuser:
        query = query.where(Submission.user_id == user_id)

    submissions = session.exec(
        query
    ).all()

    return submissions
