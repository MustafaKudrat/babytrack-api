from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SleepLogBase(BaseModel):
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None

class SleepLogCreate(SleepLogBase):
    pass

class SleepLogOut(SleepLogBase):
    id: int

    class Config:
        from_attributes = True

