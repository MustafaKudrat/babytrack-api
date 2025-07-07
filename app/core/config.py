from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./babytrack.db"

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return self.DATABASE_URL

    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"

settings = Settings()
