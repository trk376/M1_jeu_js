export class BaseState {
  constructor(game) {
    this.game = game;
  }

  enter() {}
  exit() {}
  
   
  onFlee() { console.warn(`Action 'onFlee' non gérée dans ${this.constructor.name}`); }
  onFight() { console.warn(`Action 'onFight' non gérée dans ${this.constructor.name}`); }
  onSelectCard(card) { console.warn(`Action 'onSelectCard' non gérée dans ${this.constructor.name}`); }
  onConfirmWeaponUse(useIt) { console.warn(`Action 'onConfirmWeaponUse' non gérée dans ${this.constructor.name}`); }
  
   
  onStartGame() { console.warn(`Action 'onStartGame' non gérée dans ${this.constructor.name}`); }
  onRestartGame() { console.warn(`Action 'onRestartGame' non gérée dans ${this.constructor.name}`); }
  onWinRestartGame() { console.warn(`Action 'onWinRestartGame' non gérée dans ${this.constructor.name}`); }
  onSelectClass(classId) { console.warn(`Action 'onSelectClass' non gérée dans ${this.constructor.name}`); }
}