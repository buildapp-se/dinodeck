import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { advance, deckOrder, isNewCard, KEY, loadState, markSeen, markWon, MAX_SCENE_ITEMS, parseState, resetCollection, saveState, type State, toggleFavorite, weekStart, wonThisWeek } from './state.ts';

const ids = DINOS.map((d) => d.id);

test('parseState survives junk and drops unknown ids', () => {
  assert.deepEqual(parseState(null, ids, 'sv'), { v: 1, lang: 'sv', favorites: [], won: [], wonAt: {}, seen: [], scene: { bg: 'jurassic', items: [] }, unlockAll: false, muted: false, cute: false, onboarded: false, hatched: [], eggDay: '' });
  assert.deepEqual(parseState('{nope', ids, 'en'), { v: 1, lang: 'en', favorites: [], won: [], wonAt: {}, seen: [], scene: { bg: 'jurassic', items: [] }, unlockAll: false, muted: false, cute: false, onboarded: false, hatched: [], eggDay: '' });
  assert.deepEqual(parseState('null', ids, 'sv'), { v: 1, lang: 'sv', favorites: [], won: [], wonAt: {}, seen: [], scene: { bg: 'jurassic', items: [] }, unlockAll: false, muted: false, cute: false, onboarded: false, hatched: [], eggDay: '' });
  assert.deepEqual(parseState('123', ids, 'sv'), { v: 1, lang: 'sv', favorites: [], won: [], wonAt: {}, seen: [], scene: { bg: 'jurassic', items: [] }, unlockAll: false, muted: false, cute: false, onboarded: false, hatched: [], eggDay: '' });
  assert.deepEqual(parseState('"junk"', ids, 'sv'), { v: 1, lang: 'sv', favorites: [], won: [], wonAt: {}, seen: [], scene: { bg: 'jurassic', items: [] }, unlockAll: false, muted: false, cute: false, onboarded: false, hatched: [], eggDay: '' });
  assert.deepEqual(parseState('true', ids, 'sv'), { v: 1, lang: 'sv', favorites: [], won: [], wonAt: {}, seen: [], scene: { bg: 'jurassic', items: [] }, unlockAll: false, muted: false, cute: false, onboarded: false, hatched: [], eggDay: '' });
  assert.deepEqual(parseState('[]', ids, 'sv').favorites, []);
  const s = parseState(JSON.stringify({ lang: 'en', favorites: ['triceratops', 'dragon', 7, 'triceratops'], won: ['spinosaurus', 'x'], wonAt: { spinosaurus: '2026-10-26', dragon: '2026-10-26', triceratops: 'igår', allosaurus: 7 }, seen: ['spinosaurus', 'dragon', 7, 'spinosaurus'], scene: { bg: 'mars', items: [{ id: 'triceratops', x: 7, y: 'a', size: 0, flip: 1 }, { id: 'dragon' }, 5] }, unlockAll: 'yes', muted: true, hatched: ['triceratops', 'dragon'], eggDay: 'igår' }), ids, 'sv');
  assert.deepEqual(s, {
    v: 1,
    lang: 'en',
    favorites: ['triceratops'],
    won: ['spinosaurus'],
    wonAt: { spinosaurus: '2026-10-26' },
    seen: ['spinosaurus'],
    scene: { bg: 'jurassic', items: [{ id: 'triceratops', x: 1, y: 0.7, size: 0.12, flip: false }] },
    unlockAll: false,
    muted: true,
    cute: false,
    onboarded: false,
    hatched: ['triceratops'],
    eggDay: '',
  });
});

test('parseState validates background period and falls back to jurassic', () => {
  assert.equal(parseState(JSON.stringify({ scene: { bg: 'triassic' } }), ids, 'sv').scene.bg, 'triassic');
  assert.equal(parseState(JSON.stringify({ scene: { bg: 'cretaceous' } }), ids, 'sv').scene.bg, 'cretaceous');
  assert.equal(parseState(JSON.stringify({ scene: { bg: 'jurassic' } }), ids, 'sv').scene.bg, 'jurassic');
  assert.equal(parseState(JSON.stringify({ scene: { bg: '' } }), ids, 'sv').scene.bg, 'jurassic');
  assert.equal(parseState(JSON.stringify({ scene: { bg: 'unknown' } }), ids, 'sv').scene.bg, 'jurassic');
});

