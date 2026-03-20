from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.schemas import EducationCreate, ExperienceCreate, ProfileUpdate, UserUpdate
from app.models.user import User, UserEducation, UserExperience, UserProfile


async def get_profile(db: AsyncSession, user_id: UUID) -> UserProfile | None:
    result = await db.execute(
        select(UserProfile)
        .where(UserProfile.user_id == user_id)
        .options(
            selectinload(UserProfile.experiences),
            selectinload(UserProfile.education),
        )
    )
    return result.scalar_one_or_none()


async def update_profile(
    db: AsyncSession, user_id: UUID, data: ProfileUpdate
) -> UserProfile:
    profile = await get_profile(db, user_id)
    if not profile:
        raise ValueError("Perfil não encontrado")

    update_fields = data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile


async def add_experience(
    db: AsyncSession, user_id: UUID, data: ExperienceCreate
) -> UserExperience:
    profile = await get_profile(db, user_id)
    if not profile:
        raise ValueError("Perfil não encontrado")

    experience = UserExperience(profile_id=profile.id, **data.model_dump())
    db.add(experience)
    await db.commit()
    await db.refresh(experience)
    return experience


async def delete_experience(
    db: AsyncSession, user_id: UUID, experience_id: UUID
) -> None:
    profile = await get_profile(db, user_id)
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
    profile = await get_profile(db, user_id)
    if not profile:
        raise ValueError("Perfil não encontrado")

    education = UserEducation(profile_id=profile.id, **data.model_dump())
    db.add(education)
    await db.commit()
    await db.refresh(education)
    return education


async def update_user(db: AsyncSession, user_id: UUID, data: UserUpdate) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise ValueError("Usuário não encontrado")

    user.full_name = data.full_name
    await db.commit()
    await db.refresh(user)
    return user


async def delete_education(
    db: AsyncSession, user_id: UUID, education_id: UUID
) -> None:
    profile = await get_profile(db, user_id)
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
