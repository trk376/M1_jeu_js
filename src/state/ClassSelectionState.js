import { BaseState } from './BaseState.js';
import { gameEvents } from '~/utils/EventBus.js';
import { upgradeManager } from '~/upgrades/UpgradeManager.js'; 

export class ClassSelectionState extends BaseState {
  enter() {
    console.log("[État] Passage à ClassSelectionState");
    
     
    const availableClasses = upgradeManager.getClassUpgrades();
    
     
    gameEvents.publish('stateChanged', { 
        name: 'ClassSelection', 
        classes: availableClasses 
    });
  }

   
  onSelectClass(classId) {
     
    console.log(`[Action] Le joueur a choisi la classe: ${classId}`);
    
     
    this.game.startGame(classId); 
  }
}