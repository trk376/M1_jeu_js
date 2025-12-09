import { cardFactory } from '~/cards/CardFactory.js';
export class Deck {
  constructor() {
    this.drawPile = [];
    this.discardPile = [];
    this.masterDeckList = [];
  }

  fillDeck(cardIds, game) {
    this.masterDeckList = cardIds;
    this.resetAndRefill(game);
  }

  resetAndRefill(game) {
    this.drawPile = [];
    this.discardPile = [];

    this.drawPile = this.masterDeckList.map(id =>
      cardFactory.createCard(id, game)
    );

    this.shuffle();
    console.log(`[Deck] Deck re-rempli pour la Boucle ${game.loopLevel}`);
  }

  shuffle() {

    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
    }
    console.log("[Deck] Pioche mélangée.");
  }

  draw(count) {

    return this.drawPile.splice(0, count);
  }

  discard(card) {
    this.discardPile.push(card);
  }

  flee(cards) {

    this.discardPile.push(...cards);
  }

  calculateRemainingMonsterScore() {

    const allRemainingCards = [...this.drawPile, ...this.discardPile];


    const monsterCards = allRemainingCards.filter(card => card.type === 'monster');



    const score = monsterCards.reduce((total, card) => {
      return total + card.effects[0].value;
    }, 0);

    return score;
  }
}