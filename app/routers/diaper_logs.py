from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.diaper_log import DiaperLog
from app.schemas.diaper_log import DiaperLogCreate, DiaperLogOut
from app.models.user import User
from sqlalchemy.future import select
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/diaper-logs", tags=["Diaper Logs"])

@router.post("/", response_model=DiaperLogOut)
async def create_diaper_log(
    log: DiaperLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_log = DiaperLog(**log.dict(), user_id=current_user.id)
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/", response_model=list[DiaperLogOut])
async def get_diaper_logs(
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(DiaperLog).where(DiaperLog.user_id == current_user.id)

    if start_time:
        query = query.where(DiaperLog.time >= start_time)
    if end_time:
        query = query.where(DiaperLog.time <= end_time)

    result = await db.execute(query)

    return result.scalars().all()

@router.put("/{log_id}", response_model=DiaperLogOut)
async def update_diaper_log(
    log_id: int,
    updated_log: DiaperLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(DiaperLog).where(DiaperLog.id == log_id, DiaperLog.user_id == current_user.id))
    diaper_log = result.scalar_one_or_none()

    if not diaper_log:
        raise HTTPException(status_code=404, detail="Diaper log not found")

    for key, value in updated_log.dict().items():
        setattr(diaper_log, key, value)

    await db.commit()
    await db.refresh(diaper_log)
    return diaper_log


@router.delete("/{log_id}")
async def delete_diaper_log(
    log_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(DiaperLog).where(DiaperLog.id == log_id, DiaperLog.user_id == current_user.id))
    diaper_log = result.scalar_one_or_none()

    if not diaper_log:
        raise HTTPException(status_code=404, detail="Diaper log not found")

    await db.delete(diaper_log)
    await db.commit()
    return {"detail": "Diaper log deleted"}
