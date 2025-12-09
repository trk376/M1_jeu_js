import { BasePassive } from './BasePassive.js';

export class WarlockPassive extends BasePassive {
  
  onAdded() {
    this.subscribe('newRoomEntered', this.onNewRoom);
  }
  
  onNewRoom(data) {
    const { player, game } = data;
    const hpCost = 3;
    
    console.log(`[Warlock] Pacte de sang... -${hpCost} PV`);
     
    player.takeDamage(hpCost); 
    
     
    const extraCards = game.deck.draw(1);
    
    if (extraCards.length > 0) {
        const newCard = extraCards[0];
        console.log(`[Warlock] Carte piochée: ${newCard.name}`);
        
         
        game.currentRoomCards.push(newCard);
        
         
         
        game.roomAvailableCards.push(newCard);
        
         
         
    }
  }
}