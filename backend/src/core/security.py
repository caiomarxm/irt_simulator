from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError
from pydantic import ValidationError

from core.settings import settings
from models.token import JWTPayload
from core.deps import InjectSession
from models.user import User


ALGORITHM = "HS256"

pwd_encrypter = CryptContext(schemes=['bcrypt'], deprecated="auto")


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

InjectJWT = Annotated[str, Depends(reusable_oauth2)]


def hash_password(password: str) -> str:
    return pwd_encrypter.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_encrypter.verify(password, hashed_password)


def generate_access_token(
        subject: str,
        expires_delta: timedelta
) -> None:
    expire = datetime.now() + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user_from_token(session: InjectSession, token: InjectJWT) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
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
