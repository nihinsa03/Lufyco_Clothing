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

from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image as keras_image
from PIL import Image
import numpy as np
import io

# Load Model Gloablly (Lazy loading or on startup)
# Weights will be downloaded to ~/.keras/models/ on first run
model = ResNet50(weights='imagenet')
print("AI Model: ResNet50 Loaded")

def process_image(img_data):
    img = Image.open(io.BytesIO(img_data)).convert('RGB')
    img = img.resize((224, 224))
    x = keras_image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return x

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Auto-Tagging using Pre-trained ResNet50
    """
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        processed_img = process_image(contents)

        preds = model.predict(processed_img)
        # Decode the results into a list of tuples (class, description, probability)
        # (one such list for each sample in the batch)
        decoded = decode_predictions(preds, top=3)[0]
        
        # Extract tags (descriptions)
        tags = [item[1] for item in decoded]

        return {
            "filename": file.filename,
            "detected_tags": tags,
            "predictions": [{"label": item[1], "confidence": float(item[2])} for item in decoded],
            "message": "Analysis Complete"
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel
from typing import List, Optional
import random

# Data Models
class ClosetItem(BaseModel):
    id: str
    name: str
    category: str
    tags: Optional[List[str]] = []

class RecommendationRequest(BaseModel):
    weather: str # "sunny", "rainy", "cold", "hot"
    temperature: float # in Celsius
    occasion: str # "casual", "formal", "party", "gym"
    mood: Optional[str] = "neutral"
    closet_items: List[ClosetItem]

@app.post("/recommend-outfit")
async def recommend_outfit(req: RecommendationRequest):
    """
    Rule-based Recommendation Engine (Phase 4)
    """
    try:
        # Filter Logic
        suitable_tops = []
        suitable_bottoms = []
        suitable_shoes = []

        # 1. Weather Filter
        is_cold = req.temperature < 15
        is_hot = req.temperature > 25
        is_raining = "rain" in req.weather.lower()

        for item in req.closet_items:
            cat = item.category.lower()
            name = item.name.lower()
            
            # Simple Categorization (In ideal world, use tags)
            is_top = any(x in cat or x in name for x in ["shirt", "top", "tee", "sweater", "hoodie", "jacket", "coat"])
            is_bottom = any(x in cat or x in name for x in ["pant", "jeans", "trouser", "short", "skirt"])
            is_shoe = any(x in cat or x in name for x in ["shoe", "sneaker", "boot", "heels", "sandal"])

            score = 0

            # Rule: Weather
            if is_cold:
                if "jacket" in name or "coat" in name or "sweater" in name or "hoodie" in name: score += 5
                if "short" in name or "sandal" in name: score -= 10
            elif is_hot:
                if "short" in name or "tee" in name or "sandal" in name: score += 5
                if "jacket" in name or "coat" in name: score -= 10
            
            if is_raining:
                 if "boot" in name or "jacket" in name: score += 3
                 if "sandal" in name or "heels" in name: score -= 5

            # Rule: Occasion
            if req.occasion == "formal":
                if "shirt" in name or "trouser" in name or "blazer" in name: score += 5
                if "tee" in name or "hoodie" in name or "short" in name: score -= 10
            elif req.occasion == "gym":
                if "active" in name or "short" in name or "sneaker" in name: score += 5
                if "jeans" in name or "shirt" in name: score -= 10

            # Add to pools if score is passable
            if score >= -5:
                if is_top: suitable_tops.append((item, score))
                elif is_bottom: suitable_bottoms.append((item, score))
                elif is_shoe: suitable_shoes.append((item, score))

        # Select Best Items (Sort by score and pick random from top 3 to add variety)
        import random
        def pick_one(items):
            if not items: return None
            items.sort(key=lambda x: x[1], reverse=True)
            top_candidates = items[:3]
            return random.choice(top_candidates)[0]

        selected_top = pick_one(suitable_tops)
        selected_bottom = pick_one(suitable_bottoms)
        selected_shoes = pick_one(suitable_shoes)

        outfit = {
            "top": selected_top,
            "bottom": selected_bottom,
            "shoes": selected_shoes,
            "reasoning": f"Selected for {req.weather} weather and {req.occasion} occasion."
        }

        return outfit

    except Exception as e:
        print(f"Rec Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
