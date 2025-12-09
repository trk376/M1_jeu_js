import { gameEvents } from '~/utils/EventBus.js';
 

export class BasePassive {
  constructor(player, game) {
    this.player = player;
    this.game = game;
    this.unsubscribeCallbacks = []; 
  }

  onAdded() {}
  onRemoved() {
    this.unsubscribeCallbacks.forEach(unsub => unsub());
  }

  subscribe(eventName, callback) {
    const unsubscribeFn = gameEvents.subscribe(eventName, callback.bind(this));
    this.unsubscribeCallbacks.push(unsubscribeFn);
  }
}