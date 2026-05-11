from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Data Storytelling API"
    XAI_API_KEY: str = ""
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175", "http://127.0.0.1:5175"]
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"  # To prevent ValidationErrors if extra variables are in .env

settings = Settings()