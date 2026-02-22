
"""
Convert Saved Model to TensorFlow.js Format (Standalone)
Use this if training finished but conversion failed due to NumPy error.
"""

import numpy as np
# MONKEY PATCH: Fix for tensorflowjs requiring np.object
try:
    np.object = object
    np.bool = bool
except AttributeError:
    pass

import os
# Fix for protobuf version mismatch
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs

# Paths
OUTPUT_DIR = r"D:\My_PaidProjects\Lufyco_Clothing\Lufyco_Backend\models"
MODEL_NAME = "fashion-similarity-model"
MODEL_PATH = os.path.join(OUTPUT_DIR, f"{MODEL_NAME}.h5")
TFJS_PATH = os.path.join(OUTPUT_DIR, f"{MODEL_NAME}_tfjs")

def convert_model():
    print(f"🔍 Looking for model at: {MODEL_PATH}")
    
    if not os.path.exists(MODEL_PATH):
        print("❌ Model file not found!")
        return

    print("♻️ Loading model...")
    model = keras.models.load_model(MODEL_PATH)
    
    print("📦 Converting to TensorFlow.js format...")
    tfjs.converters.save_keras_model(model, TFJS_PATH)
    
    print(f"✅ Conversion complete! Saved to: {TFJS_PATH}")

if __name__ == "__main__":
    convert_model()
