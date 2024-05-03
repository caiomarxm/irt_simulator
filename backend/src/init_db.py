import logging
from sqlmodel import Session, select

from core.db import engine
from core.settings import settings

from models.user import User, UserCreate

from repositories.user import create_user


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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


def init() -> None:
    with Session(engine) as session:
        logger.info(f"Creating db...")
        init_db(session=session)
        logger.info(f"Db created")


if __name__ == "__main__":
    init()
