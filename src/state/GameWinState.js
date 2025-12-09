import { BaseState } from './BaseState.js';
import { gameEvents } from '~/utils/EventBus.js';
import { MainMenuState } from './MainMenuState.js';

export class GameWinState extends BaseState {
  enter() {
    console.log("[État] Passage à GameWinState");
    const finalScore = this.game.player.health;
    
    console.log(`[Score] Score de victoire: ${finalScore}`);
    
     
    gameEvents.publish('stateChanged', { name: 'GameWin', score: finalScore });
  }
  

   
  onWinRestartGame() {
    console.log("[Action] Le joueur recommence (Victoire).");
    this.game.quitGame();
  }
}