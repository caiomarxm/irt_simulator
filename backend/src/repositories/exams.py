from sqlmodel import Session, select

from models.exams import Exam, ExamCreate, ExamUpdate


def create_exam(exam: ExamCreate, session: Session) -> Exam:
    exam_in = Exam.model_validate(
        exam_in
        )

    session.add(exam_in)
    session.commit()
    session.refresh(exam_in)
    return exam_in


def get_exam_by_id(id: int, session: Session) -> Exam:
    exam = session.get(Exam, id)
    return exam


def get_exam_by_year(year: int, session: Session) -> Exam:
    exam = session.exec(select(Exam).where(Exam.year == year)).first()
    return exam


def update_exam(updated_exam: ExamUpdate, session: Session, exam: Exam) -> Exam:
    exam_data = updated_exam.model_dump(exclude_unset=True)

    exam.sqlmodel_update(exam_data)

    session.add(exam)
    session.commit()
    session.refresh(exam)
    return exam
