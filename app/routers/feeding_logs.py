from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.feeding_log import FeedingLog
from app.schemas.feeding_log import FeedingLogCreate, FeedingLogOut
from app.models.user import User
from sqlalchemy.future import select
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/feeding-logs", tags=["Feeding Logs"])

@router.post("/", response_model=FeedingLogOut)
async def create_feeding_log(
    log: FeedingLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_log = FeedingLog(**log.dict(), user_id=current_user.id)
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/", response_model=list[FeedingLogOut])
async def get_feeding_logs(
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(FeedingLog).where(FeedingLog.user_id == current_user.id)

    if start_time:
        query = query.where(FeedingLog.start_time >= start_time)
    if end_time:
        query = query.where(FeedingLog.end_time <= end_time)

    result = await db.execute(query)

    return result.scalars().all()

@router.put("/{log_id}", response_model=FeedingLogOut)
async def update_feeding_log(
    log_id: int,
    updated_log: FeedingLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(FeedingLog).where(FeedingLog.id == log_id, FeedingLog.user_id == current_user.id))
    feeding_log = result.scalar_one_or_none()

    if not feeding_log:
        raise HTTPException(status_code=404, detail="Feeding log not found")

    for key, value in updated_log.dict().items():
        setattr(feeding_log, key, value)

    await db.commit()
    await db.refresh(feeding_log)
    return feeding_log


@router.delete("/{log_id}")
async def delete_feeding_log(
    log_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(FeedingLog).where(FeedingLog.id == log_id, FeedingLog.user_id == current_user.id))
    feeding_log = result.scalar_one_or_none()

    if not feeding_log:
        raise HTTPException(status_code=404, detail="Feeding log not found")

    await db.delete(feeding_log)
    await db.commit()
    return {"detail": "Feeding log deleted"}