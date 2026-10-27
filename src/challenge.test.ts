import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { LEVELS, makeQuestion, shuffle, type Option, type Rand } from './challenge.ts';
import type { Dino } from './dinos.ts';
import { dietName, periodName } from './text.ts';

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
      if (q.kind === 'silhouette' && q.show && 'silhouette' in q.show) {
        assert.equal(key(right), q.show.silhouette, where);
        assert.equal(q.prompt.sv, 'Vilken dinosaurie är det?', where);
        assert.equal(q.prompt.en, 'Who is it?', where);
        assert.equal(q.say, 'who', where);
      }
      if (q.kind === 'math') {
        const m = /^(\d+) ([+−×]) (\d+)/.exec(q.prompt.sv);
        assert.ok(m, where);
        const [a, op, b] = [Number(m[1]), m[2], Number(m[3])];
        const value = op === '+' ? a + b : op === '−' ? a - b : a * b;
        assert.equal(key(right), String(value), where);
        assert.ok(value >= 0, where);
      }
      if (q.kind === 'fact' && q.prompt.sv.startsWith('Vad åt')) {
        assert.ok('text' in right, where);
        assert.equal(right.text.sv, dietName('sv', target.diet), where);
        assert.equal(right.text.en, dietName('en', target.diet), where);
        for (const o of q.options) {
          assert.ok('text' in o, where);
          assert.ok(o.text.sv && o.text.sv.length > 0, where);
          assert.ok(o.text.en && o.text.en.length > 0, where);
        }
      }
      if (q.kind === 'fact' && q.prompt.sv.startsWith('När levde')) {
        assert.ok('text' in right, where);
        assert.equal(right.text.sv, periodName('sv', target.period), where);
        assert.equal(right.text.en, periodName('en', target.period), where);
        for (const o of q.options) {
          assert.ok('text' in o, where);
          assert.ok(o.text.sv && o.text.sv.length > 0, where);
          assert.ok(o.text.en && o.text.en.length > 0, where);
        }
      }
      if (q.kind === 'fact' && q.prompt.sv === 'Vilken var längst?') {
        assert.equal(q.prompt.en, 'Which one was longest?', where);
        assert.equal(q.say, 'longest', where);
        const len = (o: Option) => DINOS.find((d) => d.name === key(o))!.lengthM;
        for (const o of q.options) {
          assert.ok('text' in o, where);
          const d = DINOS.find((d) => d.name === o.text.sv);
          assert.ok(d && !d.wingspan, `${where}: wingspan animal in longest options`);
          if (o !== right) assert.ok(len(right) > len(o), where);
        }
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

test('silhouette questions: prompt, audio, show, and 3-image threshold', () => {
  const threeImages = ['triceratops', 'stegosaurus', 'tyrannosaurus-rex'];
  const rand = () => 0.1; // < 0.5 triggers silhouette in small/mid
  const q = makeQuestion('small', rand, DINOS[0]!, DINOS, threeImages);
  assert.equal(q.kind, 'silhouette');
  assert.equal(q.prompt.sv, 'Vilken dinosaurie är det?');
  assert.equal(q.prompt.en, 'Who is it?');
  assert.equal(q.say, 'who');
  assert.ok(q.show && 'silhouette' in q.show);
  assert.ok(threeImages.includes(q.show.silhouette));
  assert.equal(q.options.length, 3);
  const right = q.options[q.answer];
  assert.ok(right && 'dino' in right);
  assert.equal(right.dino, q.show.silhouette);
});

test('branching probabilities: big math vs fact, and mid add vs sub', () => {
  const withFirst = (firstVal: number, seed = 42) => {
    const prng = seeded(seed);
    let first = true;
    return () => {
      if (first) {
        first = false;
        return firstVal;
      }
      return prng();
    };
  };

  // big level: rand() < 0.5 -> math; rand() >= 0.5 -> fact
  const qBigMath = makeQuestion('big', withFirst(0.2), DINOS[0]!, DINOS, []);
  assert.equal(qBigMath.kind, 'math', 'rand < 0.5 must choose math for big');

  const qBigFact = makeQuestion('big', withFirst(0.5), DINOS[0]!, DINOS, []);
  assert.equal(qBigFact.kind, 'fact', 'rand >= 0.5 (boundary 0.5) must choose fact for big');

  // mid level math: rand() < 0.5 -> addition; rand() >= 0.5 -> subtraction
  const qMidAdd = makeQuestion('mid', withFirst(0.2), DINOS[0]!, DINOS, []);
  assert.equal(qMidAdd.kind, 'math');
  assert.ok(qMidAdd.prompt.sv.includes(' + '), 'rand < 0.5 must choose addition');

  const qMidSub = makeQuestion('mid', withFirst(0.5), DINOS[0]!, DINOS, []);
  assert.equal(qMidSub.kind, 'math');
  assert.ok(qMidSub.prompt.sv.includes(' − '), 'rand >= 0.5 (boundary 0.5) must choose subtraction');
});

test('diet fact questions: right answer, translations, and carnivore/piscivore mutual exclusion', () => {
  const carnivore = DINOS.find((d) => d.diet === 'carnivore')!;
  const piscivore = DINOS.find((d) => d.diet === 'piscivore')!;

  for (let s = 1; s <= 50; s++) {
    const prng = seeded(s);
    let call = 0;
    const rand = () => {
      call++;
      if (call === 1) return 0.8; // big -> fact
      if (call === 2) return 0.1; // fact -> type 0 (diet)
      return prng();
    };

    // Carnivore question
    const qCarn = makeQuestion('big', rand, carnivore, DINOS, []);
    assert.equal(qCarn.kind, 'fact');
    assert.equal(qCarn.prompt.sv, `Vad åt ${carnivore.name}?`);
    assert.equal(qCarn.prompt.en, `What did ${carnivore.name} eat?`);

    const rightCarn = qCarn.options[qCarn.answer];
    assert.ok(rightCarn && 'text' in rightCarn);
    assert.equal(rightCarn.text.sv, dietName('sv', 'carnivore'));
    assert.equal(rightCarn.text.en, dietName('en', 'carnivore'));

    // Options must have both sv and en, and must never include piscivore (fish)
    for (const opt of qCarn.options) {
      assert.ok('text' in opt);
      assert.ok(opt.text.sv && opt.text.sv.length > 0);
      assert.ok(opt.text.en && opt.text.en.length > 0);
      assert.notEqual(opt.text.sv, dietName('sv', 'piscivore'), 'carnivore question must exclude piscivore');
      assert.notEqual(opt.text.en, dietName('en', 'piscivore'));
    }
  }

  for (let s = 1; s <= 50; s++) {
    const prng = seeded(s);
    let call = 0;
    const rand = () => {
      call++;
      if (call === 1) return 0.8; // big -> fact
      if (call === 2) return 0.1; // fact -> type 0 (diet)
      return prng();
    };

    // Piscivore question
    const qPisc = makeQuestion('big', rand, piscivore, DINOS, []);
    const rightPisc = qPisc.options[qPisc.answer];
    assert.ok(rightPisc && 'text' in rightPisc);
    assert.equal(rightPisc.text.sv, dietName('sv', 'piscivore'));
    assert.equal(rightPisc.text.en, dietName('en', 'piscivore'));

    // Options must never include carnivore (meat)
    for (const opt of qPisc.options) {
      assert.ok('text' in opt);
      assert.notEqual(opt.text.sv, dietName('sv', 'carnivore'), 'piscivore question must exclude carnivore');
      assert.notEqual(opt.text.en, dietName('en', 'carnivore'));
    }
  }
});

test('period fact questions: type selection, right answer, and translations', () => {
  const target = DINOS[0]!;
  let call = 0;
  const rand = () => {
    call++;
    if (call === 1) return 0.8; // big -> fact
    if (call === 2) return 0.4; // int(rand, 0, 2) with 0.4 -> type 1 (period)
    return 0.1;
  };

  const q = makeQuestion('big', rand, target, DINOS, []);
  assert.equal(q.kind, 'fact');
  assert.equal(q.prompt.sv, `När levde ${target.name}?`);
  assert.equal(q.prompt.en, `When did ${target.name} live?`);

  const right = q.options[q.answer];
  assert.ok(right && 'text' in right);
  assert.equal(right.text.sv, periodName('sv', target.period));
  assert.equal(right.text.en, periodName('en', target.period));

  for (const opt of q.options) {
    assert.ok('text' in opt);
    assert.ok(opt.text.sv && opt.text.sv.length > 0);
    assert.ok(opt.text.en && opt.text.en.length > 0);
  }
});

test('longest fact questions: type selection, wingspan exclusion, and exact 10% gap', () => {
  // Fact type 2 must select longest question
  let call = 0;
  const rand = () => {
    call++;
    if (call === 1) return 0.8; // big -> fact
    if (call === 2) return 0.8; // int(rand, 0, 2) with 0.8 -> type 2 (longest)
    return 0.1;
  };
  const qType2 = makeQuestion('big', rand, DINOS[0]!, DINOS, []);
  assert.equal(qType2.kind, 'fact');
  assert.equal(qType2.prompt.sv, 'Vilken var längst?');

  // Wingspan exclusion: animals with wingspan must be excluded from pool
  const dWing: Dino = { ...DINOS[0]!, name: 'PterosaurWings', lengthM: 20, wingspan: true };
  const d1: Dino = { ...DINOS[0]!, name: 'Dino15', lengthM: 15, wingspan: undefined };
  const d2: Dino = { ...DINOS[0]!, name: 'Dino10', lengthM: 10, wingspan: undefined };
  const d3: Dino = { ...DINOS[0]!, name: 'Dino5', lengthM: 5, wingspan: undefined };
  const testDinos = [dWing, d1, d2, d3];

  let callWing = 0;
  const randWing = () => {
    callWing++;
    if (callWing === 1) return 0.8; // big -> fact
    if (callWing === 2) return 0.8; // fact -> longest
    return 0.1;
  };
  const qWing = makeQuestion('big', randWing, d1, testDinos, []);
  assert.equal(qWing.kind, 'fact');
  assert.equal(qWing.prompt.sv, 'Vilken var längst?');
  const optionNames = qWing.options.map((o) => ('text' in o ? o.text.sv : o.dino));
  assert.ok(!optionNames.includes('PterosaurWings'), 'animals with wingspan must be excluded from longest questions');
  const rightWing = qWing.options[qWing.answer];
  assert.ok(rightWing && 'text' in rightWing);
  assert.equal(rightWing.text.sv, 'Dino15');

  // Exact 10% gap (three[0].lengthM === three[1].lengthM * 1.1) must be accepted (< 1.1 vs <= 1.1)
  const dExact11: Dino = { ...DINOS[0]!, name: 'Dino11', lengthM: 11, wingspan: undefined };
  const dExact10: Dino = { ...DINOS[0]!, name: 'Dino10', lengthM: 10, wingspan: undefined };
  const dExact5: Dino = { ...DINOS[0]!, name: 'Dino5', lengthM: 5, wingspan: undefined };
  let callGap = 0;
  const randGap = () => {
    callGap++;
    if (callGap === 1) return 0.8;
    if (callGap === 2) return 0.8;
    return 0.1;
  };
  const qGap = makeQuestion('big', randGap, dExact11, [dExact11, dExact10, dExact5], []);
  assert.equal(qGap.kind, 'fact');
  assert.equal(qGap.prompt.sv, 'Vilken var längst?');
  const rightGap = qGap.options[qGap.answer];
  assert.ok(rightGap && 'text' in rightGap);
  assert.equal(rightGap.text.sv, 'Dino11');
});

test('longest fact questions: 20 failed attempts give up and reroll type', () => {
  const d1: Dino = { ...DINOS[0]!, name: 'D1', lengthM: 10, wingspan: undefined };
  const d2: Dino = { ...DINOS[0]!, name: 'D2', lengthM: 10, wingspan: undefined };
  const d3: Dino = { ...DINOS[0]!, name: 'D3', lengthM: 10, wingspan: undefined };
  const d4: Dino = { ...DINOS[0]!, name: 'D4', lengthM: 20, wingspan: undefined };
  const testDinos = [d1, d2, d3, d4];

  let call = 0;
  const rand = () => {
    call++;
    if (call === 1) return 0.8; // big -> fact
    if (call === 2) return 0.8; // fact -> type 2 (longest)
    if (call <= 62) return 0.8; // 20 tries of 3 calls: j = i keeps [d1, d2, d3, d4] (lengths 10, 10, 10 -> miss)
    if (call === 63) return 0.1; // in real code (< 20): reroll fact type 0 (diet)! In mutant (<= 20 or tries--): try 20 swaps d4 into slice(0,3) (hit)!
    return 0.8;
  };

  const q = makeQuestion('big', rand, d1, testDinos, []);
  // Real code gives up after 20 attempts and rerolls to diet question.
  // Mutant <= 20 or tries-- allows a 21st attempt which succeeds and returns 'longest'.
  assert.equal(q.kind, 'fact');
  assert.equal(q.prompt.sv, 'Vad åt D1?');
});
