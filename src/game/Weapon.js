import { gameEvents } from '~/utils/EventBus.js';

export class Weapon {
  constructor(weaponData, originalCard) {
    this.name = weaponData.name;
    this.power = weaponData.power;
    this.originalCard = originalCard;
    this.maxAttackCeiling = Infinity;
  }

  canUseOn(monsterAttack) {
    return monsterAttack < this.maxAttackCeiling;
  }

  useOnMonster(monsterAttack) {
    if (!this.canUseOn(monsterAttack)) {
      return 0;
    }

    this.maxAttackCeiling = monsterAttack;
    console.log(`[Weapon] Arme utilisée! Nouveau plafond: ${this.maxAttackCeiling}`);
    gameEvents.publish('playerWeaponChanged', this);
    return this.power;
  }
}