test('parseState validates scene items: clamping, non-finite values, flipping, and capping', () => {
  const flipped = parseState(JSON.stringify({ scene: { items: [{ id: 'triceratops', flip: true }] } }), ids, 'sv');
  assert.equal(flipped.scene.items[0]?.flip, true);

  const nonFinite = parseState('{"scene":{"items":[{"id":"triceratops","x":1e999,"y":-1e999,"size":1e999}]}}', ids, 'sv');
  assert.equal(nonFinite.scene.items[0]?.x, 0.5);
  assert.equal(nonFinite.scene.items[0]?.y, 0.7);
  assert.equal(nonFinite.scene.items[0]?.size, 0.3);

  const junkItems = parseState(JSON.stringify({ scene: { items: [null, undefined, 42, 'str', true, false, {}, { id: 'triceratops' }] } }), ids, 'sv');
  assert.equal(junkItems.scene.items.length, 1);
  assert.equal(junkItems.scene.items[0]?.id, 'triceratops');

  const many = Array.from({ length: 25 }, () => ({ id: 'triceratops' }));
  const capped = parseState(JSON.stringify({ scene: { items: many } }), ids, 'sv');
  assert.equal(capped.scene.items.length, MAX_SCENE_ITEMS);
});

test('parseState parses valid state fields including onboarded, lang, and eggDay', () => {
  const s = parseState(JSON.stringify({ lang: 'sv', onboarded: true, eggDay: '2026-10-27' }), ids, 'en');
  assert.equal(s.lang, 'sv');
  assert.equal(s.onboarded, true);
  assert.equal(s.eggDay, '2026-10-27');
});

test('parseState validates language choices and falls back when missing or invalid', () => {
  assert.equal(parseState('{}', ids, 'sv').lang, 'sv');
  assert.equal(parseState('{}', ids, 'en').lang, 'en');
  assert.equal(parseState(JSON.stringify({ lang: 'sv' }), ids, 'en').lang, 'sv');
  assert.equal(parseState(JSON.stringify({ lang: 'en' }), ids, 'sv').lang, 'en');
  assert.equal(parseState(JSON.stringify({ lang: 'de' }), ids, 'sv').lang, 'sv');
  assert.equal(parseState(JSON.stringify({ lang: 'de' }), ids, 'en').lang, 'en');
  assert.equal(parseState(JSON.stringify({ lang: 123 }), ids, 'sv').lang, 'sv');
  assert.equal(parseState(JSON.stringify({ lang: null }), ids, 'sv').lang, 'sv');
});

test('parseState strictly validates eggDay format matching full YYYY-MM-DD date string', () => {
  assert.equal(parseState('{}', ids, 'sv').eggDay, '');
  assert.equal(parseState(JSON.stringify({ eggDay: '2026-10-27' }), ids, 'sv').eggDay, '2026-10-27');
  assert.equal(parseState(JSON.stringify({ eggDay: 'prefix2026-10-27' }), ids, 'sv').eggDay, '');
  assert.equal(parseState(JSON.stringify({ eggDay: '2026-10-27suffix' }), ids, 'sv').eggDay, '');
  assert.equal(parseState(JSON.stringify({ eggDay: '2026-10-27T00:00:00' }), ids, 'sv').eggDay, '');
  assert.equal(parseState(JSON.stringify({ eggDay: ['2026-10-27'] }), ids, 'sv').eggDay, '');
  assert.equal(parseState(JSON.stringify({ eggDay: 20261027 }), ids, 'sv').eggDay, '');
  assert.equal(parseState(JSON.stringify({ eggDay: null }), ids, 'sv').eggDay, '');
  assert.equal(parseState(JSON.stringify({ eggDay: '2026/10/27' }), ids, 'sv').eggDay, '');
});

