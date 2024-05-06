from http import HTTPStatus
from fastapi import HTTPException, Response
from fastapi.routing import APIRouter
from sqlmodel import select
from typing import List, Optional

from core.deps import InjectCurrentUser, InjectSession
from repositories.submissions import (
    read_all_submissions,
    create_submission_
)
from models.submissions import (
    SubmissionBase,
    SubmissionOut,
    SubmissionIn,
    Submission
)
from models.exams import Exam


router = APIRouter()


@router.get('', response_model=List[SubmissionOut | SubmissionBase])
def get_all_submissions(
    *,
    session: InjectSession,
    year: Optional[int] = None,
    include_answers: Optional[bool] = False,
    user: InjectCurrentUser
) -> List[SubmissionOut | SubmissionBase]:

    submissions = read_all_submissions(
        year=year,
        session=session,
        user_id=user.id,
        is_superuser=user.is_superuser
    )

    if include_answers:
        return map(SubmissionOut.model_validate, submissions)

    return submissions


@router.post('/create', response_model=SubmissionOut, status_code=201)
def create_submission(
    *,
    submission_in: SubmissionIn,
    session: InjectSession,
    user: InjectCurrentUser
) -> SubmissionOut:
    exam = session.exec(select(Exam).where(
        Exam.year == submission_in.exam_year)).first()

    if not exam or exam.is_closed:
        raise HTTPException(
            status_code=400,
            detail=f"Trying to submit for invalid or closed exam."
        )

    submission = create_submission_(
        submission_in=submission_in,
        answers=submission_in.answers,
        user=user,
        exam=exam,
        session=session
    )

    return submission
