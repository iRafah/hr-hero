from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.email_service import send_verification_email
from app.core.security import (
    create_access_token,
    generate_verification_token,
    hash_password,
    verify_password,
)
from app.models.schemas import UserCreate
from app.models.user import User, UserProfile


async def register_user(db: AsyncSession, user_data: UserCreate) -> User:
    existing = await db.execute(select(User).where(User.email == user_data.email))
    if existing.scalar_one_or_none():
        raise ValueError("Este email já está em uso. Use outro, por favor.")

    verification_token = generate_verification_token()

    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name,
        verification_token=verification_token,
    )
    db.add(user)
    await db.flush()

    profile = UserProfile(user_id=user.id)
    db.add(profile)

    await db.commit()
    await db.refresh(user)

    await send_verification_email(user.email, user.full_name, verification_token)

    return user


async def login_user(db: AsyncSession, email: str, password: str) -> tuple[User, str]:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.hashed_password):
        raise ValueError("Email ou senha incorretos")

    if not user.is_active:
        raise ValueError("Conta desativada. Entre em contato com o suporte.")

    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role}
    )

    return user, token


async def verify_email(db: AsyncSession, token: str) -> User:
    result = await db.execute(select(User).where(User.verification_token == token))
    user = result.scalar_one_or_none()

    if not user:
        raise ValueError("Token inválido ou expirado")

    user.is_verified = True
    user.verification_token = None
    await db.commit()
    await db.refresh(user)

    return user


async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    return await db.get(User, user_id)
