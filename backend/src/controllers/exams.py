from fastapi import HTTPException, Response, status
from fastapi.routing import APIRouter
from typing import List, Optional

from core.deps import InjectCurrentUser, InjectIsSuperuser, InjectSession
from repositories import exams as exams_repo
from repositories import submissions as submissions_repo
from models.exams import (
    Exam,
    ExamOut,
    ExamCommited,
    ExamUpdate
)
from services.submissions import SubmissionsService


router = APIRouter()


@router.get('', response_model=List[Exam] | Exam | ExamOut | ExamCommited)
def get_all_exams(*, session: InjectSession, user: InjectCurrentUser, year: Optional[int] = None, include_questions: bool = False):
    if not year:
        return exams_repo.read_all_exams(session=session)

    exam = exams_repo.read_exam_by_year(year=year, session=session)

    if not exam:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    if include_questions and not exam.is_committed:
        exam = ExamOut.model_validate(exam)

    if exam.is_committed:
        exam = ExamCommited.model_validate(exam)

    return exam


@router.get('/{exam_id}', response_model=ExamOut | Exam)
def get_exam_by_id(exam_id: int, *, session: InjectSession, user: InjectCurrentUser, include_questions: Optional[bool] = False):
    exam = exams_repo.read_exam_by_id(exam_id=exam_id, session=session)

    if include_questions:
        return ExamOut.model_validate(exam)

    return exam


@router.put('/{exam_id}', response_model=Exam)
def update_exam(exam_id: int, exam_update: ExamUpdate, session: InjectSession, user: InjectIsSuperuser):
    db_exam = exams_repo.read_exam_by_id(exam_id=exam_id, session=session)

    if not db_exam:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail=f"No exam with id {exam_id} was found"
        )

    if not db_exam.is_closed:
        if exam_update.is_committed and not exam_update.is_closed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot commit an ongoing exam, you must close it first"
            )

    db_exam = exams_repo.update_exam(
        updated_exam=exam_update, session=session, exam=db_exam)
    return db_exam


@router.post('/{id}/calculate-results')
def calculate_all_submissions_results(
    *,
    id: int,
    user: InjectIsSuperuser,
    session: InjectSession
):
    exam = exams_repo.read_exam_by_id(id, session=session)

    if not exam:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No exam were found with id {id}"
        )

    if not exam.is_closed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot calculate results for ongoing exam. Must close exam first"
        )

    if exam.is_committed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Exam already commited"
        )

    submissions = submissions_repo.read_all_submissions(
        year=exam.year,
        user_id=user.id,
        is_superuser=user.is_superuser,
        session=session
    )

    for submission in submissions:
        submission.result = SubmissionsService.calculate_result(
            submission=submission, session=session)

    submissions = submissions_repo.update_multiple_submissions(
        updated_submission_list=submissions, session=session)
    return submissions
