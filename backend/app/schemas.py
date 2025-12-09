from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Schéma de base pour un utilisateur
class UserBase(BaseModel):
    username: str
    email: EmailStr

# Schéma pour la création (ce que le front envoie pour s'inscrire)
class UserCreate(UserBase):
    password: str = Field(..., min_length=6,max_length=70)

# Schéma pour la lecture (ce que l'API renvoie, SANS le mot de passe !)
class UserOut(UserBase):
    id: int
    # On active le mode ORM pour que Pydantic sache lire le modèle SQLAlchemy
    class Config:
        from_attributes = True

# Schéma pour le Token JWT retourné après login
class Token(BaseModel):
    access_token: str
    token_type: str

class ScoreCreate(BaseModel):
    score_value: int = Field(..., ge=0) # ge=0 : doit être positif
    level_reached: int = Field(..., ge=1)

# Ce que l'API renvoie pour le leaderboard (on veut le score ET le pseudo du joueur)
# On crée un petit schéma juste pour le pseudo
class UserSnippet(BaseModel):
    username: str
    class Config:
        from_attributes = True

class ScoreOut(BaseModel):
    id: int
    score_value: int
    level_reached: int
    created_at: datetime
    owner: UserSnippet # On inclut le pseudo ici

    class Config:
        from_attributes = True