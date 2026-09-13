import { RARITIES } from './config.js';

export function selectRarity() {
  const roll = Math.random();
  let accumulated = 0;
  for (const rarity of RARITIES) {
    accumulated += rarity.probability;
    if (roll < accumulated) {
      return rarity;
    }
  }
  return RARITIES[RARITIES.length - 1];
}