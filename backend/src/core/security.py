from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError
from pydantic import ValidationError

from core.settings import settings


ALGORITHM = "HS256"

pwd_encrypter = CryptContext(schemes=['bcrypt'], deprecated="auto")


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
