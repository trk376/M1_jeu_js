import { BaseState } from './BaseState.js';
import { gameEvents } from '~/utils/EventBus.js';
import { ClassSelectionState } from './ClassSelectionState.js';

export class MainMenuState extends BaseState {
  enter() {
    console.log("[État] Passage à MainMenuState");
    gameEvents.publish('stateChanged', { name: 'MainMenu' });
  }

  onStartGame() {
    console.log("[Action] Le joueur démarre la partie.");
     
     
    this.game.setState(new ClassSelectionState(this.game));
  }
}