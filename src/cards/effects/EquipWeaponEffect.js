import { BaseEffect } from '~/cards/BaseEffect.js';
 
export class EquipWeaponEffect extends BaseEffect {
  execute(player, game, options, card) {
     
    player.equipWeapon(this.value,card, game);
  }
}