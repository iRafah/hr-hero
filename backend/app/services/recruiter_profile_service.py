from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.schemas import RecruiterProfileUpdate
from app.models.user import RecruiterProfile


async def get_recruiter_profile(db: AsyncSession, user_id: UUID) -> RecruiterProfile | None:
    result = await db.execute(select(RecruiterProfile).where(RecruiterProfile.user_id == user_id))
    return result.scalar_one_or_none()


async def upsert_recruiter_profile(
    db: AsyncSession,
    user_id: UUID,
    data: RecruiterProfileUpdate,
) -> RecruiterProfile:
    profile = await get_recruiter_profile(db, user_id)

    if profile is None:
        profile = RecruiterProfile(user_id=user_id)
        db.add(profile)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile
