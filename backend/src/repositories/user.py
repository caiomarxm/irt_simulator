from sqlmodel import Session, select
from core.security import hash_password, verify_password

from models.user import (
    User,
    UserCreate,
    UserUpdate
)


def create_user(user_in: UserCreate, session: Session) -> User:
    user_in = User.model_validate(
        user_in, update={"hashed_password": hash_password(password=user_in.password)}
        )

    session.add(user_in)
    session.commit()
    session.refresh(user_in)
    return user_in


def update_user(updated_user: UserUpdate, session: Session, user: User) -> User:
    user_data = updated_user.model_dump(exclude_unset=True)
    extra_data = {}

    if "password" in user_data:
        password = user_data.get("password")
        hashed_password = hash_password(password)
        extra_data["hashed_password"] = hashed_password

    user.sqlmodel_update(user_data, update=extra_data)

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_user_by_email(email: str, session: Session) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(email: str, password: str, session: Session) -> User | None:
    user = get_user_by_email(session=session, email=email)

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user
