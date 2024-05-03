from fastapi.routing import APIRouter

from web.routes import (
    health,
    login
    )


api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(login.router, prefix="/login", tags=["login"])
