from fastapi import FastAPI
from app.routers import auth, users, sleep_logs, feeding_logs, diaper_logs, ai_summary

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(sleep_logs.router)
app.include_router(feeding_logs.router)
app.include_router(diaper_logs.router)

# OpenAI
app.include_router(ai_summary.router)


@app.get("/")
def root():
    return {"message": "BabyTrack API is running 🚼"}
