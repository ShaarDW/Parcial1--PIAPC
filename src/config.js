export const GAME_DURATION = 180;

export const BITE_MIN_WAIT = 3;
export const BITE_MAX_WAIT = 5;

export const QTE_DURATION = 6;

export const RARITIES = [
  { id: 'common', label: 'Comun', probability: 0.3, reward: 100, sequenceLength: 3 },
  { id: 'rare', label: 'Raro', probability: 0.25, reward: 300, sequenceLength: 4 },
  { id: 'epic', label: 'Epico', probability: 0.2, reward: 500, sequenceLength: 5 },
  { id: 'legendary', label: 'Legendario', probability: 0.15, reward: 700, sequenceLength: 6 },
  { id: 'mythic', label: 'Mitico', probability: 0.1, reward: 1200, sequenceLength: 7 },
];