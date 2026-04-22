#!/usr/bin/env python
"""
Generate synthetic skin disease images for training demonstration
Creates realistic-looking skin lesion images for each disease class
"""

import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
import cv2
from skimage import draw
import random

# Configuration
NUM_SAMPLES_PER_CLASS = 200  # Samples per disease class
IMG_SIZE = (224, 224)
OUTPUT_DIR = Path(__file__).parent / "data" / "synthetic"

DISEASE_CLASSES = [
    "akiec", "bcc", "bkl", "df", "melanoma",
    "nv", "vasc", "eczema", "ringworm", "psoriasis", "acne"
]

def create_base_skin_tone():
    """Create realistic skin tone base"""
    # Skin tone variations (RGB values)
    skin_tones = [
        [255, 224, 189],  # Light
        [234, 192, 134],  # Fair
        [197, 140, 133],  # Medium
        [141, 85, 36],    # Tan
        [89, 47, 42],     # Dark
    ]
    return random.choice(skin_tones)

def add_lesion_features(img, disease_class):
    """Add disease-specific visual features to the image"""
    height, width = img.shape[:2]

    if disease_class == "akiec":
        # Actinic Keratosis - scaly, rough texture
        for _ in range(20):
            y, x = random.randint(0, height-10), random.randint(0, width-10)
            cv2.circle(img, (x, y), random.randint(2, 5), [200, 150, 100], -1)

    elif disease_class == "bcc":
        # Basal Cell Carcinoma - pearly appearance
        center_y, center_x = height//2, width//2
        cv2.circle(img, (center_x, center_y), 30, [220, 180, 160], -1)
        # Add pearly border
        cv2.circle(img, (center_x, center_y), 35, [240, 200, 180], 3)

    elif disease_class == "bkl":
        # Benign Keratosis - warty appearance
        for _ in range(15):
            y, x = random.randint(20, height-20), random.randint(20, width-20)
            cv2.circle(img, (x, y), random.randint(3, 8), [180, 120, 80], -1)

    elif disease_class == "df":
        # Dermatofibroma - firm, reddish-brown
        center_y, center_x = height//2, width//2
        cv2.circle(img, (center_x, center_y), 25, [150, 80, 60], -1)

    elif disease_class == "melanoma":
        # Melanoma - irregular, dark, asymmetric
        # Create irregular shape
        points = []
        center_y, center_x = height//2, width//2
        for angle in range(0, 360, 30):
            r = random.randint(20, 40)
            y = int(center_y + r * np.sin(np.radians(angle)))
            x = int(center_x + r * np.cos(np.radians(angle)))
            points.append([x, y])

        points = np.array(points)
        cv2.fillPoly(img, [points], [50, 30, 20])

    elif disease_class == "nv":
        # Melanocytic Nevus - mole-like, regular
        center_y, center_x = height//2, width//2
        cv2.circle(img, (center_x, center_y), 20, [80, 50, 30], -1)

    elif disease_class == "vasc":
        # Vascular Lesion - red, vascular
        center_y, center_x = height//2, width//2
        cv2.circle(img, (center_x, center_y), 25, [200, 50, 50], -1)
        # Add vascular patterns
        for _ in range(10):
            y1, x1 = random.randint(0, height), random.randint(0, width)
            y2, x2 = random.randint(0, height), random.randint(0, width)
            cv2.line(img, (x1, y1), (x2, y2), [220, 80, 80], 1)

    elif disease_class == "eczema":
        # Eczema - red, inflamed, patchy
        for _ in range(30):
            y, x = random.randint(0, height-15), random.randint(0, width-15)
            cv2.rectangle(img, (x, y), (x+10, y+10), [200, 100, 100], -1)

    elif disease_class == "ringworm":
        # Ringworm - circular, scaly
        center_y, center_x = height//2, width//2
        cv2.circle(img, (center_x, center_y), 30, [180, 120, 80], 3)
        cv2.circle(img, (center_x, center_y), 20, [0, 0, 0], 1)

    elif disease_class == "psoriasis":
        # Psoriasis - red patches with silvery scales
        for _ in range(25):
            y, x = random.randint(10, height-30), random.randint(10, width-30)
            cv2.rectangle(img, (x, y), (x+15, y+15), [220, 100, 100], -1)
            # Add silvery scales
            cv2.rectangle(img, (x+2, y+2), (x+13, y+13), [240, 240, 240], 1)

    elif disease_class == "acne":
        # Acne - pustules and comedones
        for _ in range(15):
            y, x = random.randint(20, height-20), random.randint(20, width-20)
            # Pustule (white/yellow center)
            cv2.circle(img, (x, y), 3, [255, 255, 200], -1)
            cv2.circle(img, (x, y), 5, [200, 50, 50], 1)

def add_noise_and_texture(img):
    """Add realistic noise and texture to make images more realistic"""
    # Add Gaussian noise
    noise = np.random.normal(0, 5, img.shape).astype(np.uint8)
    img = cv2.add(img, noise)

    # Add subtle texture
    kernel = np.ones((3,3), np.uint8)
    img = cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel)

    return img

def generate_synthetic_dataset():
    """Generate complete synthetic dataset"""
    print("Generating synthetic skin disease dataset...")

    # Create output directories
    for class_name in DISEASE_CLASSES:
        class_dir = OUTPUT_DIR / class_name
        class_dir.mkdir(parents=True, exist_ok=True)

    total_images = 0

    for class_idx, disease_class in enumerate(DISEASE_CLASSES):
        print(f"Generating images for {disease_class}...")

        class_dir = OUTPUT_DIR / disease_class

        for i in range(NUM_SAMPLES_PER_CLASS):
            # Create base skin tone
            img = np.full((IMG_SIZE[0], IMG_SIZE[1], 3), create_base_skin_tone(), dtype=np.uint8)

            # Add disease-specific features
            add_lesion_features(img, disease_class)

            # Add noise and texture
            img = add_noise_and_texture(img)

            # Save image
            img_path = class_dir / f"synthetic_{i:04d}.png"
            plt.imsave(str(img_path), img/255.0)  # matplotlib expects 0-1 range

            total_images += 1

    print(f"\nDataset generation complete!")
    print(f"Total images created: {total_images}")
    print(f"Images per class: {NUM_SAMPLES_PER_CLASS}")
    print(f"Dataset location: {OUTPUT_DIR}")

    return str(OUTPUT_DIR)

if __name__ == "__main__":
    dataset_path = generate_synthetic_dataset()
    print(f"\nSynthetic dataset ready for training at: {dataset_path}")