from http import HTTPStatus
from fastapi import HTTPException, Response
from fastapi.routing import APIRouter
from typing import List, Optional

from core.deps import InjectCurrentUser, InjectSession
from repositories.exams import (
    get_all_exams,
    get_exam_by_id,
    get_exam_by_year
)
from models.exams import (
    Exam,
    ExamOut,
    ExamCommited
)


router = APIRouter()

@router.get('', response_model=List[Exam]|Exam|ExamOut|ExamCommited)
def read_all_exams(*, session: InjectSession, user: InjectCurrentUser, year: Optional[int] = None, include_questions: bool = False):
    if not year:
        return get_all_exams(session=session)
    
    exam = get_exam_by_year(year=year, session=session)

    if not exam:
        return Response(status_code=HTTPStatus.NO_CONTENT)
    
    if include_questions and not exam.is_committed:
        exam = ExamOut.model_validate(exam)
    
    if exam.is_committed:
        exam = ExamCommited.model_validate(exam)

    return exam


@router.get('/{id}', response_model=ExamOut|Exam)
def read_exam_by_id(id:int, *, session: InjectSession, user: InjectCurrentUser, include_questions: Optional[bool] = False):
    exam = get_exam_by_id(id=id, session=session)

    if include_questions:
        return ExamOut.model_validate(exam)

    return exam
