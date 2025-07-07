from fastapi import FastAPI
from app.routers import auth, users, sleep_logs

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(sleep_logs.router)

@app.get("/")
def root():
    return {"message": "BabyTrack API is running 🚼"}
