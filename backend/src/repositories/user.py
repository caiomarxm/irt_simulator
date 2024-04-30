from sqlmodel import Session
from core.security import hash_password

from models.user import (
    User,
    UserBase,
    UserCreate,
    UserUpdate
)


def create_user(user_in: UserCreate, session: Session) -> None:
    user_in = User.model_validate(
        user_in, update={"hashed_password": hash_password(password=user_in.password)}
        )
    session.add(user_in)
    session.commit()
    session.refresh(user_in)
    return user_in
