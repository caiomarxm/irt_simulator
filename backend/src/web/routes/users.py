from fastapi.routing import APIRouter

from core.deps import InjectCurrentUser

from models.user import (
    User,
    UserCreate,
    UserUpdate,
    UserPublic
)


router = APIRouter()


def list_users():
    ...


def get_user_by_id(id: int):
    ...


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: InjectCurrentUser):
    return current_user


def create_user():
    ...
