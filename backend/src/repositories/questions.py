from typing import List
from sqlmodel import Session, select, func

from models.questions import Question


def read_questions_amount_from_exam_id(exam_id: int, session: Session) -> int:
    statement = select(func.count()).select_from(Question).where(exam_id == exam_id)
    return session.exec(statement=statement).one()


def read_questions_from_exam_id(exam_id: int, session: Session) -> List[Question]:
    statement = select(Question).where(exam_id == exam_id)
    return session.exec(statement=statement).all()
