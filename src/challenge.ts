import type { Diet, Dino, L, Period } from './dinos.ts';
import { dietName, periodName } from './text.ts';

/** small = 3 to 5 years, mid = 6 to 7, big = 8 to 10. */
export type Level = 'small' | 'mid' | 'big';
export const LEVELS: readonly Level[] = ['small', 'mid', 'big'];
export const WINS_NEEDED = 5;

export type Option = { text: L } | { dino: string };

export interface Question {
  kind: 'count' | 'math' | 'silhouette' | 'fact';
  prompt: L;
  /** Things to count, or the id of the animal shown as a dark shape. */
  show?: { emoji: string; n: number } | { silhouette: string };
  options: Option[];
  answer: number;
}

export type Rand = () => number;

const int = (rand: Rand, lo: number, hi: number): number => lo + Math.floor(rand() * (hi - lo + 1));
const pick = <T>(rand: Rand, xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)] as T;

export function shuffle<T>(rand: Rand, xs: readonly T[]): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

const same = (s: string): L => ({ sv: s, en: s });

/** The right answer plus `wrong` as shuffled options. */
function build(rand: Rand, q: Omit<Question, 'options' | 'answer'>, right: Option, wrong: Option[]): Question {
  const options = shuffle(rand, [right, ...wrong]);
  return { ...q, options, answer: options.indexOf(right) };
}

function numberQuestion(rand: Rand, q: Omit<Question, 'options' | 'answer'>, value: number): Question {
  const wrong = new Set<number>();
  while (wrong.size < 2) {
    const n = value + int(rand, -3, 3);
    if (n !== value && n >= 0) wrong.add(n);
  }
  return build(rand, q, { text: same(String(value)) }, [...wrong].map((n) => ({ text: same(String(n)) })));
}

function count(rand: Rand): Question {
  const n = int(rand, 1, 9);
  const [emoji, sv, en] = pick(rand, [
    ['🥚', 'ägg', 'eggs'],
    ['🦴', 'ben', 'bones'],
    ['🌿', 'blad', 'leaves'],
  ] as const);
  return numberQuestion(
    rand,
    { kind: 'count', prompt: { sv: `Hur många ${sv}?`, en: `How many ${en}?` }, show: { emoji, n } },
    n,
  );
}

function math(rand: Rand, level: Level): Question {
  let text: string;
  let value: number;
  if (level === 'big') {
    const a = int(rand, 2, 10);
    const b = int(rand, 2, 10);
    text = `${a} × ${b}`;
    value = a * b;
  } else if (rand() < 0.5) {
    const a = int(rand, 1, 10);
    const b = int(rand, 1, 10);
    text = `${a} + ${b}`;
    value = a + b;
  } else {
    const a = int(rand, 2, 20);
    const b = int(rand, 1, a);
    text = `${a} − ${b}`;
    value = a - b;
  }
  return numberQuestion(rand, { kind: 'math', prompt: same(`${text} = ?`) }, value);
}

function silhouette(rand: Rand, withImage: readonly string[]): Question {
  const [right, ...wrong] = shuffle(rand, withImage).slice(0, 3) as [string, string, string];
  return build(
    rand,
    { kind: 'silhouette', prompt: { sv: 'Vem är det?', en: 'Who is it?' }, show: { silhouette: right } },
    { dino: right },
    wrong.map((dino) => ({ dino })),
  );
}

const DIETS: readonly Diet[] = ['carnivore', 'herbivore', 'piscivore', 'omnivore'];
const PERIODS: readonly Period[] = ['triassic', 'jurassic', 'cretaceous'];
const label = (f: (lang: 'sv' | 'en') => string): L => ({ sv: f('sv'), en: f('en') });

function fact(rand: Rand, target: Dino, dinos: readonly Dino[]): Question {
  const type = int(rand, 0, 2);
  if (type === 0) {
    const wrong = shuffle(rand, DIETS.filter((d) => d !== target.diet)).slice(0, 2);
    return build(
      rand,
      { kind: 'fact', prompt: { sv: `Vad åt ${target.name}?`, en: `What did ${target.name} eat?` } },
      { text: label((l) => dietName(l, target.diet)) },
      wrong.map((d) => ({ text: label((l) => dietName(l, d)) })),
    );
  }
  if (type === 1) {
    return build(
      rand,
      { kind: 'fact', prompt: { sv: `När levde ${target.name}?`, en: `When did ${target.name} live?` } },
      { text: label((l) => periodName(l, target.period)) },
      PERIODS.filter((p) => p !== target.period).map((p) => ({ text: label((l) => periodName(l, p)) })),
    );
  }
  // Longest of three. Wingspans are not body lengths, so those animals sit this one out,
  // and near-ties are skipped: the sizes are estimates, a 10 % gap must separate first from second.
  const pool = dinos.filter((d) => !d.wingspan);
  for (let tries = 0; tries < 20; tries++) {
    const three = shuffle(rand, pool).slice(0, 3).sort((a, b) => b.lengthM - a.lengthM) as [Dino, Dino, Dino];
    if (three[0].lengthM < three[1].lengthM * 1.1) continue;
    return build(
      rand,
      { kind: 'fact', prompt: { sv: 'Vilken var längst?', en: 'Which one was longest?' } },
      { text: same(three[0].name) },
      [{ text: same(three[1].name) }, { text: same(three[2].name) }],
    );
  }
  return fact(rand, target, dinos); // ponytail: reroll the type; 20 misses in a row needs a catalog of near-equal lengths
}

/**
 * One question for the level. `withImage` lists the animals whose picture exists:
 * silhouette questions need three of them and are left out until then.
 */
export function makeQuestion(
  level: Level,
  rand: Rand,
  target: Dino,
  dinos: readonly Dino[],
  withImage: readonly string[],
): Question {
  const canMatch = withImage.length >= 3;
  if (level === 'big') return rand() < 0.5 ? math(rand, level) : fact(rand, target, dinos);
  if (canMatch && rand() < 0.5) return silhouette(rand, withImage);
  return level === 'small' ? count(rand) : math(rand, level);
}
