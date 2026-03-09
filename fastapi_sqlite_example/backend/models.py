from sqlalchemy import Column, Integer, String

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    reset_otp_hash = Column(String, nullable=True)
    reset_otp_expires_at = Column(Integer, nullable=True)
    reset_session_token_hash = Column(String, nullable=True)
    reset_session_expires_at = Column(Integer, nullable=True)
