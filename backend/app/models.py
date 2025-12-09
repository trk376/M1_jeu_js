from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

# Note : On n'importe PAS Score ici pour éviter le problème d'import circulaire.
# On utilisera des chaînes de caractères "Score" et "User" dans les relations.

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relation inverse : Un user peut avoir plusieurs scores
    # On utilise la chaîne "Score" au lieu de la classe Score
    scores = relationship("Score", back_populates="owner")

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    score_value = Column(Integer, nullable=False, index=True) # indexé pour le tri rapide
    level_reached = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Clé étrangère : Lien vers l'utilisateur qui a fait ce score
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relation pour accéder facilement aux infos du user depuis un score
    # On utilise la chaîne "User" au lieu de la classe User
    owner = relationship("User", back_populates="scores")