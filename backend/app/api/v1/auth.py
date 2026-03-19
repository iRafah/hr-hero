from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.schemas import TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import login_user, register_user, verify_email

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        user = await register_user(db, user_data)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    return user


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    try:
        user, token = await login_user(db, credentials.email, credentials.password)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(error))

    return TokenResponse(access_token=token, user=user)


@router.get("/verificar-email", response_model=UserResponse)
async def verify_email_endpoint(token: str, db: AsyncSession = Depends(get_db)):
    try:
        user = await verify_email(db, token)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    return user
