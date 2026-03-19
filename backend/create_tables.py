"""
Development helper — creates all database tables.
Run once before starting the server:  python create_tables.py

For production, use Alembic migrations instead.
"""
import asyncio

from app.core.database import Base, engine

# noqa: F401 — import models so SQLAlchemy registers them
import app.models.user  # noqa: F401


async def create_all() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✓ All tables created successfully.")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(create_all())
