from fastapi import Depends
from fastapi.routing import APIRouter

from core.deps import get_current_user_from_token
from controllers import (
    health,
    login,
    users,
    exams,
    submissions
)


api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(exams.router, prefix="/exams", tags=["exams"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
