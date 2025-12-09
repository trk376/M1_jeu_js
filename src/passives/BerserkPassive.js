import { BasePassive } from './BasePassive.js';

export class BerserkPassive extends BasePassive {
  
  onAdded() {
     
    this.subscribe('beforePlayerTakesDamage', this.onTakeDamage);
  }

  onTakeDamage(damageData) {
    const isEnraged = this.player.health / this.player.maxHealth <= 0.5;
    
    if (isEnraged) {
      console.log("[Berserk] RAGE ! +1 dégât infligé !");
       
       
       
       
      
      console.warn("[Berserk] Logique 'inflige +1 dégât' non implémentée (nécessite hook). Implémentation de 'subit -1 dégât'.");
      damageData.modifiedDamage = Math.max(0, damageData.modifiedDamage - 1);
    }
  }
}