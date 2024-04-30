from sqlmodel import Session, create_engine, select
from typing import Generator

from core.settings import settings
from models import User, UserCreate


engine = create_engine(str(settings.DATABASE_URI))

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


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
