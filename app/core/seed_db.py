# app/core/seed_db.py
import asyncio
from app.core.database import async_session
from app.models.user import User
from app.core.utils import get_password_hash

async def seed():
    async with async_session() as session:
        user = User(
            email="mu@gmail.com",
            hashed_password=get_password_hash("Ku")
        )
        session.add(user)
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed())
