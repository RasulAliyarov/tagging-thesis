import os
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from motor.motor_asyncio import AsyncIOMotorClient
from core.security import SECRET_KEY, ALGORITHM, oauth2_scheme
from core.config import settings

# Initialize the client once outside the function
client = AsyncIOMotorClient(settings.DATABASE_URL)

def get_db():
    """
    Dependency that returns the database instance.
    """
    return client.get_database("tagging-ai")

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db = Depends(get_db) # We inject the DB here too!
):
    """
    Decodes JWT and fetches user from the 'users' collection.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
     
    user = await db.users.find_one({"username": username})
    if user is None:
        raise credentials_exception
    
    return user