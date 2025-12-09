import { BaseEffect } from '~/cards/BaseEffect.js';
import { gameEvents } from '~/utils/EventBus.js';
 
export class MonsterAttackEffect extends BaseEffect {
  execute(player, game, options,card) {
    const monsterAttack = this.value;
    let damageTaken = monsterAttack;

    if (options.useWeapon === true && player.weapon) {
      const damageBlocked = player.weapon.useOnMonster(monsterAttack);
      damageTaken = Math.max(0, monsterAttack - damageBlocked);
    }
    
    const damageData = {
        baseDamage: monsterAttack,
        modifiedDamage: damageTaken, 
        source: card 
    };
    
    gameEvents.publish('beforePlayerTakesDamage', damageData);

    player.takeDamage(damageData.modifiedDamage);
  }
}