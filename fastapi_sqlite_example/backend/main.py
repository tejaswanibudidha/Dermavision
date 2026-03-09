import base64
import hashlib
import hmac
import os
import random
import secrets
import smtplib
import time
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any, Generator, List
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session

import models
import schemas
from database import BASE_DIR, Base, SessionLocal, engine

load_dotenv(BASE_DIR / ".env", override=True)

Base.metadata.create_all(bind=engine)


def ensure_user_columns() -> None:
    with engine.connect() as connection:
        columns = {
            row[1]
            for row in connection.execute(text("PRAGMA table_info(users)")).fetchall()
        }

        if "avatar_url" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR"))

        if "password_hash" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR"))

        if "reset_otp_hash" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN reset_otp_hash VARCHAR"))

        if "reset_otp_expires_at" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN reset_otp_expires_at INTEGER"))

        if "reset_session_token_hash" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN reset_session_token_hash VARCHAR"))

        if "reset_session_expires_at" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN reset_session_expires_at INTEGER"))

        connection.commit()


ensure_user_columns()

UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

PASSWORD_ITERATIONS = 120_000
OTP_VALIDITY_SECONDS = 10 * 60
RESET_SESSION_VALIDITY_SECONDS = 10 * 60


def remove_avatar_file(avatar_url: str | None) -> None:
    if not avatar_url or not avatar_url.startswith("/uploads/"):
        return

    file_path = UPLOADS_DIR / Path(avatar_url).name
    if file_path.exists() and file_path.is_file():
        file_path.unlink()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_ITERATIONS,
    )
    return f"{PASSWORD_ITERATIONS}${base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, encoded_hash: str | None) -> bool:
    if not encoded_hash:
        return False

    try:
        iterations_str, salt_b64, digest_b64 = encoded_hash.split("$", 2)
        iterations = int(iterations_str)
        salt = base64.b64decode(salt_b64)
        expected_digest = base64.b64decode(digest_b64)
    except (ValueError, TypeError):
        return False

    calculated = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return hmac.compare_digest(calculated, expected_digest)


def hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode("utf-8")).hexdigest()


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


def send_otp_email(recipient_email: str, otp: str) -> None:
    # Reload env at call-time so worker/reloader processes always get fresh SMTP values.
    load_dotenv(BASE_DIR / ".env", override=True)

    smtp_host = (os.getenv("SMTP_HOST") or "").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = (os.getenv("SMTP_USER") or "").strip()
    smtp_password = (os.getenv("SMTP_PASSWORD") or "").replace(" ", "")
    smtp_from = (os.getenv("SMTP_FROM") or "").strip()
    from_email = smtp_from or f"DermaVision <{smtp_user}>"

    if not smtp_host or not smtp_user or not smtp_password:
        raise RuntimeError("SMTP configuration is incomplete")

    message = MIMEText(
        "Your OTP for password reset is "
        f"{otp}. It expires in {OTP_VALIDITY_SECONDS // 60} minutes."
    )
    message["Subject"] = "DermaVision Password Reset OTP"
    message["From"] = from_email
    message["To"] = recipient_email

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(message)

app = FastAPI(title="FastAPI + SQLite Users API")
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


latest_analysis: schemas.AnalysisResult | None = None


