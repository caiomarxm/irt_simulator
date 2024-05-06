from http import HTTPStatus
from fastapi import HTTPException, Response, status
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
from models.answers import Answer


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
            status_code=400,
            detail=f"Trying to submit for invalid or closed exam."
        )

    # Check if there's any submission. If so, overwrites
    # is_superuser set to false because each individual can only has one active submission
    db_submissions: List[Submission] = read_all_submissions(
        user_id=user.id,
        is_superuser=False,
        year=submission_in.exam_year,
        session=session
    )

    if not db_submissions:
        submission = create_submission_(
            submission_in=submission_in,
            answers=submission_in.answers,
            user=user,
            exam=exam,
            session=session
        )
        response.status_code = status.HTTP_201_CREATED
        return submission

    # Overwriting logic, this could be extracted to other function
    assert len(db_submissions) <= 1
    db_submission = db_submissions[0]

    for answer in submission_in.answers:
        db_answer: Answer = db_submission.find_answer_index_by_question_id(
            answer.question_id)

        if not db_answer:
            session.add(
                Answer(
                    question_id=answer.question_id,
                    response_index=answer.response_index,
                    submission=db_submission
                )
            )

        elif db_answer.response_index != answer.response_index:
            db_answer.response_index = answer.response_index
            session.add(db_answer)
    
    session.commit()
    session.refresh(db_submission)

    return db_submission
