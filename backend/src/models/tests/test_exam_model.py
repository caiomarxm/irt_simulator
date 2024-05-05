from models.exams import (Exam, ExamCreate, ExamUpdate)


def test_model_exam():
    new_exam = ExamCreate(year=2025)
    exam = Exam.model_validate(new_exam)
    assert isinstance(exam, Exam)