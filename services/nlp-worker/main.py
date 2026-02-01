import os
import json
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from google import genai 
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import csv
import codecs
from fastapi import UploadFile, File
import asyncio

load_dotenv()

# Setting up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 1. Initialize a NEW Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"), http_options={'api_version': 'v1'})

#2. Setting up MongoDB Atlas
MONGO_URL = os.getenv("DATABASE_URL")
db_client = AsyncIOMotorClient(MONGO_URL)
db = db_client.get_database("tagging-ai")
collection = db.get_collection("analysis_results")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_text(request: AnalysisRequest):
    try:
        prompt = f"""
            You are an NLP engine for structured feedback analysis.
            Analyze the text below and return a STRICTLY VALID JSON object.
            
            Text:
            "{request.text}"
            
            Requirements:
            
            1. sentiment:
            - "positive" — satisfaction or praise
            - "negative" — complaints or criticism
            - "neutral" — factual or informational, no clear emotion
            
            2. tags:
            - EXACTLY 3 short lowercase tags (1–3 words, no special characters)
            - Tag 1: general category (e.g. bug report, feature request, praise)
            - Tag 2: core issue or topic (e.g. performance, ui, pricing)
            - Tag 3: specific detail or context (e.g. slow loading, mobile app)
            
            3. priority:
            - "low" — minor or general feedback
            - "medium" — affects usability
            - "high" — blocks usage or causes strong dissatisfaction
            
            4. summary:
            - 1–2 sentences
            - Neutral summary in English
            - Only information from the text
            
            Output:
            - ONLY raw JSON
            - No markdown, comments, or extra text
            
            JSON format:
            
            {
              "sentiment": "",
              "tags": ["", "", ""],
              "priority": "",
              "summary": ""
            }

        """
        # prompt = f"""
        #     Return valid JSON only.
        #     Text:
        #     "{request.text}"

        #     Fields:
        #     - sentiment: positive | negative | neutral (factual, no emotion)
        #     - tags: exactly 3 lowercase tags
        #       1) text type: general category (e.g. bug, feature request, praise) 
        #       2) main issue
        #       3) specific context
        #     - priority: low | medium | high
        #     - summary: 1–2 neutral sentences in English
        # """

        #3. A NEW way to generate content
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        # JSON Cleaning and Parsing
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        analysis = json.loads(raw_text)
        
        #4. Saving to MongoDB Atlas
        analysis["created_at"] = datetime.utcnow().isoformat()
        analysis["original_text"] = request.text
        
        await collection.insert_one(analysis.copy())
        
        if "_id" in analysis:
            analysis["_id"] = str(analysis["_id"])
            
        return analysis

    except Exception as e:
        logger.error(f"Error: {e}")
        return {"error": str(e)}

@app.post("/analyze-batch")
async def analyze_batch(file: UploadFile = File(...)):
    results = []
    # Read the file
    reader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))
    
    for row in reader:
        # We assume that the CSV has a 'text' column
        text_to_analyze = row.get('text') or row.get('feedback') or list(row.values())[0]
        await asyncio.sleep(4)
        try:
            # Call Gemini (logic is the same as in regular analyze)
            prompt = f"Analyze feedback: {text_to_analyze}. Return ONLY JSON with sentiment, tags, priority, summary_ru."
            response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            analysis = json.loads(raw_text)
            
            # Save metadata
            analysis["original_text"] = text_to_analyze
            analysis["created_at"] = datetime.utcnow().isoformat()
            
            # Save to MongoDB Atlas
            await collection.insert_one(analysis.copy())
            
            if "_id" in analysis: del analysis["_id"]
            results.append(analysis)
            
        except Exception as e:
            logger.error(f"Error processing row: {e}")
            continue # Skipping broken lines
            
    return {"status": "success", "processed": len(results), "data": results}

@app.get("/history")
async def get_history():
    cursor = collection.find().sort("created_at", -1).limit(10)
    history = await cursor.to_list(length=10)
    for item in history:
        item["_id"] = str(item["_id"])
    return history