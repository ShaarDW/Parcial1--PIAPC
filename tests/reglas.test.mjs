import { test } from 'node:test';
import assert from 'node:assert/strict';

import { GAME_DURATION, BITE_MIN_WAIT, BITE_MAX_WAIT, QTE_DURATION, RARITIES } from '../src/config.js';
import { selectRarity } from '../src/rarity.js';
import { ARROWS, generateSequence } from '../src/qte.js';

function withFixedRandom(value, fn) {
  const original = Math.random;
  Math.random = () => value;
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

function withSeededRandom(fn) {
  const original = Math.random;
  let seed = 123456789;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  Math.random = lcg;
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

test('constantes de partida coinciden con el GDD', () => {
  assert.equal(GAME_DURATION, 180, 'la partida dura 180 s');
  assert.equal(BITE_MIN_WAIT, 3, 'pique minimo a los 3 s');
  assert.equal(BITE_MAX_WAIT, 5, 'pique maximo a los 5 s');
  assert.equal(QTE_DURATION, 6, 'QTE de 6 s');
});

test('la tabla de rarezas coincide con el GDD', () => {
  const expected = [
    { id: 'common', probability: 0.3, reward: 100, sequenceLength: 3 },
    { id: 'rare', probability: 0.25, reward: 300, sequenceLength: 4 },
    { id: 'epic', probability: 0.2, reward: 500, sequenceLength: 5 },
    { id: 'legendary', probability: 0.15, reward: 700, sequenceLength: 6 },
    { id: 'mythic', probability: 0.1, reward: 1200, sequenceLength: 7 },
  ];
  assert.equal(RARITIES.length, 5, 'hay 5 rarezas');
  expected.forEach((row, i) => {
    assert.equal(RARITIES[i].id, row.id);
    assert.equal(RARITIES[i].probability, row.probability);
    assert.equal(RARITIES[i].reward, row.reward);
    assert.equal(RARITIES[i].sequenceLength, row.sequenceLength);
  });
});

test('las probabilidades suman 100 % y cada una esta en (0, 1]', () => {
  const sum = RARITIES.reduce((acc, r) => {
    assert.ok(r.probability > 0 && r.probability <= 1, `probabilidad de ${r.id} invalida`);
    return acc + r.probability;
  }, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `suma ${sum} distinta de 1`);
});

test('las recompensas y secuencias son unicas y crecientes por rareza', () => {
  const rewards = RARITIES.map((r) => r.reward);
  const lengths = RARITIES.map((r) => r.sequenceLength);
  assert.equal(new Set(rewards).size, 5, 'recompensas unicas');
  assert.deepEqual(lengths, [3, 4, 5, 6, 7], 'secuencias de 3 a 7 en orden');
});

test('selectRarity sortea dentro de los intervalos acumulados', () => {
  const bounds = [];
  let acc = 0;
  for (const r of RARITIES) {
    bounds.push({ id: r.id, from: acc, to: acc + r.probability });
    acc += r.probability;
  }

  for (const band of bounds) {
    const probe = (band.from + band.to) / 2;
    const rarity = withFixedRandom(probe, () => selectRarity());
    assert.equal(rarity.id, band.id, `roll ${probe} deberia caer en ${band.id}`);
  }

  const first = withFixedRandom(0.0, () => selectRarity());
  assert.equal(first.id, bounds[0].id, 'roll 0 cae en la primera rareza');

  const last = withFixedRandom(0.999999, () => selectRarity());
  assert.equal(last.id, bounds[bounds.length - 1].id, 'roll 1 cae en la ultima rareza');
});

test('selectRarity nunca devuelve undefined ni fuera de tabla', () => {
  withSeededRandom(() => {
    for (let i = 0; i < 20000; i++) {
      const rarity = selectRarity();
      assert.ok(rarity && rarity.id, `tirada ${i} sin rareza`);
      assert.ok(RARITIES.includes(rarity), `tirada ${i} fuera de tabla`);
    }
  });
});

test('la distribucion de rarezas esta dentro de +/-3 % sobre 20000 tiradas', () => {
  const counts = Object.fromEntries(RARITIES.map((r) => [r.id, 0]));
  withSeededRandom(() => {
    for (let i = 0; i < 20000; i++) {
      counts[selectRarity().id] += 1;
    }
  });

  const tolerance = 20000 * 0.03;
  for (const r of RARITIES) {
    const expected = 20000 * r.probability;
    const diff = Math.abs(counts[r.id] - expected);
    assert.ok(
      diff <= tolerance,
      `${r.id}: observado ${counts[r.id]}, esperado ~${expected.toFixed(0)}, diferencia ${diff.toFixed(0)} > ${tolerance}`,
    );
  }
});

test('generateSequence respeta la longitud pedida', () => {
  for (let length = 0; length <= 7; length++) {
    const seq = generateSequence(length);
    assert.equal(seq.length, length, `longitud ${length} no respetada`);
  }
});

test('generateSequence solo produce tokens validos (UP/DOWN/LEFT/RIGHT)', () => {
  const valid = new Set(ARROWS.map((a) => a.token));
  const seq = generateSequence(7);
  for (const token of seq) {
    assert.ok(valid.has(token), `token invalido ${token}`);
  }
});

test('ARROWS define exactamente las 4 direcciones del juego', () => {
  const tokens = ARROWS.map((a) => a.token).sort();
  assert.deepEqual(tokens, ['DOWN', 'LEFT', 'RIGHT', 'UP']);
  assert.equal(new Set(tokens).size, 4, 'no hay direcciones duplicadas');
});