def build_analysis_result(image_name: str) -> dict[str, Any]:
    # Deterministic mock analysis so the same filename gives stable output.
    templates = [
        {
            "disease": "Eczema",
            "condition_name": "Atopic Dermatitis",
            "confidence": 94,
            "severity": "Moderate",
            "observation": "The image shows inflamed and dry patches that are consistent with eczema.",
            "summary": "AI visual features strongly match atopic dermatitis patterns.",
            "recommendation": "Use gentle moisturizers and consult a dermatologist if symptoms persist beyond 7 days.",
            "precautions_do": [
                "Moisturize affected skin at least twice daily.",
                "Use fragrance-free cleansers and skincare products.",
                "Wear breathable cotton fabrics.",
                "Keep nails short to reduce skin injury from scratching.",
            ],
            "precautions_dont": [
                "Avoid hot showers and harsh soaps.",
                "Do not scratch inflamed areas.",
                "Avoid known irritants and allergens.",
                "Do not self-medicate with steroid creams long-term.",
            ],
            "diet_include": [
                "Fatty fish rich in omega-3",
                "Leafy greens and colorful vegetables",
                "Hydrating fruits",
                "Probiotic foods",
            ],
            "diet_avoid": [
                "Ultra-processed foods",
                "Excess sugar",
                "Potential personal trigger foods",
            ],
            "alternatives": [
                {"name": "Psoriasis", "confidence": 4},
                {"name": "Contact Dermatitis", "confidence": 2},
            ],
        },
        {
            "disease": "Ringworm",
            "condition_name": "Tinea Corporis",
            "confidence": 89,
            "severity": "Mild",
            "observation": "Circular lesion boundaries and scaling patterns suggest fungal involvement.",
            "summary": "Pattern similarity indicates a likely superficial fungal infection.",
            "recommendation": "Keep skin dry and seek medical advice for antifungal treatment confirmation.",
            "precautions_do": [
                "Keep affected skin clean and dry.",
                "Use separate towels and wash clothing daily.",
                "Wear loose, breathable clothing.",
            ],
            "precautions_dont": [
                "Do not share personal items.",
                "Avoid steroid-only creams without diagnosis.",
                "Do not ignore spread to new areas.",
            ],
            "diet_include": [
                "Balanced protein intake",
                "Vitamin C rich fruits",
                "Hydration throughout the day",
            ],
            "diet_avoid": [
                "High sugar snacks",
                "Heavy oily fast food",
            ],
            "alternatives": [
                {"name": "Eczema", "confidence": 7},
                {"name": "Psoriasis", "confidence": 4},
            ],
        },
    ]

    selected = templates[sum(ord(char) for char in image_name) % len(templates)]
    return {**selected, "image_name": image_name}


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "message": "Backend is running",
        "users_endpoint": "/users",
        "docs": "/docs",
    }


@app.post("/analyze", response_model=schemas.AnalysisResult)
async def analyze_image(file: UploadFile = File(...)):
    global latest_analysis

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Max file size is 5MB")

    image_name = file.filename or "uploaded-image"
    latest_analysis = schemas.AnalysisResult(**build_analysis_result(image_name))
    return latest_analysis


@app.get("/analysis/latest", response_model=schemas.AnalysisResult)
def get_latest_analysis():
    if latest_analysis is None:
        raise HTTPException(
            status_code=404,
            detail="No analysis found yet. Upload an image first.",
        )

    return latest_analysis


@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_email is not None:
        raise HTTPException(status_code=400, detail="Email is already registered")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/auth/login", response_model=schemas.UserResponse)
def login_user(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.User)
        .filter(models.User.email.ilike(payload.email.strip()))
        .first()
    )
    if existing_user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(payload.password, existing_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return existing_user


@app.post("/auth/forgot-password")
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.User)
        .filter(models.User.email.ilike(payload.email.strip()))
        .first()
    )

    if existing_user is None:
        # Avoid user enumeration. Return success-like response.
        return {"message": "If this email exists, an OTP has been sent."}

    otp = str(random.randint(100000, 999999))
    existing_user.reset_otp_hash = hash_otp(otp)
    existing_user.reset_otp_expires_at = int(time.time()) + OTP_VALIDITY_SECONDS
    existing_user.reset_session_token_hash = None
    existing_user.reset_session_expires_at = None
    db.commit()

    try:
        send_otp_email(existing_user.email, otp)
    except Exception as exc:
        print(f"[DermaVision OTP] Failed sending email to {existing_user.email}: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Unable to send OTP email. Check SMTP credentials (SMTP_USER/SMTP_PASSWORD) and Gmail app password.",
        ) from exc

    return {"message": "OTP sent to your email successfully."}


