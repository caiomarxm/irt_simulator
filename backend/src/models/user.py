from sqlmodel import SQLModel, Field
from typing import Optional, Any


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str
    is_active: bool = True
    is_superuser: bool = False


# Properties to receive on user creation
class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    email: Optional[str] = None
    hashed_password: Optional[str] = None


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: Optional[str] = None


class UserPublic(UserBase):
    id: int
