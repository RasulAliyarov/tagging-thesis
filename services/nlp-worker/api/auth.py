from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from core.security import create_access_token, verify_password, get_password_hash
from motor.motor_asyncio import AsyncIOMotorClient
import os
from core.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Shared database connection
db_client = AsyncIOMotorClient(settings.DATABASE_URL)
db = db_client.get_database("tagging-ai")
users_col = db.get_collection("users")

@router.post("/register")
async def register(form_data: OAuth2PasswordRequestForm = Depends()):
    """Register a new user with a hashed password"""
    if await users_col.find_one({"username": form_data.username}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_obj = {
        "username": form_data.username,
        "hashed_password": get_password_hash(form_data.password)
    }
    await users_col.insert_one(user_obj)
    return {"msg": "User created"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Verify credentials and return a JWT token"""
    user = await users_col.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}