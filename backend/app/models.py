from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

DEFAULT_PLAYER_PROGRESSION = {
    "max_health": 20,
    "souls": 0,
    "unlocked_classes": [],
}

ALL_CLASS_IDS = ["tank", "warlock", "berserk", "hunter"]

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    progression = Column(JSON, nullable=False, default=DEFAULT_PLAYER_PROGRESSION)

    scores = relationship("Score", back_populates="owner")

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    score_value = Column(Integer, nullable=False, index=True)
    level_reached = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="scores")