import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { BOUNDS, layoutTimeline, midMya, xOf } from './timeline.ts';

test('every animal sits inside the period its card names', () => {
  for (const d of DINOS) {
    const [from, to] = BOUNDS[d.period];
    assert.ok(d.fromMya >= d.toMya, `${d.id}: fromMya is the older end`);
    assert.ok(midMya(d) <= from && midMya(d) >= to, `${d.id}: ${midMya(d)} is outside ${d.period}`);
  }
});

test('no two animals overlap in a lane, and older is further left', () => {
  for (const [px, w] of [[20, 92], [8, 60], [40, 120]] as const) {
    const { items, lanes } = layoutTimeline(DINOS, px, w);
    assert.equal(items.length, DINOS.length);
    for (let lane = 0; lane < lanes; lane++) {
      const xs = items.filter((i) => i.lane === lane).map((i) => i.x);
      assert.ok(xs.length > 0, `lane ${lane} is empty`);
      for (let i = 1; i < xs.length; i++) assert.ok(xs[i]! - xs[i - 1]! >= w, `lane ${lane} overlaps at ${px} px`);
    }
  }
  assert.ok(layoutTimeline(DINOS, 20, 92).lanes <= 8, 'more lanes than fit a phone');
});

test('T. rex lived closer to today than to Stegosaurus', () => {
  const rex = DINOS.find((d) => d.id === 'tyrannosaurus-rex')!;
  const stego = DINOS.find((d) => d.id === 'stegosaurus')!;
  assert.ok(rex.toMya < stego.toMya - rex.fromMya);
  assert.ok(xOf(0, 20) - xOf(rex.toMya, 20) < xOf(rex.fromMya, 20) - xOf(stego.toMya, 20));
});
