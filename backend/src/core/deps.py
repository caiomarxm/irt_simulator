from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from typing import Generator, Annotated

from models.token import JWTPayload
from jose import jwt, JWTError
from pydantic import ValidationError

from core import security
from core.db import engine
from core.settings import settings

from models.user import User


def get_session() -> Generator[Session, None, None]:
    """Retrieves a db session"""
    with Session(engine) as session:
        yield session

InjectSession = Annotated[Session, Depends(get_session)]


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_URL}/login/access-token"
)

InjectJWT = Annotated[str, Depends(reusable_oauth2)]


def get_current_user_from_token(session: InjectSession, token: InjectJWT) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = JWTPayload(**payload)

    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=403,
            detail="Could not validate credentials",
        )

    user = session.get(User, token_data.sub)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user

InjectCurrentUser = Annotated[User, Depends(get_current_user_from_token)]


def get_current_user_superuser(user: InjectCurrentUser):
    if not user.is_superuser:
        raise HTTPException(status_code=401, detail="You're not allowed on this route.")
    
    return user

InjectIsSuperuser = Annotated[User, Depends(get_current_user_superuser)]
