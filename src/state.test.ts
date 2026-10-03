import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { advance, parseState, toggleFavorite } from './state.ts';

const ids = DINOS.map((d) => d.id);

test('parseState survives junk and drops unknown ids', () => {
  assert.deepEqual(parseState(null, ids, 'sv'), { v: 1, lang: 'sv', favorites: [], won: [], scene: { bg: 'jurassic', items: [] } });
  assert.deepEqual(parseState('{nope', ids, 'en'), { v: 1, lang: 'en', favorites: [], won: [], scene: { bg: 'jurassic', items: [] } });
  assert.deepEqual(parseState('[]', ids, 'sv').favorites, []);
  const s = parseState(JSON.stringify({ lang: 'en', favorites: ['triceratops', 'dragon', 7, 'triceratops'], won: ['spinosaurus', 'x'], scene: { bg: 'mars', items: [{ id: 'triceratops', x: 7, y: 'a', size: 0, flip: 1 }, { id: 'dragon' }, 5] } }), ids, 'sv');
  assert.deepEqual(s, {
    v: 1,
    lang: 'en',
    favorites: ['triceratops'],
    won: ['spinosaurus'],
    scene: { bg: 'jurassic', items: [{ id: 'triceratops', x: 1, y: 0.7, size: 0.12, flip: false }] },
  });
});

test('toggleFavorite adds then removes', () => {
  assert.deepEqual(toggleFavorite([], 'a'), ['a']);
  assert.deepEqual(toggleFavorite(['a', 'b'], 'a'), ['b']);
});

test('advance rotates and never loses a card', () => {
  assert.deepEqual(advance(['a', 'b', 'c']), ['b', 'c', 'a']);
  assert.deepEqual(advance([]), []);
});

test('catalog is complete in both languages', () => {
  assert.equal(new Set(ids).size, ids.length, 'duplicate id');
  for (const d of DINOS) {
    assert.match(d.id, /^[a-z]+(-[a-z]+)*$/, d.id);
    assert.ok(d.fromMya > d.toMya, `${d.id}: fromMya must be older than toMya`);
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
