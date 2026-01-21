from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI(title="Lufyco AI Stylist Backend")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8081", # Expo default
    "*" # For development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Lufyco AI Stylist Backend is Running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Placeholder for Computer Vision Auto-Tagging
    """
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # TODO: Implement Image Processing Here
        
        return {
            "filename": file.filename,
            "detected_tags": ["shirt", "blue", "casual"], # Mock response
            "message": "Image received. Analysis pending implementation."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
