from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.schemas import (
    EducationCreate,
    EducationResponse,
    ExperienceCreate,
    ExperienceResponse,
    ProfileResponse,
    ProfileUpdate,
    UserResponse,
    UserWithProfileResponse,
)
from app.models.user import User
from app.services.profile_service import (
    add_education,
    add_experience,
    delete_education,
    delete_experience,
    get_profile,
    update_profile,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserWithProfileResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await get_profile(db, current_user.id)
    user_dict = {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at,
        "profile": profile,
    }
    return user_dict


@router.get("/me/profile", response_model=ProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil não encontrado")
    return profile


@router.put("/me/profile", response_model=ProfileResponse)
async def update_my_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        profile = await update_profile(db, current_user.id, data)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))
    return profile


@router.post("/me/experiences", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    data: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        experience = await add_experience(db, current_user.id, data)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))
    return experience


@router.delete("/me/experiences/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_experience(
    experience_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        await delete_experience(db, current_user.id, experience_id)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.post("/me/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def create_education(
    data: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        education = await add_education(db, current_user.id, data)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))
    return education


@router.delete("/me/education/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_education(
    education_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        await delete_education(db, current_user.id, education_id)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))
