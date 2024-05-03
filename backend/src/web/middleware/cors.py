from fastapi.middleware.cors import CORSMiddleware

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174"
]

CORS_CONFIG = {
    "allow_origins": allowed_origins,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"]
}
