"""
Fashion Similarity Model Training Script
Train a custom model on DeepFashion dataset using TensorFlow + GPU

Hardware Requirements:
- GPU: RTX 4060 8GB ✅
- RAM: 32GB ✅
- CUDA: 13.0 ✅

Expected Training Time: 1-2 hours for 5000 images
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os
import json
from pathlib import Path

# ========================================
# CONFIGURATION
# ========================================

class Config:
    # Dataset paths - ADJUST THESE TO YOUR DEEPFASHION LOCATION
    DATASET_ROOT = r"D:\My_PaidProjects\Lufyco_Clothing\DeepFashion"
    TRAIN_DIR = os.path.join(DATASET_ROOT, "train_images")
    TEST_DIR = os.path.join(DATASET_ROOT, "test_images")
    
    # Model settings
    IMAGE_SIZE = (224, 224)
    BATCH_SIZE = 32
    EPOCHS = 20
    LEARNING_RATE = 0.0001
    
    # Output paths
    OUTPUT_DIR = r"D:\My_PaidProjects\Lufyco_Clothing\Lufyco_Backend\models"
    MODEL_NAME = "fashion-similarity-model"
    
    # Training limits
    MAX_TRAIN_SAMPLES = None  # None = use all, or set to 5000 for testing
    VALIDATION_SPLIT = 0.2

# ========================================
# GPU SETUP
# ========================================

def setup_gpu():
    """Configure GPU for training"""
    print("\n🔍 GPU Configuration:")
    print(f"TensorFlow version: {tf.__version__}")
    print(f"GPU Available: {tf.config.list_physical_devices('GPU')}")
    
    # Enable memory growth to avoid OOM
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
            print(f"✅ GPU memory growth enabled for {len(gpus)} GPU(s)")
        except RuntimeError as e:
            print(f"⚠️ GPU setup warning: {e}")
    else:
        print("⚠️ No GPU detected, training will be slow!")
    
    return len(gpus) > 0

# ========================================
# DATA PREPARATION
# ========================================

def create_data_generators(config):
    """Create data generators with augmentation"""
    print("\n📂 Setting up data generators...")
    
    # Training data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2,
        fill_mode='nearest',
        validation_split=config.VALIDATION_SPLIT
    )
    
    # Validation data (no augmentation)
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=config.VALIDATION_SPLIT
    )
    
    # Training generator
    train_generator = train_datagen.flow_from_directory(
        config.TRAIN_DIR,
        target_size=config.IMAGE_SIZE,
        batch_size=config.BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )
    
    # Validation generator
    validation_generator = val_datagen.flow_from_directory(
        config.TRAIN_DIR,
        target_size=config.IMAGE_SIZE,
        batch_size=config.BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    print(f"✅ Found {train_generator.samples} training images")
    print(f"✅ Found {validation_generator.samples} validation images")
    print(f"📊 Classes: {list(train_generator.class_indices.keys())}")
    
    return train_generator, validation_generator

# ========================================
# MODEL ARCHITECTURE
# ========================================

def create_model(num_classes, input_shape=(224, 224, 3)):
    """Create model using MobileNetV2 with transfer learning"""
    print("\n🏗️ Building model architecture...")
    
    # Load pre-trained MobileNetV2
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers
    base_model.trainable = False
    print(f"✅ Loaded MobileNetV2 (frozen {len(base_model.layers)} layers)")
    
    # Build custom top layers
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax', name='predictions')
    ])
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=config.LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy', 'top_k_categorical_accuracy']
    )
    
    model.summary()
    return model

# ========================================
# TRAINING
# ========================================

def train_model(config):
    """Main training pipeline"""
    print("\n🚀 Starting Fashion Similarity Model Training\n")
    print("=" * 60)
    
    # Setup GPU
    has_gpu = setup_gpu()
    if not has_gpu:
        response = input("\n⚠️ No GPU detected. Continue anyway? (y/n): ")
        if response.lower() != 'y':
            print("Training cancelled.")
            return None
    
    # Create data generators
    train_gen, val_gen = create_data_generators(config)
    num_classes = len(train_gen.class_indices)
    
    # Create model
    model = create_model(num_classes)
    
    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            os.path.join(config.OUTPUT_DIR, f"{config.MODEL_NAME}_best.h5"),
            save_best_only=True,
            monitor='val_accuracy',
            mode='max',
            verbose=1
        ),
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Train
    print("\n🏋️ Training model...\n")
    history = model.fit(
        train_gen,
        epochs=config.EPOCHS,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )
    
    # Save final model
    print("\n💾 Saving model...")
    
    # Save in TensorFlow format
    model_path = os.path.join(config.OUTPUT_DIR, config.MODEL_NAME)
    model.save(model_path + '.h5')
    print(f"✅ Saved TensorFlow model: {model_path}.h5")
    
    # Save model for TensorFlow.js
    tfjs_path = os.path.join(config.OUTPUT_DIR, f"{config.MODEL_NAME}_tfjs")
    os.makedirs(tfjs_path, exist_ok=True)
    
    # Note: You'll need tensorflowjs package for this
    # Install: pip install tensorflowjs
    try:
        import tensorflowjs as tfjs
        tfjs.converters.save_keras_model(model, tfjs_path)
        print(f"✅ Saved TensorFlow.js model: {tfjs_path}")
    except ImportError:
        print("⚠️ tensorflowjs not installed. Run: pip install tensorflowjs")
        print("   To convert model for Node.js later.")
    
    # Save class indices
    class_indices_path = os.path.join(config.OUTPUT_DIR, "class_indices.json")
    with open(class_indices_path, 'w') as f:
        json.dump(train_gen.class_indices, f, indent=2)
    print(f"✅ Saved class indices: {class_indices_path}")
    
    # Print results
    print("\n" + "=" * 60)
    print("✅ TRAINING COMPLETE!")
    print("=" * 60)
    print(f"\nFinal Results:")
    print(f"  Training Accuracy:   {history.history['accuracy'][-1]*100:.2f}%")
    print(f"  Validation Accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")
    print(f"  Training Loss:       {history.history['loss'][-1]:.4f}")
    print(f"  Validation Loss:     {history.history['val_loss'][-1]:.4f}")
    
    return model, history

# ========================================
# MAIN
# ========================================

if __name__ == "__main__":
    config = Config()
    
    # Verify paths exist
    if not os.path.exists(config.TRAIN_DIR):
        print(f"❌ Training directory not found: {config.TRAIN_DIR}")
        print("\nPlease update Config.DATASET_ROOT to your DeepFashion location.")
        exit(1)
    
    # Create output directory
    os.makedirs(config.OUTPUT_DIR, exist_ok=True)
    
    # Train
    model, history = train_model(config)
    
    print("\n🎉 All done! Your custom fashion model is ready to use.")
    print("\nNext steps:")
    print("1. Restart your Node.js backend")
    print("2. The model will load automatically")
    print("3. Test with /api/ai/image-search endpoint")
