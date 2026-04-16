from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Data Storytelling API"
    XAI_API_KEY: str = ""
    CORS_ORIGINS: list[str] = ["*"]
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"  # To prevent ValidationErrors if extra variables are in .env

settings = Settings()