import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { LEVELS, makeQuestion, shuffle, type Option, type Rand } from './challenge.ts';

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

test('shuffle produces all permutations and does not mutate input', () => {
  const xs = ['a', 'b', 'c'];
  const perms = new Set<string>();
  for (let seed = 1; seed <= 50; seed++) {
    const copy = [...xs];
    const out = shuffle(seeded(seed), copy);
    assert.deepEqual(copy, xs, 'input must not be mutated');
    assert.deepEqual([...out].sort(), [...xs].sort(), 'elements must be preserved');
    perms.add(out.join(''));
  }
  assert.equal(perms.size, 6, 'all 6 permutations of 3 elements must be possible');
});

test('options are shuffled so the answer is not always at the same index', () => {
  const answers = new Set<number>();
  for (let seed = 1; seed <= 50; seed++) {
    const q = makeQuestion('small', seeded(seed), DINOS[0]!, DINOS, withImage);
    answers.add(q.answer);
  }
  assert.deepEqual([...answers].sort(), [0, 1, 2], 'answer must appear at all option indices');
});

test('count questions: prompt, range, audio, and non-negative options', () => {
  const counts = new Set<number>();
  let hasZeroOption = false;

  for (let seed = 1; seed <= 400; seed++) {
    const q = makeQuestion('small', seeded(seed), DINOS[seed % DINOS.length]!, DINOS, []);
    assert.equal(q.kind, 'count');
    assert.equal(q.prompt.sv, 'Hur många dinosaurier?');
    assert.equal(q.prompt.en, 'How many dinosaurs?');
    assert.equal(q.say, 'count');
    assert.ok(q.show && 'n' in q.show);
    const n = q.show.n;
    assert.ok(n >= 1 && n <= 5, `count for small must be between 1 and 5, got ${n}`);
    counts.add(n);

    for (const opt of q.options) {
      assert.ok('text' in opt);
      const val = Number(opt.text.sv);
      assert.ok(!isNaN(val) && val >= 0, `option must be non-negative, got ${opt.text.sv}`);
      if (val === 0) hasZeroOption = true;
    }
  }

  assert.deepEqual([...counts].sort((a, b) => a - b), [1, 2, 3, 4, 5], 'count must cover 1 to 5');
  assert.ok(hasZeroOption, '0 should be possible as a distractor option');
});

test('math questions: big uses multiplication, mid uses addition and subtraction', () => {
  const bigOps = new Set<string>();
  const midOps = new Set<string>();
  const bigOperands = new Set<number>();

  for (let seed = 1; seed <= 400; seed++) {
    const qBig = makeQuestion('big', seeded(seed), DINOS[seed % DINOS.length]!, DINOS, []);
    if (qBig.kind === 'math') {
      const match = /^(\d+) ([+−×]) (\d+) = \?$/.exec(qBig.prompt.sv);
      assert.ok(match, `invalid math prompt: ${qBig.prompt.sv}`);
      assert.equal(qBig.prompt.en, qBig.prompt.sv);
      const a = Number(match[1]);
      const op = match[2]!;
      const b = Number(match[3]);
      bigOps.add(op);
      bigOperands.add(a);
      bigOperands.add(b);
    }

    const qMid = makeQuestion('mid', seeded(seed), DINOS[seed % DINOS.length]!, DINOS, []);
    if (qMid.kind === 'math') {
      const match = /^(\d+) ([+−×]) (\d+) = \?$/.exec(qMid.prompt.sv);
      assert.ok(match, `invalid math prompt: ${qMid.prompt.sv}`);
      assert.equal(qMid.prompt.en, qMid.prompt.sv);
      const op = match[2]!;
      midOps.add(op);
    }
  }

  assert.deepEqual([...bigOps], ['×'], 'big math must only use multiplication');
  assert.ok(bigOperands.has(10), 'multiplication operands should reach 10');
  assert.deepEqual([...midOps].sort(), ['+', '−'], 'mid math must use both addition and subtraction');
});

test('fact questions: generate diet, period, and longest questions', () => {
  const types = new Set<string>();

  for (let seed = 1; seed <= 400; seed++) {
    const q = makeQuestion('big', seeded(seed), DINOS[seed % DINOS.length]!, DINOS, []);
    if (q.kind === 'fact') {
      if (q.prompt.sv.startsWith('Vad åt')) {
        types.add('diet');
        assert.ok(q.prompt.en.startsWith('What did'));
      } else if (q.prompt.sv.startsWith('När levde')) {
        types.add('period');
        assert.ok(q.prompt.en.startsWith('When did'));
      } else if (q.prompt.sv === 'Vilken var längst?') {
        types.add('longest');
        assert.equal(q.prompt.en, 'Which one was longest?');
        assert.equal(q.say, 'longest');
      }
    }
  }

  assert.deepEqual([...types].sort(), ['diet', 'longest', 'period'], 'all three fact types must appear');
});
