from sqlmodel import Session
from typing import List, Any

from services.submissions_result import SubmissionsResultService
from models import (
    Submission,
    Question,
    Answer
)
from repositories import (
    questions as questions_repo
)


class SubmissionsService:

    @staticmethod
    def calculate_result(submission: Submission, session: Session):
        answers = submission.answers
        exam_questions_amount = questions_repo.read_questions_amount_from_exam_id(
            submission.exam_id, session=session)

        if len(answers) < exam_questions_amount:
            exam_questions = submission.exam.questions \
                if submission.exam \
                else questions_repo.read_questions_from_exam_id(exam_id=submission.exam_id, session=session)

            submission.answers = SubmissionsService._fill_with_dummy_answers(
                answers, exam_questions
            )

        return SubmissionsResultService.calculate_submission_result(submission)

    @staticmethod
    def _fill_with_dummy_answers(db_answers: List[Answer], db_questions: List[Question]) -> List[Answer]:
        def question_is_missing(question: Question):
            return question.id not in map(lambda answer: answer.question_id, db_answers)

        for question in filter(question_is_missing, db_questions):
            db_answers.append(
                SubmissionsService._generate_dummy_answer(question=question)
            )

        return db_answers

    @staticmethod
    def _generate_dummy_answer(question: Question):
        response_index = -1
        return Answer(response_index=response_index, question=question, submission_id=-1)
