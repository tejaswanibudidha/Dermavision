#!/usr/bin/env python
"""
Skin Disease Classification Training Script
Uses HAM10000 dataset or creates synthetic data for demonstration
"""

import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import matplotlib.pyplot as plt
from pathlib import Path
import requests
import zipfile
from io import BytesIO

# Configuration
DATASET_URL = "https://isic-challenge-data.s3.amazonaws.com/2018/ISIC2018_Task3_Training_Input.zip"
GROUND_TRUTH_URL = "https://isic-challenge-data.s3.amazonaws.com/2018/ISIC2018_Task3_Training_GroundTruth.zip"
MODEL_SAVE_PATH = Path(__file__).parent / "model" / "dermavision_effnet_b0_trained.h5"
DATA_DIR = Path(__file__).parent / "data"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50

# Disease classes (matching our model)
DISEASE_CLASSES = [
    "akiec", "bcc", "bkl", "df", "melanoma",
    "nv", "vasc", "eczema", "ringworm", "psoriasis", "acne"
]

def create_synthetic_dataset(num_samples=1000):
    """Create synthetic dataset for demonstration when real dataset is unavailable"""
    print("Creating synthetic dataset for demonstration...")

    data_dir = DATA_DIR / "synthetic"
    data_dir.mkdir(parents=True, exist_ok=True)

    # Create directories for each class
    for class_name in DISEASE_CLASSES:
        (data_dir / class_name).mkdir(exist_ok=True)

    # Generate synthetic images (random colored squares)
    for i in range(num_samples):
        class_idx = i % len(DISEASE_CLASSES)
        class_name = DISEASE_CLASSES[class_idx]

        # Create random colored image
        img = np.random.randint(0, 255, (IMG_SIZE[0], IMG_SIZE[1], 3), dtype=np.uint8)

        # Save image
        img_path = data_dir / class_name / f"synthetic_{i:04d}.jpg"
        plt.imsave(str(img_path), img)

    print(f"Created {num_samples} synthetic images across {len(DISEASE_CLASSES)} classes")
    return str(data_dir)

def download_and_extract_dataset():
    """Download and extract HAM10000 or ISIC dataset"""
    try:
        print("Attempting to download ISIC 2018 dataset...")

        # Create data directory
        DATA_DIR.mkdir(exist_ok=True)

        # Download training images
        print("Downloading training images...")
        response = requests.get(DATASET_URL, stream=True)
        with zipfile.ZipFile(BytesIO(response.content)) as zf:
            zf.extractall(DATA_DIR)

        # Download ground truth
        print("Downloading ground truth labels...")
        response = requests.get(GROUND_TRUTH_URL, stream=True)
        with zipfile.ZipFile(BytesIO(response.content)) as zf:
            zf.extractall(DATA_DIR)

        print("Dataset downloaded successfully!")
        return str(DATA_DIR / "ISIC2018_Task3_Training_Input")

    except Exception as e:
        print(f"Failed to download real dataset: {e}")
        print("Falling back to synthetic dataset...")
        return create_synthetic_dataset()

def prepare_data_generators(data_path):
    """Prepare training and validation data generators"""
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )

    # Only rescaling for validation
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )

    # Training generator
    train_generator = train_datagen.flow_from_directory(
        data_path,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    # Validation generator
    validation_generator = val_datagen.flow_from_directory(
        data_path,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    return train_generator, validation_generator

def build_model(num_classes):
    """Build EfficientNetB0 model for skin disease classification"""
    # Load pre-trained EfficientNetB0
    base_model = EfficientNetB0(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )

    # Freeze base model layers
    for layer in base_model.layers:
        layer.trainable = False

    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    # Create model
    model = Model(inputs=base_model.input, outputs=predictions)

    # Compile model
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    return model

def train_model():
    """Main training function"""
    print("Starting skin disease classification training...")

    # Get dataset
    data_path = download_and_extract_dataset()

    # Prepare data generators
    train_generator, validation_generator = prepare_data_generators(data_path)

    # Build model
    num_classes = len(DISEASE_CLASSES)
    model = build_model(num_classes)

    print(f"Model built with {num_classes} classes: {DISEASE_CLASSES}")

    # Callbacks
    early_stopping = EarlyStopping(
        monitor='val_accuracy',
        patience=10,
        restore_best_weights=True,
        mode='max'
    )

    model_checkpoint = ModelCheckpoint(
        str(MODEL_SAVE_PATH),
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )

    # Train model
    print("Starting training...")
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=validation_generator,
        callbacks=[early_stopping, model_checkpoint],
        verbose=1
    )

    # Evaluate model
    print("\nEvaluating model...")
    loss, accuracy = model.evaluate(validation_generator, verbose=1)
    print(".4f")

    # Generate classification report
    predictions = model.predict(validation_generator)
    y_pred = np.argmax(predictions, axis=1)
    y_true = validation_generator.classes

    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=DISEASE_CLASSES))

    # Save final model
    model.save(str(MODEL_SAVE_PATH))
    print(f"\nModel saved to: {MODEL_SAVE_PATH}")

    return history, model

if __name__ == "__main__":
    # Set memory growth for GPU
    physical_devices = tf.config.list_physical_devices('GPU')
    if physical_devices:
        tf.config.experimental.set_memory_growth(physical_devices[0], True)

    # Train the model
    history, trained_model = train_model()

    print("\nTraining completed successfully!")
    print(f"Trained model saved at: {MODEL_SAVE_PATH}")