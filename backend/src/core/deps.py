from fastapi import Depends
from sqlmodel import Session
from typing import Generator, Annotated

from core.db import engine


def get_session() -> Generator[Session, None, None]:
    """Retrieves a db session"""
    with Session(engine) as session:
        yield session

InjectSession = Annotated[Session, Depends(get_session)]
