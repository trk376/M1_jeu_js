import { BaseState } from './BaseState.js';
import { WeaponDecisionState } from './WeaponDecisionState.js';
import { DrawingRoomState } from './DrawingRoomState.js';
import { gameEvents } from '~/utils/EventBus.js';

export class RoomPlayingState extends BaseState {
  enter() {
    console.log("[État] Passage à RoomPlayingState");
    
    if (this.game.roomPicksLeft === 0) {  
      this.game.roomAvailableCards = [...this.game.currentRoomCards];
      
      if (this.game.currentRoomCards.length < 4) {
           
          this.game.roomPicksLeft = this.game.currentRoomCards.length;
      } else {
           
          this.game.roomPicksLeft = 3;
      }
    }
    
    gameEvents.publish('stateChanged', { 
        name: 'RoomPlaying', 
        cards: this.game.roomAvailableCards,
        picksLeft: this.game.roomPicksLeft
    });
  }

  onSelectCard(card) {
    console.log(`[Action] Le joueur sélectionne: ${card.name}`);

     
    if (!this.game.roomAvailableCards.includes(card)) {
        console.warn("Cette carte a déjà été jouée !");
        return;
    }
    
    const player = this.game.player;
    let weaponUsable = false;

     
    if (card.type === 'monster' && player.weapon) {
      const monsterAttack = card.effects[0].value;  
      if (player.weapon.canUseOn(monsterAttack)) {
        weaponUsable = true;
      }
    }

     
    this.game.roomAvailableCards = this.game.roomAvailableCards.filter(c => c !== card);
    
    if (weaponUsable) {
       
      this.game.setState(new WeaponDecisionState(this.game, card));
    } else {
       
      const isGameOver = this.game.resolveCardImmediate(card, { useWeapon: false });
      if (isGameOver) {
          return; 
      }
      this.checkRoomEnd(card);
    }
  }

  checkRoomEnd(resolvedCard) {

    if (resolvedCard.type !== 'weapon') {
        this.game.deck.discard(resolvedCard);
        console.log(`[État] Carte ${resolvedCard.name} défaussée.`);
    } else {
         
         
        console.log(`[État] Carte arme ${resolvedCard.name} équipée et retirée du jeu.`);
    }
    
    this.game.roomPicksLeft--;

    if (this.game.roomPicksLeft <= 0) {
       
      console.log("[État] Fin de la salle.");

       
      if (this.game.roomAvailableCards.length > 0) {
          console.log(`[État] Défausse des ${this.game.roomAvailableCards.length} cartes restantes.`);
          this.game.roomAvailableCards.forEach(card => this.game.deck.discard(card));
      }
      
       
      this.game.roomPicksLeft = 0;
      this.game.roomAvailableCards = [];
      this.game.currentRoomCards = [];
      
       
      this.game.setState(new DrawingRoomState(this.game));
      
    } else {
         
        gameEvents.publish('stateChanged', { 
            name: 'RoomPlaying', 
            cards: this.game.roomAvailableCards,
            picksLeft: this.game.roomPicksLeft
        });
    }
  }
}