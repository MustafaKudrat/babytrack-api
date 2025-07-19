# app/core/seed_db.py
import asyncio
from app.core.database import async_session
from app.models.user import User
from app.core.utils import get_password_hash
import os

async def seed():
    email = os.getenv("SEED_EMAIL")
    password = os.getenv("SEED_PASSWORD")
    if not email or not password:
        print("No seed credentials provided; skipping user creation")
        return
    async with async_session() as session:
        user = User(email=email, hashed_password=get_password_hash(password))

        session.add(user)
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed())
