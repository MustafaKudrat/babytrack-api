# app/core/init_db.py
import asyncio
from app.core.database import Base, engine

# force registration of both models
import app.models  # <-- THIS triggers all models to be registered

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init())
