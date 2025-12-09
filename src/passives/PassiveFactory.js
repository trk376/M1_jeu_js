import { passiveRegistry } from './passiveRegistry.js';

class PassiveFactory {
  createPassive(classId, player, game) {
    const PassiveClass = passiveRegistry[classId];
    if (!PassiveClass) {
      console.error(`Classe passive inconnue: ${classId}`);
      return null;
    }
    return new PassiveClass(player, game);
  }
}

 
export const passiveFactory = new PassiveFactory();