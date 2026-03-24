from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_role
from app.core.database import get_db
from app.models.schemas import CandidateProfileResponse, CandidateProfileUpdate
from app.models.user import User
from app.services import candidate_profile_service

router = APIRouter(prefix="/candidate-profiles", tags=["Perfil Candidato"])


@router.get("/me", response_model=CandidateProfileResponse)
async def get_my_candidate_profile(
    current_user: User = Depends(require_role("user")),
    db: AsyncSession = Depends(get_db),
):
    profile = await candidate_profile_service.get_candidate_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de candidato não encontrado")
    return profile


@router.put("/me", response_model=CandidateProfileResponse)
async def upsert_my_candidate_profile(
    data: CandidateProfileUpdate,
    current_user: User = Depends(require_role("user")),
    db: AsyncSession = Depends(get_db),
):
    return await candidate_profile_service.upsert_candidate_profile(db, current_user.id, data)
