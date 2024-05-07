from sqlmodel import Session, select

from models.exams import Exam, ExamCreate, ExamUpdate


def create_exam(exam: ExamCreate, session: Session) -> Exam:
    exam_in = Exam.model_validate(
        exam
        )

    # TODO: Check if year is valid and if there's already an exam for that year

    session.add(exam_in)
    session.commit()
    session.refresh(exam_in)
    return exam_in


def read_all_exams(session: Session):
    return session.exec(select(Exam)).all()


def read_exam_by_id(exam_id: int, session: Session) -> Exam:
    exam = session.get(Exam, exam_id)
    return exam


def read_exam_by_year(year: int, session: Session) -> Exam:
    exam = session.exec(select(Exam).where(Exam.year == year)).first()
    return exam


def update_exam(updated_exam: ExamUpdate, session: Session, exam: Exam) -> Exam:
    exam_data = updated_exam.model_dump(exclude_unset=True)

    exam.sqlmodel_update(exam_data)

    session.add(exam)
    session.commit()
    session.refresh(exam)
    return exam


def commit_exam(exam: Exam, session: Session) -> Exam:
    exam.is_committed = True
    session.add(exam)
    session.commit()
    session.refresh(exam)
    return exam


def update_exam_by_id(id: int, updated_exam: ExamUpdate, session: Session) -> Exam:
    exam = session.get(Exam, id)
    return update_exam(updated_exam=updated_exam, session=session, exam=exam)


def delete_exam(id: int, session: Session) -> Exam:
    exam = session.get(Exam, id)

    if exam:
        session.delete(exam)
        session.commit()
        return True
    
    return False
