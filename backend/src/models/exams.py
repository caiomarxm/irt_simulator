from sqlmodel import SQLModel, Field
from typing import Optional


class Exam(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    year: int
    is_closed: bool = True
    is_committed: bool = False
