from sqlmodel import Session
from typing import Optional

from repositories import (
    exams as exams_repo
)
from models.exams import (
    Exam
)
from services.submissions import SubmissionsService


class ExamsSevice:

    @staticmethod
    def commit_exam_and_calculate_results(
        exam_id: int,
        session: Session
    ) -> Exam:
        """Commits the exam and calculate all submissions results"""
        exam = exams_repo.read_exam_by_id(exam_id=exam_id, session=session)

        submissions = SubmissionsService.commit_all_submissions(
            year=exam.year, session=session)

        exam.submissions = submissions

        exam = ExamsSevice.commit_exam(exam, session)

        return exam

    @staticmethod
    def commit_exam(exam: Exam, session: Session) -> Exam:
        """Commits the exam, closing it if necessary"""
        exam = exams_repo.commit_exam(exam=exam, session=session)
        return exam
