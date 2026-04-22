import io
import os
from pathlib import Path
from typing import Any, Dict, List, Tuple

try:
    import numpy as np
    from PIL import Image
    from tensorflow.keras.applications.efficientnet import preprocess_input
    from tensorflow.keras.models import load_model
except ImportError as exc:
    raise ImportError(
        "Missing ML dependencies. Install with 'pip install tensorflow pillow numpy'."
    ) from exc

# Ensure file path is adjustable by env variable for flexible deployments.
MODEL_FILE = os.getenv(
    "DERMAVISION_MODEL_PATH",
    str(Path(__file__).resolve().parent / "model" / "dermavision_effnet_b0.h5"),
)

# Normalize to standard size assumed by EfficientNet base.
INPUT_SIZE = (224, 224)

# Pick models trained on HAM10000 or custom dataset. Replace with your class set as needed.
MODEL_CLASSES = [
    "akiec",
    "bcc",
    "bkl",
    "df",
    "melanoma",
    "nv",
    "vasc",
    "eczema",
    "ringworm",
    "psoriasis",
    "acne",
]

_model = None


def load_ml_model() -> Any:
    global _model
    if _model is not None:
        return _model

    model_path = Path(MODEL_FILE)
    if not model_path.exists():
        raise FileNotFoundError(
            f"ML model file not found at {model_path}. ``dermavision_effnet_b0.h5`` expected."
        )

    _model = load_model(str(model_path))
    return _model


def preprocess_image_bytes(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(INPUT_SIZE, Image.BILINEAR)
    array = np.asarray(image, dtype=np.float32)
    array = preprocess_input(array)
    return np.expand_dims(array, axis=0)


def predict_skin_disease(image_bytes: bytes) -> Tuple[str, int, List[Dict[str, Any]]]:
    model = load_ml_model()
    model_input = preprocess_image_bytes(image_bytes)

    predictions = model.predict(model_input, verbose=0)
    if predictions.ndim != 2 or predictions.shape[0] != 1:
        raise ValueError("Unexpected model prediction shape: %s" % (predictions.shape,))

    scores = predictions[0]
    if len(scores) != len(MODEL_CLASSES):
        raise ValueError(
            "Model class count mismatch (%s classes vs %s labels)" % (len(scores), len(MODEL_CLASSES))
        )

    top_indices = list(sorted(range(len(scores)), key=lambda i: scores[i], reverse=True))
    primary_idx = top_indices[0]
    primary_name = MODEL_CLASSES[primary_idx]
    primary_confidence = int(round(float(scores[primary_idx]) * 100))

    alternatives = []
    for idx in top_indices[1:4]:
        alternatives.append({
            "name": MODEL_CLASSES[idx],
            "confidence": int(round(float(scores[idx]) * 100)),
        })

    return primary_name, primary_confidence, alternatives
