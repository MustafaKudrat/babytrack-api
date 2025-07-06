from app.core.database import SessionLocal
from app.models.user import User  # adjust if your User model is elsewhere
import asyncio

async def seed():
    async with SessionLocal() as session:
        user = User(email="mustafakudrat@gmail.com", hashed_password="Kusan0115!")
        session.add(user)
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed())