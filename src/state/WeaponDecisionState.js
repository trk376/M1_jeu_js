import { BaseState } from './BaseState.js';
import { RoomPlayingState } from './RoomPlayingState.js';
import { gameEvents } from '~/utils/EventBus.js';

export class WeaponDecisionState extends BaseState {
  constructor(game, monsterCard) {
    super(game);
    this.monsterCard = monsterCard;
  }

  enter() {
    console.log("[État] Passage à WeaponDecisionState");
    gameEvents.publish('stateChanged', { 
        name: 'WeaponDecision', 
        monster: this.monsterCard,
        weapon: this.game.player.weapon
    });
  }

  onConfirmWeaponUse(useIt) {
    console.log(`[Action] Utiliser l'arme ? ${useIt ? 'OUI' : 'NON'}`);
    
    // 1. Résoudre le monstre avec l'option
    const isGameOver = this.game.resolveCardImmediate(this.monsterCard, { useWeapon: useIt });

     
    if (isGameOver) {
        return;
    }

     
    this.game.setState(new RoomPlayingState(this.game));
    this.game.currentState.checkRoomEnd(this.monsterCard);
  }
}