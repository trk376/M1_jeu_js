import { Player } from './Player.js';
import { Deck } from './Deck.js';
import { MainMenuState } from '~/state/MainMenuState.js';
import { DrawingRoomState } from '~/state/DrawingRoomState.js';
import { cardFactory } from '~/cards/CardFactory.js';
import { upgradeManager } from '~/upgrades/UpgradeManager.js';
import { gameEvents } from '~/utils/EventBus.js';
import { GameOverState } from '~/state/GameOverState.js';


export class Game {
  constructor() {
    this.player = null;
    this.deck = null;
    this.currentState = null;
    this.currentRoomCards = [];
    this.roomPicksLeft = 0;
    this.roomAvailableCards = [];
    this.loopLevel = 1;
    this.masterDeckList = [];

    this.permanentMaxHealth = 20;
  }

  // FIX: Fonction requise par index.astro
  setPermanentMaxHealth(value) {
    console.log(`[Game] PV Max synchronisés : ${value}`);
    this.permanentMaxHealth = value;
    if (this.player) {
      this.player.setMaxHealth(value);
    }
  }

  init() {
    this.setState(new MainMenuState(this));
  }

  startGame(classId) {
    this.loopLevel = 1;
    this.player = new Player();
    this.deck = new Deck();

    // Application du bonus de santé acheté
    if (this.permanentMaxHealth > 20) {
      this.player.setMaxHealth(this.permanentMaxHealth);
      this.player.health = this.permanentMaxHealth;
    }

    upgradeManager.selectUpgrade(this.player, classId, this);

    gameEvents.publish('playerStatsChanged', {
      current: this.player.health,
      max: this.player.maxHealth,
      score: this.player.score
    });

    this.masterDeckList = [
      "POTION_S", "SWORD", "GOBLIN", "ORC",
      "POTION_L", "AXE", "GOBLIN", "GOBLIN"
    ];

    this.deck.fillDeck(this.masterDeckList, this);
    this.setState(new DrawingRoomState(this));
  }

  setState(newState) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = newState;
    this.currentState.enter();
  }

  quitGame() {
    if (this.player && this.player.passives.length > 0) {
      for (const passive of this.player.passives) {
        passive.onRemoved();
      }
    }
    this.player = null;
    this.deck = null;
    this.loopLevel = 1;
    this.masterDeckList = [];
    this.previousState = null;
    this.currentRoomCards = [];
    this.setState(new MainMenuState(this));
  }

  startNewLoop() {
    this.loopLevel++;
    this.player.addScore(100);
    gameEvents.publish('loopChanged', { level: this.loopLevel });
    this.deck.resetAndRefill(this);
    this.setState(new DrawingRoomState(this));
  }

  resolveCardImmediate(card, options = {}) {
    card.play(this.player, this, options);
    if (card.type === 'monster') {
      const weapon = options.useWeapon ? this.player.weapon : null;
      gameEvents.publish('monsterResolved', {
        player: this.player, card: card, weaponUsed: weapon
      });
    }
    if (this.player.health <= 0 && this.currentState.constructor.name !== "GameOverState") {
      this.setState(new GameOverState(this));
      return true;
    }
    return false;
  }
}