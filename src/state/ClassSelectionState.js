import { BaseState } from './BaseState.js';
import { gameEvents } from '~/utils/EventBus.js';
import { upgradeManager } from '~/upgrades/UpgradeManager.js';
import { uiStore } from '~/store.js'; // Import du store pour voir ce qu'on possède

export class ClassSelectionState extends BaseState {
  enter() {
    console.log("[État] Passage à ClassSelectionState");

    // 1. On récupère toutes les définitions possibles
    const allClassOptions = upgradeManager.getClassUpgrades();

    // 2. On récupère ce que le joueur a acheté (ex: ["warlock", "hunter"])
    const unlockedList = uiStore.get().unlockedClasses || [];

    // 3. On filtre : on ne garde que celles qu'on possède
    const availableClasses = allClassOptions.filter(cls =>
      unlockedList.includes(cls.refId)
    );

    // CAS 1 : Aucune classe débloquée (Nouveau compte)
    // On lance directement le jeu sans rien demander
    if (availableClasses.length === 0) {
      console.log("[ClassSelect] Aucune classe débloquée. Démarrage standard.");
      this.game.startGame(null); // null = pas de classe
      return;
    }

    // CAS 2 : Des classes sont dispos, on affiche l'écran de choix
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