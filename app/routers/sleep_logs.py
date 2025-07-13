from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.sleep_log import SleepLog
from app.schemas.sleep_log import SleepLogCreate, SleepLogOut
from app.models.user import User
from sqlalchemy.future import select
from datetime import datetime
from typing import Optional

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
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(SleepLog).where(SleepLog.user_id == current_user.id)

    if start_time:
        query = query.where(SleepLog.start_time >= start_time)
    if end_time:
        query = query.where(SleepLog.end_time <= end_time)

    result = await db.execute(query)
    return result.scalars().all()

@router.put("/{log_id}", response_model=SleepLogOut)
async def update_sleep_log(
    log_id: int,
    updated_log: SleepLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(SleepLog).where(SleepLog.id == log_id, SleepLog.user_id == current_user.id))
    sleep_log = result.scalar_one_or_none()

    if not sleep_log:
        raise HTTPException(status_code=404, detail="Sleep log not found")

    for key, value in updated_log.dict().items():
        setattr(sleep_log, key, value)

    await db.commit()
    await db.refresh(sleep_log)
    return sleep_log


@router.delete("/{log_id}")
async def delete_sleep_log(
    log_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(SleepLog).where(SleepLog.id == log_id, SleepLog.user_id == current_user.id))
    sleep_log = result.scalar_one_or_none()

    if not sleep_log:
        raise HTTPException(status_code=404, detail="Sleep log not found")

    await db.delete(sleep_log)
    await db.commit()
    return {"detail": "Sleep log deleted"}