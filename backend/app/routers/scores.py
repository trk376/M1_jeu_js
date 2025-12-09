from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc # Pour trier par ordre décroissant

from app.database import get_db
from app.models import Score, User
from app import schemas
from app.dependencies import get_current_user # Notre nouvelle protection

router = APIRouter(prefix="/api/scores", tags=["scores"])

# --- ROUTE 1 : SAUVEGARDER UN SCORE (Sécurisée) ---
@router.post("/", response_model=schemas.ScoreOut)
async def create_score(
    score_data: schemas.ScoreCreate, 
    # Cette ligne rend la route sécurisée : il faut un token valide !
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    new_score = Score(
        score_value=score_data.score_value,
        level_reached=score_data.level_reached,
        user_id=current_user.id # On lie le score à l'utilisateur connecté
    )
    db.add(new_score)
    await db.commit()
    await db.refresh(new_score)
    return new_score

# --- ROUTE 2 : LEADERBOARD (Publique) ---
@router.get("/leaderboard", response_model=list[schemas.ScoreOut])
async def get_leaderboard(limit: int = 10, db: AsyncSession = Depends(get_db)):
    # Requête complexe :
    # 1. Sélectionne les scores
    # 2. Trie par valeur décroissante (desc)
    # 3. Limite le nombre de résultats
    # 4. "selectinload(Score.owner)" : charge aussi les infos de l'utilisateur associé pour avoir le pseudo
    query = select(Score).order_by(desc(Score.score_value)).limit(limit).options(selectinload(Score.owner))
    result = await db.execute(query)
    scores = result.scalars().all()
    return scores