import { TankPassive } from './TankPassive.js';
import { WarlockPassive } from './WarlockPassive.js';
import { BerserkPassive } from './BerserkPassive.js';
import { HunterPassive } from './HunterPassive.js';

export const passiveRegistry = {
  'TANK': TankPassive,
  'WARLOCK': WarlockPassive,
  'BERSERK': BerserkPassive,
  'HUNTER': HunterPassive,
};