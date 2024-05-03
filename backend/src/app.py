from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from web.routes.api_router import api_router
from web.middleware.cors import CORS_CONFIG


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    **CORS_CONFIG
)

app.include_router(api_router)
