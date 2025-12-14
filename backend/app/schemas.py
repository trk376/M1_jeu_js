from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Dict, List, Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class PlayerProgression(BaseModel):
    max_health: int = 20
    souls: int = 0  
    unlocked_classes: List[str] = []

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=70)

class UserOut(UserBase):
    id: int
    progression: PlayerProgression
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ScoreCreate(BaseModel):
    score_value: int = Field(..., ge=0)
    level_reached: int = Field(..., ge=1)

class UserSnippet(BaseModel):
    username: str
    class Config:
        from_attributes = True

class ScoreOut(BaseModel):
    id: int
    score_value: int
    level_reached: int
    created_at: datetime
    owner: UserSnippet 
    class Config:
        from_attributes = True

class RewardInput(BaseModel):
    score: int
    level: int

class RewardOut(BaseModel):
    souls_earned: int
    total_souls: int
    message: str

class BuyClassInput(BaseModel):
    class_id: str