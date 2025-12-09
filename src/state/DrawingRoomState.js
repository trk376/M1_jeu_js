 

import { BaseState } from './BaseState.js';
import { RoomDecisionState } from './RoomDecisionState.js';
import { GameOverState } from './GameOverState.js';
import { gameEvents } from '~/utils/EventBus.js';
 

export class DrawingRoomState extends BaseState {
  enter() {
    console.log("[État] Passage à DrawingRoomState");
    this.game.currentRoomCards = this.game.deck.draw(4);
    
     
    if (this.game.currentRoomCards.length === 0) {
        console.log("Plus aucune carte dans le deck ! VICTOIRE !");
        this.game.startNewLoop();
        return;
    }

     
    gameEvents.publish('newRoomEntered', { 
        player: this.game.player, 
        game: this.game 
    });
    
     
     
    if (this.game.player.health <= 0) {
        console.error("[Game] Le joueur est mort à cause d'un effet de début de salle. GAME OVER.");
        this.game.setState(new GameOverState(this.game));
        return;  
    }
    
     
    gameEvents.publish('roomCardsDrawn', this.game.currentRoomCards);
    this.game.setState(new RoomDecisionState(this.game));
  }
}