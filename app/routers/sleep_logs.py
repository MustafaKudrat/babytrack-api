from fastapi import APIRouter, Depends
from app.core.deps import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.sleep_log import SleepLog
from app.schemas.sleep_log import SleepLogCreate, SleepLogOut
from app.models.user import User
from sqlalchemy.future import select

router = APIRouter(prefix="/sleep-logs", tags=["Sleep Logs"])

@router.post("/", response_model=SleepLogOut)
async def create_sleep_log(
    sleep_log: SleepLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_log = SleepLog(**sleep_log.dict(), user_id=current_user.id)
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/", response_model=list[SleepLogOut])
async def get_my_sleep_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(SleepLog).where(SleepLog.user_id == current_user.id))
    return result.scalars().all()
