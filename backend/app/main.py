from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, scores, progress # <-- AJOUT DE PROGRESS DANS L'IMPORT
from app.database import engine, Base

# --- Initialisation de l'App ---
app = FastAPI(title="Dungeon API")

# --- Configuration CORS ---
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
app.include_router(scores.router) 
app.include_router(progress.router) # <-- AJOUT DE CETTE LIGNE OBLIGATOIRE

# --- Événement de démarrage ---
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # Cette ligne crée les tables si elles n'existent pas
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API du Donjon Maudit"}