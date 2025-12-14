import { gameEvents } from '~/utils/EventBus.js';
import { Weapon } from './Weapon.js';


export class Player {
  constructor() {
    this.health = 20;
    this.maxHealth = 20;
    this.weapon = null;
    this.passives = [];
    this.acquiredUpgradeIds = new Set();
    this.score = 0;
  }

  takeDamage(amount) {
    this.health -= amount;
    console.log(`[Player] Subit ${amount} dégâts. PV: ${this.health}/${this.maxHealth}`);
    gameEvents.publish('playerHealthChanged', {
      current: this.health,
      max: this.maxHealth
    });
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    console.log(`[Player] Se soigne de ${amount}. PV: ${this.health}/${this.maxHealth}`);
    gameEvents.publish('playerHealthChanged', {
      current: this.health,
      max: this.maxHealth
    });
  }

  setMaxHealth(newMax) {
    this.maxHealth = newMax;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
    gameEvents.publish('playerHealthChanged', {
      current: this.health,
      max: this.maxHealth
    });
  }

  equipWeapon(weaponData, originalCard, game) {
    if (this.weapon) {
      console.log(`[Player] Défausse l'arme: ${this.weapon.name}`);
    }
    this.weapon = new Weapon(weaponData, originalCard);
    console.log(`[Player] Équipe l'arme: ${this.weapon.name}`);
    gameEvents.publish('playerWeaponChanged', this.weapon);
  }

  addPassive(passiveInstance, upgradeId) {
    if (this.acquiredUpgradeIds.has(upgradeId)) return;

    this.passives.push(passiveInstance);
    passiveInstance.onAdded();
    this.acquiredUpgradeIds.add(upgradeId);
    console.log(`[Player] Passif ajouté: ${upgradeId}`);
  }
  addScore(amount) {
    this.score += amount;
    console.log(`[Score] +${amount} points! Total: ${this.score}`);

    gameEvents.publish('playerStatsChanged', {
      current: this.health,
      max: this.maxHealth,
      score: this.score
    });
  }
}