test('KEY is dinodeck and loadState/saveState persist to localStorage', () => {
  assert.equal(KEY, 'dinodeck');

  const store = new Map<string, string>();
  const originalLocalStorage = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, String(v)),
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    length: store.size,
  };

  try {
    const s = parseState(null, ids, 'sv');
    saveState(s);
    assert.equal(store.has(KEY), true);
    assert.deepEqual(loadState(ids, 'sv'), s);

    const custom: State = {
      ...s,
      lang: 'en',
      muted: true,
      unlockAll: true,
      won: ['triceratops'],
      wonAt: { triceratops: '2026-10-27' },
      favorites: ['triceratops'],
      eggDay: '2026-10-27',
    };
    saveState(custom);
    assert.deepEqual(loadState(ids, 'sv'), custom);
  } finally {
    globalThis.localStorage = originalLocalStorage;
  }
});

test('loadState and saveState handle unavailable localStorage gracefully', () => {
  const originalLocalStorage = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: () => {
      throw new Error('Blocked');
    },
    setItem: () => {
      throw new Error('Blocked');
    },
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };

  try {
    const s = loadState(ids, 'sv');
    assert.equal(s.lang, 'sv');
    assert.doesNotThrow(() => saveState(s));
  } finally {
    globalThis.localStorage = originalLocalStorage;
  }
});

test('resetCollection empties the collection and keeps language and sound', () => {
  const s = parseState(JSON.stringify({ lang: 'en', favorites: ['triceratops'], won: ['spinosaurus'], wonAt: { spinosaurus: '2026-10-26' }, seen: ['spinosaurus'], unlockAll: true, muted: true, cute: true, scene: { bg: 'triassic', items: [{ id: 'triceratops', x: 0.5, y: 0.5, size: 0.3, flip: false }] } }), ids, 'sv');
  assert.equal(s.unlockAll, true);
  assert.deepEqual(resetCollection(s), parseState(JSON.stringify({ lang: 'en', muted: true, cute: true }), ids, 'sv'));
});

test('markSeen records a won card once, and parseState keeps only known ids in seen', () => {
  assert.deepEqual(markSeen([], 'a'), ['a']);
  assert.deepEqual(markSeen(['a'], 'a'), ['a']);
  assert.deepEqual(markSeen(['a'], 'b'), ['a', 'b']);
  assert.deepEqual(parseState(null, ids, 'sv').seen, []);
  const s = parseState(JSON.stringify({ won: ['spinosaurus'], seen: ['spinosaurus', 'dragon', 7] }), ids, 'sv');
  assert.deepEqual(s.won, ['spinosaurus']);
  assert.deepEqual(s.seen, ['spinosaurus']);
});

test('parseState keeps only known ids with valid dates in wonAt', () => {
  assert.deepEqual(parseState('{}', ids, 'sv').wonAt, {});
  assert.deepEqual(parseState(JSON.stringify({ wonAt: null }), ids, 'sv').wonAt, {});
  assert.deepEqual(parseState(JSON.stringify({ wonAt: ['2026-10-26'] }), ids, 'sv').wonAt, {});
  const s = parseState(JSON.stringify({ won: ['spinosaurus'], wonAt: { spinosaurus: '2026-10-26', dragon: '2026-10-26', triceratops: 'igår', allosaurus: 7, giganotosaurus: '2026-10-26T10:00' } }), ids, 'sv');
  assert.deepEqual(s.wonAt, { spinosaurus: '2026-10-26' });
  // Right shape but no real calendar date: rejected, not rolled over into a later month.
  assert.deepEqual(parseState(JSON.stringify({ wonAt: { spinosaurus: '2026-13-45', allosaurus: '2026-02-30', triceratops: '2026-00-10' } }), ids, 'sv').wonAt, {});
});

test('markWon records the win and its date once', () => {
  assert.deepEqual(markWon([], {}, 'spinosaurus', '2026-10-26'), { won: ['spinosaurus'], wonAt: { spinosaurus: '2026-10-26' } });
  assert.deepEqual(markWon(['spinosaurus'], { spinosaurus: '2026-10-26' }, 'spinosaurus', '2026-10-27'), { won: ['spinosaurus'], wonAt: { spinosaurus: '2026-10-26' } });
  assert.deepEqual(markWon(['spinosaurus'], { spinosaurus: '2026-10-26' }, 'allosaurus', '2026-10-27'), { won: ['spinosaurus', 'allosaurus'], wonAt: { spinosaurus: '2026-10-26', allosaurus: '2026-10-27' } });
});

