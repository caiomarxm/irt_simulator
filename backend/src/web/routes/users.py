from fastapi.routing import APIRouter

from models.user import (
    User,
    UserCreate,
    UserUpdate
)


router = APIRouter()


def list_users():
    ...


def get_user_by_id(id: int):
    ...


def create_user():
    ...
