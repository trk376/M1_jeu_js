export class Card {
  constructor(name, type, effects) {
    this.name = name;
    this.type = type;
    this.effects = effects;  
  }

  play(player, game, options = {}) {
    for (const effect of this.effects) {
      effect.execute(player, game, options, this);
    }
  }
}