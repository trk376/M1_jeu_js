import { BasePassive } from './BasePassive.js'; 
import { gameEvents } from '~/utils/EventBus.js'; 

export class TankPassive extends BasePassive {
  
  constructor(player, game) {
      super(player, game);
      this.bonusUsedThisRoom = false;  
  }
  
  onAdded() {
    console.log("[Passif] Activation du TANK: +50 PV Max");
    this.player.setMaxHealth(this.player.maxHealth + 50);
    this.player.heal(50);
    
     
    this.subscribe('monsterResolved', this.onMonsterResolved);
    this.subscribe('newRoomEntered', this.onNewRoom);
  }
  
  onNewRoom() {
       
      this.bonusUsedThisRoom = false;
  }
  
  onMonsterResolved(data) {
    const { player, card, weaponUsed } = data;
    
     
    if (this.bonusUsedThisRoom || !weaponUsed) {
      return;
    }

    const monsterAttack = card.effects[0].value;
    
     
    if (monsterAttack === weaponUsed.power) {
      console.log("[Tank] BONUS: L'arme n'est pas endommagée !");
       
      weaponUsed.maxAttackCeiling = Infinity;
      this.bonusUsedThisRoom = true;
      
       
      gameEvents.publish('playerWeaponChanged', weaponUsed);
    }
  }
}