from sqlmodel import SQLModel

from typing import Optional


class JWTReponse(SQLModel):
    access_token: str
    token_type: str = "Bearer"


class JWTPayload(SQLModel):
    """Defines the inner content of the JWT"""
    sub: Optional[int] = None
