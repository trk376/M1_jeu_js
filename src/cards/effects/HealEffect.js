import { BaseEffect } from '~/cards/BaseEffect.js';  
 
export class HealEffect extends BaseEffect {
  execute(player, game, options,card) {
    player.heal(this.value);
  }
}