from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.schemas import CandidateProfileUpdate, EducationCreate, ExperienceCreate
from app.models.user import CandidateProfile, UserEducation, UserExperience


async def get_candidate_profile(db: AsyncSession, user_id: UUID) -> CandidateProfile | None:
    result = await db.execute(
        select(CandidateProfile)
        .where(CandidateProfile.user_id == user_id)
        .options(
            selectinload(CandidateProfile.experiences),
            selectinload(CandidateProfile.education),
        )
    )
    return result.scalar_one_or_none()


async def upsert_candidate_profile(
    db: AsyncSession,
    user_id: UUID,
    data: CandidateProfileUpdate,
) -> CandidateProfile:
    profile = await get_candidate_profile(db, user_id)

    if profile is None:
        profile = CandidateProfile(user_id=user_id)
        db.add(profile)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    await db.commit()
    return await get_candidate_profile(db, user_id)


async def add_experience(
    db: AsyncSession, user_id: UUID, data: ExperienceCreate
) -> UserExperience:
    profile = await get_candidate_profile(db, user_id)
    if profile is None:
        profile = CandidateProfile(user_id=user_id)
        db.add(profile)
        await db.flush()

    experience = UserExperience(profile_id=profile.id, **data.model_dump())
    db.add(experience)
    await db.commit()
    await db.refresh(experience)
    return experience


async def delete_experience(
    db: AsyncSession, user_id: UUID, experience_id: UUID
) -> None:
    profile = await get_candidate_profile(db, user_id)
    if not profile:
        raise ValueError("Perfil não encontrado")

    result = await db.execute(
        select(UserExperience).where(
            UserExperience.id == experience_id,
            UserExperience.profile_id == profile.id,
        )
    )
    experience = result.scalar_one_or_none()
    if not experience:
        raise ValueError("Experiência não encontrada")

    await db.delete(experience)
    await db.commit()


async def add_education(
    db: AsyncSession, user_id: UUID, data: EducationCreate
) -> UserEducation:
    profile = await get_candidate_profile(db, user_id)
    if profile is None:
        profile = CandidateProfile(user_id=user_id)
        db.add(profile)
        await db.flush()

    education = UserEducation(profile_id=profile.id, **data.model_dump())
    db.add(education)
    await db.commit()
    await db.refresh(education)
    return education


async def delete_education(
    db: AsyncSession, user_id: UUID, education_id: UUID
) -> None:
    profile = await get_candidate_profile(db, user_id)
    if not profile:
        raise ValueError("Perfil não encontrado")

    result = await db.execute(
        select(UserEducation).where(
            UserEducation.id == education_id,
            UserEducation.profile_id == profile.id,
        )
    )
    education = result.scalar_one_or_none()
    if not education:
        raise ValueError("Educação não encontrada")

    await db.delete(education)
    await db.commit()
