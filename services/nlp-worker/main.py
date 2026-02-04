from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, analyze

app = FastAPI(title="AI Analysis Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(analyze.router)

@app.get("/")
async def health_check():
    return {"status": "online", "version": "2.0.0"}