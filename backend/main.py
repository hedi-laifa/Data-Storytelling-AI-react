from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import datasets, analysis, chat, history, auth
from utils.config import settings
from database import init_db

# Initialize database
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend for AI Data Storytelling Platform",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(datasets.router, prefix="/api/datasets", tags=["Datasets"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis & Charts"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chat"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}