@app.post("/auth/verify-otp")
def verify_otp(payload: schemas.VerifyOtpRequest, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.User)
        .filter(models.User.email.ilike(payload.email.strip()))
        .first()
    )

    if existing_user is None:
        raise HTTPException(status_code=400, detail="Invalid OTP or email")

    if not existing_user.reset_otp_hash or not existing_user.reset_otp_expires_at:
        raise HTTPException(status_code=400, detail="No active OTP request found")

    if int(time.time()) > existing_user.reset_otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired")

    if not hmac.compare_digest(existing_user.reset_otp_hash, hash_otp(payload.otp.strip())):
        raise HTTPException(status_code=400, detail="Invalid OTP or email")

    reset_token = generate_reset_token()
    existing_user.reset_session_token_hash = hash_otp(reset_token)
    existing_user.reset_session_expires_at = int(time.time()) + RESET_SESSION_VALIDITY_SECONDS
    existing_user.reset_otp_hash = None
    existing_user.reset_otp_expires_at = None
    db.commit()

    return {
        "message": "OTP verified successfully.",
        "reset_token": reset_token,
        "expires_in_seconds": RESET_SESSION_VALIDITY_SECONDS,
    }


@app.post("/auth/set-new-password")
def set_new_password(payload: schemas.SetNewPasswordRequest, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.User)
        .filter(models.User.reset_session_token_hash == hash_otp(payload.reset_token.strip()))
        .first()
    )

    if existing_user is None:
        raise HTTPException(status_code=400, detail="Invalid or expired reset session")

    if not existing_user.reset_session_expires_at:
        raise HTTPException(status_code=400, detail="Invalid or expired reset session")

    if int(time.time()) > existing_user.reset_session_expires_at:
        raise HTTPException(status_code=400, detail="Reset session has expired")

    existing_user.password_hash = hash_password(payload.new_password)
    existing_user.reset_session_token_hash = None
    existing_user.reset_session_expires_at = None
    existing_user.reset_otp_hash = None
    existing_user.reset_otp_expires_at = None
    db.commit()

    return {"message": "Password updated successfully. Please login with your new password."}


@app.post("/auth/reset-password")
def reset_password(payload: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.User)
        .filter(models.User.email.ilike(payload.email.strip()))
        .first()
    )

    if existing_user is None:
        raise HTTPException(status_code=400, detail="Invalid OTP or email")

    if not existing_user.reset_otp_hash or not existing_user.reset_otp_expires_at:
        raise HTTPException(status_code=400, detail="No active OTP request found")

    if int(time.time()) > existing_user.reset_otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired")

    if not hmac.compare_digest(existing_user.reset_otp_hash, hash_otp(payload.otp.strip())):
        raise HTTPException(status_code=400, detail="Invalid OTP or email")

    existing_user.password_hash = hash_password(payload.new_password)
    existing_user.reset_otp_hash = None
    existing_user.reset_otp_expires_at = None
    db.commit()

    return {"message": "Password reset successful. Please login with your new password."}


@app.get("/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return existing_user


@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    existing_user.name = user.name
    existing_user.email = user.email
    db.commit()
    db.refresh(existing_user)
    return existing_user


@app.post("/users/{user_id}/avatar", response_model=schemas.UserResponse)
async def upload_avatar(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Max file size is 5MB")

    suffix = Path(file.filename or "avatar.jpg").suffix or ".jpg"
    filename = f"user_{user_id}_{uuid4().hex}{suffix}"
    destination = UPLOADS_DIR / filename
    destination.write_bytes(content)

    remove_avatar_file(existing_user.avatar_url)
    existing_user.avatar_url = f"/uploads/{filename}"
    db.commit()
    db.refresh(existing_user)
    return existing_user


@app.delete("/users/{user_id}/avatar", response_model=schemas.UserResponse)
def remove_avatar(user_id: int, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    remove_avatar_file(existing_user.avatar_url)
    existing_user.avatar_url = None
    db.commit()
    db.refresh(existing_user)
    return existing_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    remove_avatar_file(existing_user.avatar_url)
    db.delete(existing_user)
    db.commit()
    return {"message": "User deleted successfully"}
