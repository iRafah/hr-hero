from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_role
from app.core.database import get_db
from app.models.schemas import RecruiterProfileResponse, RecruiterProfileUpdate
from app.models.user import User
from app.services import recruiter_profile_service

router = APIRouter(prefix="/recruiter-profiles", tags=["Perfil Recrutador"])


@router.get("/me", response_model=RecruiterProfileResponse)
async def get_my_recruiter_profile(
    current_user: User = Depends(require_role("recruiter")),
    db: AsyncSession = Depends(get_db),
):
    profile = await recruiter_profile_service.get_recruiter_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de recrutador não encontrado")
    return profile


@router.put("/me", response_model=RecruiterProfileResponse)
async def upsert_my_recruiter_profile(
    data: RecruiterProfileUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: AsyncSession = Depends(get_db),
):
    return await recruiter_profile_service.upsert_recruiter_profile(db, current_user.id, data)
