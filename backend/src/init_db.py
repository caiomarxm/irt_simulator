import json
import logging
from sqlmodel import Session, select

from core.db import engine
from core.settings import settings

from models import *
from models.user import User, UserCreate

from repositories.user import create_user


SAMPLE_EXAM_FILE = '../sample/exam.json'
SAMPLE_USERS_FILE = '../sample/users.json'


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("init_db")

def init_db(session: Session) -> None:
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)

    first_user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL)
    ).first()

    if not first_user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER_EMAIL,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            full_name="Admin User",
            is_superuser=True
        )

        # TO-DO: create user
        create_user(user_in=user_in, session=session)


def create_users(session: Session):
    with open(SAMPLE_USERS_FILE) as file:
        users_dict = json.load(file)
        for user_dict in users_dict:
            try:
                user = UserCreate(**user_dict)
                create_user(user_in=user, session=session)
            except ValueError:
                pass


def create_first_exam(session: Session):
    with open(SAMPLE_EXAM_FILE, 'r') as sample_exam_file:
        sample_exam_dict = json.load(sample_exam_file).get('exam')

        sample_exam = Exam(year=sample_exam_dict.get('year'))
        db_exam = session.exec(select(Exam).where(Exam.year == sample_exam.year)).first()

        if not db_exam:
            session.add(sample_exam)
            session.commit()
            session.refresh(sample_exam)
        else:
            sample_exam.id = db_exam.id

        db_questions = session.exec(select(Question).where(Question.exam_id == sample_exam.id)).all()

        if len(db_questions) == 0:
            # If there are no questions for current exam, create sample questions
            sample_questions = []
            for sample_question_dict in sample_exam_dict.get('questions'):
                sample_question_dict['exam_id'] = sample_exam.id
                sample_questions.append(Question.model_validate(sample_question_dict))
            
            session.add_all(sample_questions)
            session.commit()
        
        # CREATING SUBMISSIONS
        db_submission = session.exec(select(Submission).where(Submission.exam_id == sample_exam.id)).first()

        if not db_submission:
            submissions = sample_exam_dict.get('submissions')
            for submission_dict in submissions:
                submission = Submission(user_id=submission_dict.get('user_id'), exam_id=submission_dict.get('exam_id'))
                session.add(submission)

                submission_answers = submission_dict.get('answers')
                for answer_dict in submission_answers:
                    answer = Answer(**answer_dict, submission=submission)
                    session.add(answer)
                session.commit()
    
    return True


def init() -> None:
    with Session(engine) as session:
        logger.info(f"Creating db...")
        init_db(session=session)
        create_users(session=session)
        create_first_exam(session=session)
        logger.info(f"Db created")


if __name__ == "__main__":
    init()
