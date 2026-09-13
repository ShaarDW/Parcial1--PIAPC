export const ARROWS = [
  { token: 'UP', symbol: '↑' },
  { token: 'DOWN', symbol: '↓' },
  { token: 'LEFT', symbol: '←' },
  { token: 'RIGHT', symbol: '→' },
];

export function generateSequence(length) {
  const sequence = [];
  for (let i = 0; i < length; i++) {
    const arrow = ARROWS[Math.floor(Math.random() * ARROWS.length)];
    sequence.push(arrow.token);
  }
  return sequence;
}