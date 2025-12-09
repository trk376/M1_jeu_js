from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from app.config import settings

# Configuration du hachage avec bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Vérifie si un mot de passe en clair correspond au hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Crée le hash d'un mot de passe."""
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Crée un token JWT signé avec notre clé secrète."""
    to_encode = data.copy()
    # On ajoute une date d'expiration
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # On encode et on signe
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt