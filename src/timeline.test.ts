import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { BOUNDS, layoutTimeline, layoutTimelineCompact, midMya, xOf } from './timeline.ts';

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

test('compact timeline fits phone and tablet rows without overlap or crossing the asteroid', () => {
  for (const [px, width, lanes] of [[18, 104, 5], [14, 112, 4]] as const) {
    let placed: ReturnType<typeof layoutTimelineCompact> | null = null;
    let chosenScale = px;
    let lastError = '';
    for (let scale = px; scale <= 50; scale += 2) {
      try { placed = layoutTimelineCompact(DINOS, scale, width, lanes); chosenScale = scale; break; } catch (error) { lastError = String(error); }
    }
    assert.ok(placed, `no layout from ${px} to 50 px: ${lastError}`);
    for (let lane = 0; lane < lanes; lane++) {
      const row = placed.items.filter((item) => item.lane === lane).sort((a, b) => a.x - b.x);
      for (let i = 1; i < row.length; i++) assert.ok(row[i]!.x - row[i - 1]!.x >= width + 6);
    }
    for (const item of placed.items) {
      const d = DINOS.find((animal) => animal.id === item.id)!;
      assert.ok(Math.abs(item.x - xOf(midMya(d), chosenScale)) <= 60, `${d.id} moved more than 60 px`);
      if (d.toMya === 66) assert.ok(item.x + width / 2 <= xOf(66, chosenScale) - 8);
    }
  }
});
