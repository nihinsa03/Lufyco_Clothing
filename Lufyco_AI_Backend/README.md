# Lufyco AI Stylist Backend

This backend powers the AI features of the Lufyco Clothing App, including:
1.  **Auto-Tagging**: Using Computer Vision (YOLO/ResNet) to identify clothing items.
2.  **Recommendation Engine**: Suggesting outfits based on Weather, Mood, and Style compatibility.

## Setup

1.  **Install Python 3.10+**
2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run Server**:
    ```bash
    python main.py
    ```
    Server runs on `http://localhost:8000`.

## API Endpoints

-   `GET /`: Health check.
-   `POST /analyze-image`: Upload an image to get clothing tags (Current: Mock).

## Roadmap

-   [ ] Integrate deep learning models.
-   [ ] Connect to Vector Database (ChromaDB).
