from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Création du moteur de BDD asynchrone
engine = create_async_engine(settings.DATABASE_URL, echo=True) # echo=True affiche les requêtes SQL dans la console

# Création de la fabrique de sessions
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

# La classe de base pour nos modèles
Base = declarative_base()

# Dependency : Fonction utilisée par FastAPI pour donner une session BDD à une route,
# et la fermer automatiquement après la requête.
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session