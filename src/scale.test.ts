import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { CHILD_ASPECT, CHILD_M, pxPerMetre } from './scale.ts';

test('every animal has a height that is plausible next to its length', () => {
  for (const d of DINOS) {
    assert.ok(d.heightM > 0, `${d.id}: no height`);
    assert.ok(d.heightM < d.lengthM, `${d.id}: taller than it is long`);
  }
});

test('animal and child always fit the box, and one of them touches an edge', () => {
  for (const [w, h] of [[310, 150], [600, 150], [200, 300]] as const) {
    for (const d of DINOS) {
      for (const aspect of [0.45, 0.7, 1]) {
        const widthM = d.heightM / aspect;
        const u = pxPerMetre(w, h, widthM, d.heightM, 10);
        const across = u * (widthM + CHILD_M * CHILD_ASPECT) + 10;
        const tallest = u * Math.max(CHILD_M, d.heightM);
        const where = `${d.id} ${w}×${h} aspect ${aspect}`;
        assert.ok(u > 0, where);
        assert.ok(across <= w + 1e-6 && tallest <= h + 1e-6, `${where}: does not fit`);
        assert.ok(Math.abs(across - w) < 1e-6 || Math.abs(tallest - h) < 1e-6, `${where}: smaller than it needs to be`);
      }
    }
  }
});

test('the child towers over a small animal and is dwarfed by a giant', () => {
  const of = (id: string) => DINOS.find((d) => d.id === id)!;
  const small = pxPerMetre(310, 150, of('compsognathus').heightM / 0.7, of('compsognathus').heightM, 10);
  const giant = pxPerMetre(310, 150, of('brachiosaurus').heightM, of('brachiosaurus').heightM, 10);
  assert.equal(Math.round(small * CHILD_M), 150, 'the child fills the box beside Compsognathus');
  assert.ok(small * of('compsognathus').heightM < 60, 'Compsognathus reaches the child\'s knee at most');
  assert.equal(Math.round(giant * of('brachiosaurus').heightM), 150, 'Brachiosaurus fills the box');
  assert.equal(Math.round(giant * CHILD_M), 15, 'the child is a tenth of its height');
});
