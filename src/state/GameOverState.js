import { BaseState } from './BaseState.js';
import { gameEvents } from '~/utils/EventBus.js';

export class GameOverState extends BaseState {
  enter() {
    console.log("[État] Passage à GameOverState");
    const deckScore = this.game.deck.calculateRemainingMonsterScore();
    const roomCards = this.game.roomAvailableCards || [];
    const roomScore = roomCards
      .filter(card => card.type === 'monster')
      .reduce((total, card) => total + card.effects[0].value, 0);

    const penalty = deckScore + roomScore;

    console.log(`[Score] Score actuel avant défaite: ${this.game.player.score}`);
    console.log(`[Score] Pénalité (monstres restants): -${penalty}`);

    this.game.player.addScore(-penalty);

    const finalScore = this.game.player.score;
    
    console.log(`[Score] Score de défaite: ${finalScore}`);
    gameEvents.publish('stateChanged', { name: 'GameOver', score : finalScore });
  }

  onRestartGame() {
    console.log("[Action] Le joueur recommence.");
     
    this.game.quitGame();
  }
}