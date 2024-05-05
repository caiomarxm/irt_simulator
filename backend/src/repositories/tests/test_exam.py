import pytest
from sqlmodel import select, Session

from core.db import engine
from models.exams import (Exam, ExamCreate, ExamUpdate)


def test_model_exam():
    new_exam = ExamCreate(year=2025)
    exam = Exam.model_validate(new_exam)
    assert isinstance(exam, Exam)


def test_db_exam():
    with Session(engine) as session:
        exams = session.exec(select(Exam))
        exam = exams.one()
        if exam:
            assert isinstance(exam, Exam)
