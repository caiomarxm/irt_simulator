from http import HTTPStatus
from fastapi import HTTPException, Response
from fastapi.routing import APIRouter
from typing import List, Optional

from core.deps import InjectCurrentUser, InjectSession
from repositories.submissions import (
    read_all_submissions
)
from models.submissions import (
    SubmissionBase,
    SubmissionOut
)


router = APIRouter()


@router.get('', response_model=List[SubmissionOut | SubmissionBase])
def get_all_submissions(
    *,
    session: InjectSession,
    year: Optional[int] = None,
    include_answers: Optional[bool] = False
) -> List[SubmissionOut | SubmissionBase]:

    submissions = read_all_submissions(year=year, session=session)

    if include_answers:
        return map(SubmissionOut.model_validate, submissions)

    return submissions


def create_submission(
    
):
    ...
