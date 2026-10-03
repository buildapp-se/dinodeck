import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { CHILD_ASPECT, CHILD_M, pxPerMetre } from './scale.ts';

test('animal and child always fit the box, and one of them touches an edge', () => {
  for (const [w, h] of [[310, 150], [600, 150], [200, 300]] as const) {
    for (const d of DINOS) {
      for (const aspect of [0.3, 0.6, 1.2]) {
        const u = pxPerMetre(w, h, d.lengthM, aspect, 10);
        const across = u * (d.lengthM + CHILD_M * CHILD_ASPECT) + 10;
        const tallest = u * Math.max(CHILD_M, d.lengthM * aspect);
        const where = `${d.id} ${w}×${h} aspect ${aspect}`;
        assert.ok(u > 0, where);
        assert.ok(across <= w + 1e-6 && tallest <= h + 1e-6, `${where}: does not fit`);
        assert.ok(Math.abs(across - w) < 1e-6 || Math.abs(tallest - h) < 1e-6, `${where}: smaller than it needs to be`);
      }
    }
  }
});

test('the child towers over a small animal and is dwarfed by a giant', () => {
  const at = (id: string) => DINOS.find((d) => d.id === id)!.lengthM;
  const small = pxPerMetre(310, 150, at('microraptor'), 0.6, 10);
  const giant = pxPerMetre(310, 150, at('argentinosaurus'), 0.3, 10);
  assert.ok(small * CHILD_M > small * at('microraptor') * 0.6, 'child is taller than Microraptor');
  assert.ok(giant * CHILD_M < 15, 'child is a small mark beside Argentinosaurus');
  assert.ok(giant * at('argentinosaurus') > 250, 'Argentinosaurus fills the box');
});
