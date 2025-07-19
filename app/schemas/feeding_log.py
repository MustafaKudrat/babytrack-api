from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FeedingLogBase(BaseModel):
    start_time: datetime
    end_time: datetime
    food_type: Optional[str] = None
    amount: Optional[str] = None
    notes: Optional[str] = None

class FeedingLogCreate(FeedingLogBase):
    pass

class FeedingLogOut(FeedingLogBase):
    id: int
    class Config:
        orm_mode = True
