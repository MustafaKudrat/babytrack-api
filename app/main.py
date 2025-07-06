from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "BabyTrack API is running 🚼"}
