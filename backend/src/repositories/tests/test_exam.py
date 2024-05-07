import pytest
from sqlmodel import select, Session, text

from core.db import engine
from models.exams import (Exam, ExamCreate, ExamUpdate)
from repositories.exams import (
    read_exam_by_id,
    read_exam_by_year,
    update_exam_by_id
    )


def test_get_exam_by_id():
    with Session(engine) as session:
        exam = read_exam_by_id(1, session=session)
        assert isinstance(exam, (Exam, None))


def test_get_exam_by_year():
    with Session(engine) as session:
        exam = read_exam_by_year(2024, session=session)
        assert isinstance(exam, (Exam, None))


def test_update_exam():
    with Session(engine) as session:
        exam_update = ExamUpdate(is_closed=False)
        exam = update_exam_by_id(1, exam_update, session)
        assert exam.is_closed == False

        exam_update.is_closed = True
        exam = update_exam_by_id(1, exam_update, session)
        assert exam.is_closed == True
