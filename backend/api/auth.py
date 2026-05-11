from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from database import get_db_connection
from utils.security import verify_password, get_password_hash, create_access_token
import sqlite3

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    name: str

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    conn = get_db_connection()
    try:
        hashed_password = get_password_hash(user.password)
        c = conn.cursor()
        c.execute(
            "INSERT INTO Users (email, name, password_hash) VALUES (?, ?, ?)",
            (user.email, user.name, hashed_password)
        )
        conn.commit()
        user_id = c.lastrowid
        conn.close()
        
        access_token = create_access_token({"sub": str(user_id)})
        return {"access_token": access_token, "token_type": "bearer", "user_id": str(user_id), "name": user.name}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    conn = get_db_connection()
    row = conn.execute("SELECT id, name, password_hash FROM Users WHERE email = ?", (user.email,)).fetchone()
    conn.close()
    
    if not row or not verify_password(user.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
        
    access_token = create_access_token({"sub": str(row["id"])})
    return {"access_token": access_token, "token_type": "bearer", "user_id": str(row["id"]), "name": row["name"]}