test('weekStart returns the Monday of the week, and wonThisWeek only the cards won that week', () => {
  assert.equal(weekStart('2026-10-26'), '2026-10-26'); // Monday
  assert.equal(weekStart('2026-10-31'), '2026-10-26'); // Saturday
  assert.equal(weekStart('2026-11-01'), '2026-10-26'); // Sunday
  assert.equal(weekStart('2026-11-02'), '2026-11-02'); // the next Monday
  assert.equal(weekStart('2026-10-25'), '2026-10-19'); // a Sunday belongs to the week that started the Monday before
  assert.equal(weekStart('2026-13-45'), '2026-13-45'); // not a real date: unchanged, no rollover
  const won = ['spinosaurus', 'allosaurus', 'triceratops', 'giganotosaurus'];
  const wonAt = { spinosaurus: '2026-10-25', allosaurus: '2026-10-26', triceratops: '2026-11-01', giganotosaurus: '2026-11-02' };
  assert.deepEqual(wonThisWeek(won, wonAt, '2026-10-28'), ['allosaurus', 'triceratops']); // Wednesday: the whole Monday-Sunday week counts, also the Sunday after it
  assert.deepEqual(wonThisWeek(won, wonAt, '2026-10-31'), ['allosaurus', 'triceratops']); // Saturday, same week as the Sunday win
  assert.deepEqual(wonThisWeek(won, wonAt, '2026-11-01'), ['allosaurus', 'triceratops']); // Sunday, same week
  assert.deepEqual(wonThisWeek(won, wonAt, '2026-10-25'), ['spinosaurus']);
  assert.deepEqual(wonThisWeek(won, wonAt, '2026-11-02'), ['giganotosaurus']);
  assert.deepEqual(wonThisWeek(won, {}, '2026-10-31'), []); // won before dates were saved
});

test('toggleFavorite adds then removes', () => {
  assert.deepEqual(toggleFavorite([], 'a'), ['a']);
  assert.deepEqual(toggleFavorite(['a', 'b'], 'a'), ['b']);
});

test('advance rotates and never loses a card', () => {
  assert.deepEqual(advance(['a', 'b', 'c']), ['b', 'c', 'a']);
  assert.deepEqual(advance([]), []);
});

test('deckOrder deals the next three to win between open cards', () => {
  const open = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  assert.deepEqual(deckOrder(open, ['X', 'Y', 'Z', 'W']), ['a', 'b', 'X', 'c', 'd', 'Y', 'e', 'f', 'Z', 'g', 'h']);
  assert.deepEqual(deckOrder(['a'], ['X', 'Y']), ['a', 'X', 'Y']);
  assert.deepEqual(deckOrder(open, []), open);
  assert.equal(deckOrder([...open, ...open.map((x) => x + '2')], ['X']).indexOf('X'), 4);
});

test('catalog is complete in both languages', () => {
  assert.equal(new Set(ids).size, ids.length, 'duplicate id');
  for (const d of DINOS) {
    assert.match(d.id, /^[a-z]+(-[a-z]+)*$/, d.id);
    assert.ok(d.fromMya >= d.toMya, `${d.id}: fromMya must not be younger than toMya`); // equal: one known date
    assert.ok(d.lengthM > 0 && d.weightKg > 0, `${d.id}: size`);
    assert.ok(d.facts.length >= 2, `${d.id}: facts`);
    assert.match(d.source.url, /^https:\/\//, `${d.id}: source`);
    const texts = [d.pronounce, d.meaning, d.sizeLike, d.found, d.short, d.long, d.sound, ...d.facts];
    for (const t of texts) {
      assert.ok(t.sv.trim() && t.en.trim(), `${d.id}: empty text`);
      assert.ok(!/[—–]/.test(t.sv + t.en), `${d.id}: dash in text`);
    }
  }
});

test('a won card loses its new badge on its first turn', () => {
  assert.equal(isNewCard(['a'], [], 'a'), true);
  assert.equal(isNewCard(['a'], markSeen([], 'a'), 'a'), false);
  assert.equal(isNewCard([], [], 'a'), false);
});
