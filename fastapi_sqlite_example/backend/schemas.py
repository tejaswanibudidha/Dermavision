from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserUpdate(BaseModel):
    name: str
    email: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: str | None = None

    class Config:
        from_attributes = True


class AlternativePrediction(BaseModel):
    name: str
    confidence: int


class AnalysisResult(BaseModel):
    disease: str
    condition_name: str
    confidence: int
    severity: str
    observation: str
    summary: str
    recommendation: str
    precautions_do: list[str]
    precautions_dont: list[str]
    diet_include: list[str]
    diet_avoid: list[str]
    alternatives: list[AlternativePrediction]
    image_name: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str


class VerifyOtpRequest(BaseModel):
    email: str
    otp: str


class SetNewPasswordRequest(BaseModel):
    reset_token: str
    new_password: str
