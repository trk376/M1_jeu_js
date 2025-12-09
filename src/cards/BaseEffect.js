export class BaseEffect {
  constructor(value) {
    this.value = value;
  }
  execute(player, game, options, card) {
    throw new Error("Execute method not implemented!");
  }
}