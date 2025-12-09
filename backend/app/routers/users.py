from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.security import OAuth2PasswordRequestForm # Formulaire standard de login

from app.database import get_db
from app.models import User
from app import schemas, auth

router = APIRouter(prefix="/api", tags=["users"])

# --- ROUTE D'INSCRIPTION ---
@router.post("/register", response_model=schemas.UserOut)
async def register_user(user_data: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Vérifier si le username ou email existe déjà
    query = select(User).where((User.username == user_data.username) | (User.email == user_data.email))
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username ou Email déjà pris.")

    # 2. Hasher le mot de passe
    hashed_pwd = auth.get_password_hash(user_data.password)

    # 3. Créer le nouvel utilisateur
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pwd
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

# --- ROUTE DE LOGIN ---
@router.post("/login", response_model=schemas.Token)
# OAuth2PasswordRequestForm est un standard qui attend "username" et "password" dans un formulaire
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # 1. Chercher l'utilisateur
    query = select(User).where(User.username == form_data.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    # 2. Vérifier utilisateur et mot de passe
    if not user or not auth.verify_password(form_data.password, user.password_hash):
         # On retourne une erreur générique pour ne pas aider les pirates
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Générer le token JWT
    # On met l'ID de l'utilisateur dans le token ("sub" = subject)
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}