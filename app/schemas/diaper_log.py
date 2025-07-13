# app/schemas/diaper_log.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DiaperLogBase(BaseModel):
    time: datetime
    type: str  # "wet", "dirty", or "mixed"
    notes: Optional[str] = None

class DiaperLogCreate(DiaperLogBase):
    pass

class DiaperLogOut(DiaperLogBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
