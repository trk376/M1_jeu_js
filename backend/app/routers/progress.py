from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified
import random
from app.models import User, ALL_CLASS_IDS, DEFAULT_PLAYER_PROGRESSION
from app import schemas
from app.dependencies import get_current_user, get_db

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.get("/me", response_model=schemas.UserOut)
async def get_my_progress(current_user: User = Depends(get_current_user)):
    print(f"--- [DEBUG BACKEND] GET /me appelé pour {current_user.username} ---")
    if not current_user.progression:
         current_user.progression = DEFAULT_PLAYER_PROGRESSION.copy()
    
    progression = current_user.progression
    # On s'assure que les âmes sont là
    if "souls" not in progression:
        progression["souls"] = 0
    
    print(f"--- [DEBUG BACKEND] Progression envoyée : {progression} ---")
    return current_user

@router.post("/buy-hp", response_model=schemas.UserOut)
async def buy_hp(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    print(f"--- [DEBUG BACKEND] Achat HP demandé par {current_user.username} ---")
    progression = current_user.progression
    current_souls = progression.get("souls", 0)
    COST = 100 

    if current_souls < COST:
        print(f"--- [DEBUG BACKEND] Achat refusé : Pas assez d'âmes ({current_souls} < {COST}) ---")
        raise HTTPException(status_code=400, detail="Pas assez d'âmes !")

    progression["souls"] = current_souls - COST
    progression["max_health"] = progression.get("max_health", 20) + 1
    
    current_user.progression = progression
    flag_modified(current_user, "progression")
    await db.commit()
    print(f"--- [DEBUG BACKEND] Achat validé. Nouvelles stats : {progression} ---")
    return current_user

@router.post("/buy-class", response_model=schemas.UserOut)
async def buy_class(
    class_input: schemas.BuyClassInput,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    print(f"--- [DEBUG BACKEND] Achat CLASSE {class_input.class_id} demandé ---")
    progression = current_user.progression
    current_souls = progression.get("souls", 0)
    COST = 500
    class_id = class_input.class_id

    if current_souls < COST:
        raise HTTPException(status_code=400, detail="Pas assez d'âmes !")
    
    unlocked = progression.get("unlocked_classes", [])
    if class_id in unlocked:
        raise HTTPException(status_code=400, detail="Classe déjà débloquée !")
        
    progression["souls"] = current_souls - COST
    unlocked.append(class_id)
    progression["unlocked_classes"] = unlocked
    
    current_user.progression = progression
    flag_modified(current_user, "progression")
    await db.commit()
    print(f"--- [DEBUG BACKEND] Classe débloquée. Reste : {progression['souls']} âmes ---")
    return current_user

# --- LE CŒUR DU PROBLÈME EST ICI ---
@router.post("/claim-reward", response_model=schemas.RewardOut)
async def claim_reward(
    reward_input: schemas.RewardInput,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    print(f"\n🔥🔥🔥 [DEBUG BACKEND] RÉCLAMATION REÇUE 🔥🔥🔥")
    print(f"--- Joueur : {current_user.username} (ID: {current_user.id})")
    print(f"--- Input reçu : Score={reward_input.score}, Level={reward_input.level}")

    progression_data = current_user.progression if current_user.progression else DEFAULT_PLAYER_PROGRESSION.copy()
    
    # Patch des clés manquantes
    for key, default_val in DEFAULT_PLAYER_PROGRESSION.items():
        if key not in progression_data:
            progression_data[key] = default_val

    # LOGIQUE DE CALCUL
    # J'ai mis le seuil à 1 pour tes tests, donc ça doit TOUJOURS marcher
    THRESHOLD_LEVEL = 1 
    
    souls_gained = 0
    message = ""

    if reward_input.level >= THRESHOLD_LEVEL:
        # Formule : 50% du score
        souls_gained = int(reward_input.score * 0.5) 
        
        # Sécurité pour gagner au moins 1 truc si on a joué
        if souls_gained == 0 and reward_input.score > 0:
            souls_gained = 1
            
        message = f"Victoire ! +{souls_gained} Âmes"
        print(f"--- [DEBUG BACKEND] Condition Seuil OK. Gain calculé : {souls_gained}")
    else:
        message = f"Mort prématurée..."
        print(f"--- [DEBUG BACKEND] Condition Seuil ÉCHOUÉE (Level {reward_input.level} < {THRESHOLD_LEVEL})")

    current_souls = progression_data.get("souls", 0)
    print(f"--- [DEBUG BACKEND] Âmes avant : {current_souls}")
    
    new_total = current_souls + souls_gained
    progression_data["souls"] = new_total
    print(f"--- [DEBUG BACKEND] Âmes après : {new_total}")

    # SAUVEGARDE
    current_user.progression = progression_data
    flag_modified(current_user, "progression")
    await db.commit()
    print(f"--- [DEBUG BACKEND] Sauvegarde BDD effectuée. ---\n")

    return schemas.RewardOut(
        souls_earned=souls_gained,
        total_souls=new_total,
        message=message
    )