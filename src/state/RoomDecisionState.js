import { BaseState } from './BaseState.js';
import { RoomPlayingState } from './RoomPlayingState.js';
import { DrawingRoomState } from './DrawingRoomState.js';
import { gameEvents } from '~/utils/EventBus.js';

export class RoomDecisionState extends BaseState {
  enter() {
    console.log("[État] Passage à RoomDecisionState");
    gameEvents.publish('stateChanged', { 
        name: 'RoomDecision', 
        cards: this.game.currentRoomCards 
    });
  }

  onFlee() {
    console.log("[Action] Le joueur choisit de FUIR.");
    this.game.deck.flee(this.game.currentRoomCards);
    this.game.currentRoomCards = [];
    this.game.setState(new DrawingRoomState(this.game));
  }

  onFight() {
    console.log("[Action] Le joueur choisit d'AFFRONTER.");
    this.game.setState(new RoomPlayingState(this.game));
  }
}