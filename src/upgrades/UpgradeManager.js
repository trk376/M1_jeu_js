import { passiveFactory } from '~/passives/PassiveFactory.js';
import { gameEvents } from '~/utils/EventBus.js';

 
 

 
const upgradeData = [
  { 
    "id": "UPG_CLASS_TANK", "name": "Classe : Tank", 
    "description": "+50 PV Max. Tuer un monstre avec une attaque égale à la puissance de votre arme ne l'endommage pas (1/salle).", 
    "type": "CLASS_PASSIVE", "data": { "passiveId": "TANK" } 
  },
  { 
    "id": "UPG_CLASS_WARLOCK", "name": "Classe : Warlock", 
    "description": "Au début de chaque salle, perdez 3 PV et piochez 1 carte supplémentaire (elle est défaussée à la fin).", 
    "type": "CLASS_PASSIVE", "data": { "passiveId": "WARLOCK" } 
  },
  { 
    "id": "UPG_CLASS_BERSERK", "name": "Classe : Berserk", 
    "description": "Inflige +1 dégât supplémentaire lorsque vous avez moins de 50% de vos PV.", 
    "type": "CLASS_PASSIVE", "data": { "passiveId": "BERSERK" } 
  },
  { 
    "id": "UPG_CLASS_HUNTER", "name": "Classe : Hunter", 
    "description": "Vous ne pouvez plus fuir les salles. (Logique de re-pioche à implémenter).", 
    "type": "CLASS_PASSIVE", "data": { "passiveId": "HUNTER" } 
  }
   
];
 

class UpgradeManager {
  constructor() {
    this.allUpgradeDefinitions = new Map(
      upgradeData.map(upgrade => [upgrade.id, upgrade])
    );
  }


   
  getClassUpgrades() {
     
    const allUpgrades = Array.from(this.allUpgradeDefinitions.values());
    
     
    return allUpgrades.filter(upgrade => upgrade.type === "CLASS_PASSIVE");
  }

   
  
  selectUpgrade(player, upgradeId, game) {
    const upgradeDef = this.allUpgradeDefinitions.get(upgradeId);
    if (!upgradeDef || player.acquiredUpgradeIds.has(upgradeId)) {
      return; 
    }

    switch (upgradeDef.type) {
      case "CLASS_PASSIVE":
        const passive = passiveFactory.createPassive(upgradeDef.data.passiveId, player, game);
        if (passive) {
          player.addPassive(passive, upgradeId);
        }
        break;
      
       
    }
  }
}

 
export const upgradeManager = new UpgradeManager();