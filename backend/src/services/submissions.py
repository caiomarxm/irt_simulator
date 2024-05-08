from fastapi import HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional

from services.submissions_result import SubmissionsResultService
from models import (
    SubmissionCreateOrUpdateResult,
    SubmissionIn,
    Submission,
    Question,
    Answer,
    Exam,
    User
)
from repositories import (
    questions as questions_repo,
    submissions as submissions_repo
)


class SubmissionsService:

    @staticmethod
    def create_or_update_submission(
        submission_in: SubmissionIn,
        exam: Exam,
        user: User,
        session: Session
    ) -> SubmissionCreateOrUpdateResult:

        db_submission = submissions_repo.read_user_submission_for_year(
            user_id=user.id, year=exam.year, session=session
        )

        if not db_submission:
            submission = submissions_repo.create_submission(
                submission_in=submission_in,
                answers=submission_in.answers,
                user=user,
                exam=exam,
                session=session
            )
            return SubmissionCreateOrUpdateResult(operation='create', submission=submission)

        if db_submission.is_commited:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Trying to overwrite an already comitted submission."
            )

        db_submission.is_commited = submission_in.is_commited

        # TODO: Refactor this loop to extract db logic
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

        return SubmissionCreateOrUpdateResult(operation='update', submission=db_submission)

    @staticmethod
    def commit_all_submissions(year: int, session: Session) -> List[Submission]:
        """Commits every submission for selected year, calculating results"""

        submissions = submissions_repo.read_all_submissions(
            is_superuser=True,
            year=year,
            session=session
        )

        for submission in submissions:
            SubmissionsService.calculate_result_and_commit(
                submission=submission,
                session=session
            )
        
        return submissions

    @staticmethod
    def calculate_result_and_commit(
        session: Session,
        submission_id: Optional[int] = None,
        submission: Optional[Submission] = None,
    ) -> Submission:
        if not submission:
            submission = submissions_repo.read_submission_by_id(
                submission_id=submission_id)
        
        if submission.is_commited and submission.result:
            return submission

        result = SubmissionsService.calculate_result(
            submission=submission, session=session)

        submission.result = result
        submission.is_commited = True

        submission = submissions_repo.update_submission(
            updated_submission=submission, submission=submission, session=session)
        
        return submission

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
