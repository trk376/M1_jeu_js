import { BasePassive } from './BasePassive.js';
import { gameEvents } from '~/utils/EventBus.js';

export class HunterPassive extends BasePassive {
  
  onAdded() {
     
    this.subscribe('stateChanged', this.onStateChange);
     
  }

  onStateChange(data) {
     
    if (data.name === 'RoomDecision') {
      console.log("[Hunter] Incapable de fuir !");
      gameEvents.publish('disableFleeButton', true); 
    }
  }
}