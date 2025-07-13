# app/models/diaper_log.py
from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class DiaperLog(Base):
    __tablename__ = "diaper_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    time = Column(DateTime, nullable=False)
    type = Column(String, nullable=False)  # e.g., "wet", "dirty", or "mixed"
    notes = Column(String)

    user = relationship("User", back_populates="diaper_logs")
