import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BABIES, eggChoices } from './babies.ts';
import { DINOS } from './catalog.ts';

test('every baby belongs to a card, lays eggs, and has its fact in both languages', () => {
  for (const [id, fact] of Object.entries(BABIES)) {
    const d = DINOS.find((x) => x.id === id);
    assert.ok(d, `${id}: not in the catalogue`);
    assert.notEqual(d.group, 'marine', `${id}: sea reptiles gave birth, no egg`);
    assert.ok(fact.sv.trim() && fact.en.trim(), `${id}: empty`);
    assert.ok(!/[—–]/.test(fact.sv + fact.en), `${id}: dash`);
  }
});

test('eggChoices: one egg a day, only babies of open cards not yet hatched', () => {
  const open = ['triceratops', 'stegosaurus', 'spinosaurus'];
  assert.deepEqual(eggChoices('2026-10-26', '', open, []), ['triceratops', 'stegosaurus']);
  assert.deepEqual(eggChoices('2026-10-26', '2026-10-25', open, ['triceratops']), ['stegosaurus']);
  assert.deepEqual(eggChoices('2026-10-26', '2026-10-26', open, []), []);
  assert.deepEqual(eggChoices('2026-10-26', '', ['spinosaurus'], []), []);
});
