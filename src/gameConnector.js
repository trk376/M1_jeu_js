import { gameEvents } from '~/utils/EventBus.js';
import { uiStore } from '~/store.js';
 

 
 

export function connectGameToUI() {

   
  gameEvents.subscribe('stateChanged', (data) => {
     

     
    switch (data.name) {
      case 'ClassSelection':
        uiStore.setKey('classChoices', data.classes);
        break;
      case 'RoomDecision':
      case 'RoomPlaying':
        uiStore.setKey('roomCards', data.cards);
        uiStore.setKey('roomPicksLeft', data.picksLeft);
        break;
      case 'WeaponDecision':
        uiStore.setKey('weaponDecision', {
          monster: data.monster,
          weapon: data.weapon
        });
        break;
      case 'GameOver':
      case 'GameWin':  
        uiStore.setKey('finalScore', data.score);
        break;
    }

    uiStore.setKey('currentScreen', data.name);
  });

  gameEvents.subscribe('playerHealthChanged', (data) => {
    uiStore.setKey('health', data.current);
    uiStore.setKey('maxHealth', data.max);
  });

   
  gameEvents.subscribe('playerStatsChanged', (data) => {
    uiStore.setKey('health', data.current);
    uiStore.setKey('maxHealth', data.max);
    uiStore.setKey('score', data.score);
  });

   
  gameEvents.subscribe('playerWeaponChanged', (weapon) => {
    if (weapon) {
      uiStore.setKey('weapon', {
        name: weapon.name,
        power: weapon.power,
        ceiling: weapon.maxAttackCeiling === Infinity ? '∞' : weapon.maxAttackCeiling,
      });
    } else {
      uiStore.setKey('weapon', null);
    }
  });

   
  gameEvents.subscribe('loopChanged', (data) => {
    uiStore.setKey('level', data.level);
  });

   
  gameEvents.subscribe('disableFleeButton', (disabled) => {
    uiStore.setKey('isFleeDisabled', disabled);
  });
}
