import { map } from 'nanostores';

export const uiStore = map({
    currentScreen: 'MainMenu',

    health: 0,
    maxHealth: 20,
    souls: 0,
    unlockedClasses: [],

    score: 0,
    level: 1,
    weapon: null,

    roomCards: [],
    roomPicksLeft: 0,

    weaponDecision: null,
    classChoices: [],

    finalScore: 0,
    isFleeDisabled: false,
});