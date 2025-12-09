# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, scores 
from app.database import engine, Base
from app.models import User , Score

# --- Initialisation de l'App ---
app = FastAPI(title="Dungeon API")

# --- Configuration CORS ---
# Liste des origines autorisées (l'URL de ton front Astro en dev)
origins = [
    "http://localhost:4321",
    "http://127.0.0.1:4321",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Inclusion des routes ---
app.include_router(users.router)
# ✅ CORRECTION 2 : Inclure le routeur des scores
app.include_router(scores.router) 

# --- Événement de démarrage ---
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all) # RESET COMPLET
        # Cette ligne crée les tables si elles n'existent pas (utile pour la nouvelle table scores)
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API du Donjon Maudit"}