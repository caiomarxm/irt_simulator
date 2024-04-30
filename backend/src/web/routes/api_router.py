from fastapi.routing import APIRouter

from web.routes import health


api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
