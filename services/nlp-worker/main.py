import os
import json
import logging
import asyncio
import uuid
import pandas as pd
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from google import genai 
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 1. Initialize Gemini Client
# Using the stable 2.5-flash model for high performance and reliability
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"), http_options={'api_version': 'v1'})

# 2. MongoDB Connection Setup
MONGO_URL = os.getenv("DATABASE_URL")
db_client = AsyncIOMotorClient(MONGO_URL)
db = db_client.get_database("tagging-ai")
collection = db.get_collection("analyses")

app = FastAPI()

# CORS configuration to allow local development with Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# --- Pydantic Data Models ---

class AnalysisResult(BaseModel):
    id: str = Field(alias="id") # UUID string for frontend tracking
    num: int = 0                # Incremental counter per entry
    text: str
    sentiment: str  
    priority: str   
    confidence: float
    timestamp: str
    tags: List[str]

    class Config:
        populate_by_name = True

class AnalysisRequest(BaseModel):
    text: str

class AnalysisUpdate(BaseModel):
    text: Optional[str] = None
    sentiment: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None

# --- Helper Functions ---

async def get_next_num():
    """
    Finds the highest 'num' in the collection and returns the next value.
    Starts from 1 if the collection is empty.
    """
    last_record = await collection.find_one(sort=[("num", -1)])
    if last_record and "num" in last_record:
        return last_record["num"] + 1
    return 1

# --- API Routes ---

@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_text(request: AnalysisRequest):
    try:
        # Get the incremental number for the new record
        next_num = await get_next_num()

        prompt = (
            f"Analyze the following text: '{request.text}'. "
            f"Provide analysis in strict JSON format with these keys: "
            f"sentiment (Positive/Neutral/Negative), priority (Low/Medium/High), "
            f"confidence (0.0-1.0), and tags: exactly 3 lowercase tags."
        )

        # Generating content using Gemini 2.5 Flash
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        # Manual JSON Cleaning and Parsing (Proven reliable method)
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        ai_data = json.loads(raw_text)
        
        # Construct the final record for MongoDB
        analysis_record = {
            "id": str(uuid.uuid4()),
            "num": next_num,
            "text": request.text,
            "sentiment": ai_data.get("sentiment", "Neutral"),
            "priority": ai_data.get("priority", "Medium"),
            "confidence": float(ai_data.get("confidence", 0.0)),
            "tags": ai_data.get("tags", []),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Persist data to MongoDB Atlas
        await collection.insert_one(analysis_record.copy())
        
        return analysis_record

    except Exception as e:
        logger.error(f"Analysis Failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analyses", response_model=List[AnalysisResult])
async def get_analyses():
    """Returns the 10 most recent analysis records sorted by timestamp"""
    cursor = collection.find().sort("timestamp", -1).limit(10)
    results = await cursor.to_list(length=10)
    return results

@app.delete("/api/analyses/{item_id}")
async def delete_analysis(item_id: str):
    """Deletes a record by the custom UUID 'id' field"""
    result = await collection.delete_one({"id": item_id})
    if result.deleted_count == 1:
        return {"status": "success", "message": "Record deleted"}
    raise HTTPException(status_code=404, detail="Record not found")

@app.put("/api/analyses/{item_id}", response_model=AnalysisResult)
async def update_analysis(item_id: str, data: AnalysisUpdate):
    """Updates selected fields of a record identified by UUID"""
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid data fields provided for update")

    result = await collection.find_one_and_update(
        {"id": item_id},
        {"$set": update_data},
        return_document=True
    )

    if result:
        return result
    raise HTTPException(status_code=404, detail="Record not found")

@app.post("/api/batch-analyze")
async def batch_analyze(file: UploadFile = File(...)):
    """Processes a CSV file for bulk sentiment analysis"""
    try:
        df = pd.read_csv(file.file)
        target_column = df.columns[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to parse CSV file")
    
    final_results = []
    current_num = await get_next_num()
    
    for _, row in df.iterrows():
        raw_text = str(row[target_column])
        try:
            prompt = f"Analyze: '{raw_text}' in strict JSON: sentiment, priority, confidence, tags (3 tags)."
            response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            
            # Use reliable cleaning logic for batch processing
            ai_text = response.text.replace("```json", "").replace("```", "").strip()
            ai_data = json.loads(ai_text)
            
            record = {
                "id": str(uuid.uuid4()),
                "num": current_num,
                "text": raw_text,
                "sentiment": ai_data.get('sentiment', 'Neutral'),
                "priority": ai_data.get('priority', 'Low'),
                "confidence": ai_data.get('confidence', 0.5),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "tags": ai_data.get('tags', [])
            }
            
            await collection.insert_one(record)
            final_results.append(record)
            current_num += 1
            
            # Sleep to respect Gemini API rate limits on Free Tier
            await asyncio.sleep(2) 
            
        except Exception:
            continue
            
    return final_results