import { Card } from './Card.js';
import { HealEffect } from './effects/HealEffect.js';
import { EquipWeaponEffect } from './effects/EquipWeaponEffect.js';
import { MonsterAttackEffect } from './effects/MonsterAttackEffect.js';

 
const cardJsonData = [
  { "id": "POTION_S", "name": "Petite Potion", "type": "potion", "effects": [{ "type": "heal", "value": 5 }] },
  { "id": "POTION_L", "name": "Grande Potion", "type": "potion", "effects": [{ "type": "heal", "value": 15 }] },
  { "id": "SWORD", "name": "Épée", "type": "weapon", "effects": [{ "type": "equipWeapon", "value": { "name": "Épée", "power": 6 } }] },
  { "id": "AXE", "name": "Hache", "type": "weapon", "effects": [{ "type": "equipWeapon", "value": { "name": "Hache", "power": 10 } }] },
  { "id": "GOBLIN", "name": "Gobelin", "type": "monster", "effects": [{ "type": "monsterAttack", "value": 8 }] },
  { "id": "ORC", "name": "Orque", "type": "monster", "effects": [{ "type": "monsterAttack", "value": 12 }] }
];

 
const effectRegistry = {
  "heal": HealEffect,
  "equipWeapon": EquipWeaponEffect,
  "monsterAttack": MonsterAttackEffect
};

class CardFactory {
  constructor() {
    this.cardDefinitions = new Map(
      cardJsonData.map(card => [card.id, card])
    );
  }

  createCard(cardId, game) {
    const def = this.cardDefinitions.get(cardId);
    if (!def) throw new Error(`Carte inconnue: ${cardId}`);

    const difficultyBonus = game.loopLevel > 1 ? (game.loopLevel - 1) * 2 : 0;
    
    const effectInstances = def.effects.map(effectData => {
      const EffectClass = effectRegistry[effectData.type];
      if (!EffectClass) throw new Error(`Effet inconnu: ${effectData.type}`);
      
       
      let effectValue = { ...effectData.value };  
      if (typeof effectData.value !== 'object') {
          effectValue = effectData.value;  
      }

       
      if (def.type === 'monster' && effectData.type === 'monsterAttack' && difficultyBonus > 0) {
          effectValue += difficultyBonus;
          console.log(`[Factory] Monstre buffé: ${def.name} +${difficultyBonus} ATK`);
      }

      return new EffectClass(effectValue);
    });

    return new Card(def.name, def.type, effectInstances);
  }
}

export const cardFactory = new CardFactory();