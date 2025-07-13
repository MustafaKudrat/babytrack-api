from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.deps import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.sleep_log import SleepLog
from app.models.feeding_log import FeedingLog
from app.models.diaper_log import DiaperLog
from sqlalchemy.future import select
from app.core.config import settings
import openai
import datetime

router = APIRouter(prefix="/ai", tags=["AI Summary"])

openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

@router.post("/summary")
async def generate_summary(
    date: datetime.date = Query(None, description="Optional date filter in YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Time range filtering
        if date:
            start = datetime.datetime.combine(date, datetime.time.min)
            end = datetime.datetime.combine(date, datetime.time.max)

            sleep_result = await db.execute(
                select(SleepLog).where(
                    SleepLog.user_id == current_user.id,
                    SleepLog.start_time >= start,
                    SleepLog.start_time <= end
                )
            )
            feeding_result = await db.execute(
                select(FeedingLog).where(
                    FeedingLog.user_id == current_user.id,
                    FeedingLog.start_time >= start,
                    FeedingLog.start_time <= end
                )
            )
            diaper_result = await db.execute(
                select(DiaperLog).where(
                    DiaperLog.user_id == current_user.id,
                    DiaperLog.time >= start,
                    DiaperLog.time <= end
                )
            )
        else:
            sleep_result = await db.execute(select(SleepLog).where(SleepLog.user_id == current_user.id))
            feeding_result = await db.execute(select(FeedingLog).where(FeedingLog.user_id == current_user.id))
            diaper_result = await db.execute(select(DiaperLog).where(DiaperLog.user_id == current_user.id))

        sleep_logs = sleep_result.scalars().all()
        feeding_logs = feeding_result.scalars().all()
        diaper_logs = diaper_result.scalars().all()

        def format_sleep(log):
            return f"Sleep from {log.start_time} to {log.end_time} ({log.notes or 'no notes'})"

        def format_feed(log):
            return f"Fed {log.amount} of {log.food_type} from {log.start_time} to {log.end_time} ({log.notes or 'no notes'})"

        def format_diaper(log):
            return f"{log.type} diaper at {log.time} ({log.notes or 'no notes'})"

        sleep_text = "\n".join([format_sleep(l) for l in sleep_logs]) or "No sleep logs."
        feed_text = "\n".join([format_feed(l) for l in feeding_logs]) or "No feeding logs."
        diaper_text = "\n".join([format_diaper(l) for l in diaper_logs]) or "No diaper logs."

        system_prompt = "You are a helpful assistant that summarizes baby care logs for parents."
        user_prompt = f"""Summarize the following baby logs:

Sleep Logs:
{sleep_text}

Feeding Logs:
{feed_text}

Diaper Logs:
{diaper_text}
"""

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        return {"summary": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")
