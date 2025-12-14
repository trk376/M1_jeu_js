from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import random
from app.models import User, ALL_CLASS_IDS, DEFAULT_PLAYER_PROGRESSION
from app import schemas
from app.dependencies import get_current_user, get_db

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.post("/claim-reward", response_model=schemas.RewardOut)
async def claim_reward(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    progression_data = current_user.progression.copy()

    for key, default_val in DEFAULT_PLAYER_PROGRESSION.items():
        if key not in progression_data:
            progression_data[key] = default_val

    reward = None
    dice_roll = random.random()
    
    unlocked = progression_data["unlocked_classes"]
    classes_to_unlock = [c for c in ALL_CLASS_IDS if c not in unlocked]
    
    if dice_roll > 0.90 and classes_to_unlock:
        new_class = random.choice(classes_to_unlock)
        
        unlocked.append(new_class)
        progression_data["unlocked_classes"] = unlocked

        reward = schemas.RewardOut(
            reward_type="class",
            message=f"Nouvelle classe débloquée : {new_class.capitalize()} !",
            new_class_id=new_class
        )

    else:
        hp_gain = 3
        current_hp = progression_data["max_health"]
        progression_data["max_health"] = current_hp + hp_gain
        
        reward = schemas.RewardOut(
            reward_type="health",
            message=f"Votre endurance augmente ! +{hp_gain} PV Max permanents.",
            health_gain=hp_gain
        )

    current_user.progression = progression_data
    
    await db.commit()
    
    return reward