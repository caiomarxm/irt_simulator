from sqlmodel import SQLModel, Field
from typing import Optional


class Submission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    is_commited: bool = False
    result: Optional[float]

    user_id: int = Field(foreign_key="user.id")
    exam_id: int = Field(foreign_key="exam.id")
