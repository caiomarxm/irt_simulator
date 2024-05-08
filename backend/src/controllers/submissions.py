from http import HTTPStatus
from fastapi import HTTPException, Response, status
from fastapi.routing import APIRouter
from sqlmodel import select
from typing import List, Optional

from core.deps import InjectCurrentUser, InjectSession

from services.submissions import SubmissionsService
from repositories import submissions as submissions_repo
from models.submissions import (
    SubmissionBase,
    SubmissionOut,
    SubmissionIn,
    Submission
)
from models.exams import Exam
from models.answers import Answer


router = APIRouter()


@router.get('', response_model=List[SubmissionOut | SubmissionBase])
def get_all_submissions(
    *,
    session: InjectSession,
    year: Optional[int] = None,
    include_answers: Optional[bool] = False,
    ignore_superuser: bool = False,
    user: InjectCurrentUser
) -> List[SubmissionOut | SubmissionBase]:

    submissions = submissions_repo.read_all_submissions(
        year=year,
        session=session,
        user_id=user.id,
        is_superuser=False if ignore_superuser else user.is_superuser
    )

    if include_answers:
        return map(SubmissionOut.model_validate, submissions)

    return submissions


@router.post('/submit', response_model=SubmissionOut, status_code=200)
def create_or_update_submission(
    *,
    submission_in: SubmissionIn,
    session: InjectSession,
    user: InjectCurrentUser,
    response: Response
) -> SubmissionOut:

    exam = session.exec(select(Exam).where(
        Exam.year == submission_in.exam_year)).first()

    if not exam or exam.is_closed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trying to submit for invalid or closed exam."
        )

    result = SubmissionsService.create_or_update_submission(
        submission_in=submission_in, user=user, session=session, exam=exam
    )

    if result.operation == 'create':
        response.status_code = 201

    return result.submission
