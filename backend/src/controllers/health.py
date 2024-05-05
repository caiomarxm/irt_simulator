from fastapi.routing import APIRouter


router = APIRouter()

@router.get('')
def get_health():
    return "Running"
