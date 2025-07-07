# app/core/seed_db.py
import asyncio
from app.core.database import async_session
from app.models.user import User
from app.core.utils import get_password_hash

async def seed():
    async with async_session() as session:
        user = User(
            email="mustafakudrat@gmail.com",
            hashed_password=get_password_hash("Kusan0115!")
        )
        session.add(user)
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed())
