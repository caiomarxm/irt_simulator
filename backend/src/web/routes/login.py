from datetime import datetime, timedelta
from typing import Annotated, Any

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from core.deps import InjectSession
from core.settings import settings
from core.security import generate_access_token

from models import JWTReponse

from repositories.user import authenticate


router = APIRouter()

@router.post("/token", response_model=JWTReponse)
def login_with_username_and_password(
        session: InjectSession,
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> JWTReponse:

    user = authenticate(
        email=form_data.username,
        password=form_data.password,
        session=session
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail=f"Incorrect email or password"
        )
    
    elif not user.is_active:
        raise HTTPException(
            status_code=400,
            detail=f"Inactive user"
        )
    
    # GENERATE AUTH TOKEN HERE
    token = generate_access_token(
        subject=user.id,
        expires_delta=settings.ACCESS_TOKEN_DURATION_IN_MINUTES
    )

    return JWTReponse(
        access_token=token
    )
