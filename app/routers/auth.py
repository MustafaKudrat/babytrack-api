from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.core.utils import verify_password
from app.core.auth import create_access_token
from app.core.database import get_db
from pydantic import BaseModel

router = APIRouter(tags=["Auth"])

class LoginForm(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(data: LoginForm, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}