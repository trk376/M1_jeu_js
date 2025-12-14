from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, scores, progress
from app.database import engine, Base

app = FastAPI(title="Dungeon API")

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

app.include_router(users.router)
app.include_router(scores.router) 
app.include_router(progress.router) 

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API du Donjon Maudit"}