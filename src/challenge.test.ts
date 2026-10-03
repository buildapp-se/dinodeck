import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { LEVELS, makeQuestion, type Option, type Rand } from './challenge.ts';

// Small seeded generator so a failure can be replayed.
function seeded(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const key = (o: Option): string => ('dino' in o ? o.dino : o.text.sv);
const withImage = DINOS.slice(0, 6).map((d) => d.id);

test('every question has three distinct options and a correct answer', () => {
  const kinds = new Set<string>();
  for (const level of LEVELS) {
    for (let seed = 1; seed <= 400; seed++) {
      const rand = seeded(seed);
      const target = DINOS[seed % DINOS.length]!;
      const q = makeQuestion(level, rand, target, DINOS, withImage);
      const where = `${level} seed ${seed} ${q.kind}`;
      kinds.add(`${level}:${q.kind}`);
      assert.equal(q.options.length, 3, where);
      assert.equal(new Set(q.options.map(key)).size, 3, `${where}: duplicate option`);
      const right = q.options[q.answer];
      assert.ok(right, where);

      if (q.kind === 'count' && q.show && 'n' in q.show) assert.equal(key(right), String(q.show.n), where);
      if (q.kind === 'silhouette' && q.show && 'silhouette' in q.show) assert.equal(key(right), q.show.silhouette, where);
      if (q.kind === 'math') {
        const m = /^(\d+) ([+−×]) (\d+)/.exec(q.prompt.sv);
        assert.ok(m, where);
        const [a, op, b] = [Number(m[1]), m[2], Number(m[3])];
        const value = op === '+' ? a + b : op === '−' ? a - b : a * b;
        assert.equal(key(right), String(value), where);
        assert.ok(value >= 0, where);
      }
      if (q.kind === 'fact' && q.prompt.sv === 'Vilken var längst?') {
        const len = (o: Option) => DINOS.find((d) => d.name === key(o))!.lengthM;
        for (const o of q.options) if (o !== right) assert.ok(len(right) > len(o), where);
      }
    }
  }
  assert.deepEqual([...kinds].sort(), ['big:fact', 'big:math', 'mid:math', 'mid:silhouette', 'small:count', 'small:silhouette']);
});

test('no silhouette questions until three pictures exist', () => {
  for (let seed = 1; seed <= 200; seed++) {
    assert.notEqual(makeQuestion('small', seeded(seed), DINOS[0]!, DINOS, ['a', 'b']).kind, 'silhouette');
  }
});
