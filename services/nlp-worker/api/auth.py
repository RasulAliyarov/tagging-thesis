from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from core.security import create_access_token, verify_password, get_password_hash
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Shared database connection
db_client = AsyncIOMotorClient(settings.DATABASE_URL)
db = db_client.get_database("tagging-ai")
users_col = db.get_collection("users")



# OAuth2PasswordRequestForm is specifically designed for OAuth2 login, not registration.
#It expects application/x-www-form-urlencoded. assumes username + password

# @router.post("/register")
# async def register(form_data: OAuth2PasswordRequestForm = Depends()):
#     """Register a new user with a hashed password"""
#     if await users_col.find_one({"email": form_data.email}):
#         raise HTTPException(status_code=400, detail="User already exists")

#     user_obj = {
#         "fullname": form_data.fullname,
#         "email": form_data.email,
#         "username": form_data.username,
#         "hashed_password": get_password_hash(form_data.password)
#     }
#     await users_col.insert_one(user_obj)
#     return {"msg": "User created"}



class RegisterSchema(BaseModel):
    fullname: str
    email: EmailStr
    username: str
    password: str


@router.post("/register")
async def register(data: RegisterSchema):
    if await users_col.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_obj = {
        "fullname": data.fullname,
        "email": data.email,
        "username": data.username,
        "hashed_password": get_password_hash(data.password),
    }

    await users_col.insert_one(user_obj)
    return {"msg": "User created"}



class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login(data: LoginSchema):
    user = await users_col.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user["username"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "email": user["email"],
            "fullname": user["fullname"]
        }
    }