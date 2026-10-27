import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import type { Dino } from './dinos.ts';
import { BOUNDS, layoutTimelineCompact, midMya, xOf } from './timeline.ts';

test('every animal sits inside the period its card names', () => {
  for (const d of DINOS) {
    const [from, to] = BOUNDS[d.period];
    assert.ok(d.fromMya >= d.toMya, `${d.id}: fromMya is the older end`);
    assert.ok(midMya(d) <= from && midMya(d) >= to, `${d.id}: ${midMya(d)} is outside ${d.period}`);
  }
});

test('T. rex lived closer to today than to Stegosaurus', () => {
  const rex = DINOS.find((d) => d.id === 'tyrannosaurus-rex')!;
  const stego = DINOS.find((d) => d.id === 'stegosaurus')!;
  assert.ok(rex.toMya < stego.toMya - rex.fromMya);
  assert.ok(xOf(0, 20) - xOf(rex.toMya, 20) < xOf(rex.fromMya, 20) - xOf(stego.toMya, 20));
});

test('compact timeline fits phone and tablet rows without overlap or crossing the asteroid', () => {
  // Phone, short phone (timelineView drops to four rows) and tablet. Same scale ceiling as timelineView.
  for (const [px, width, lanes] of [[18, 104, 5], [18, 104, 4], [14, 112, 4]] as const) {
    let placed: ReturnType<typeof layoutTimelineCompact> | null = null;
    let chosenScale = px;
    let lastError = '';
    for (let scale = px; scale <= 70; scale += 2) {
      try { placed = layoutTimelineCompact(DINOS, scale, width, lanes); chosenScale = scale; break; } catch (error) { lastError = String(error); }
    }
    assert.ok(placed, `no layout with ${lanes} rows from ${px} to 70 px: ${lastError}`);
    assert.equal(placed.items.length, DINOS.length);
    const placedIds = new Set(placed.items.map((item) => item.id));
    for (const d of DINOS) assert.ok(placedIds.has(d.id), `missing ${d.id}`);
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

test('non-Cretaceous periods allow cards up to period boundary without asteroid margin', () => {
  // In Jurassic, rightEdge is xOf(145, px) with no 8px asteroid margin subtracted.
  const dino = { id: 'jurassic-edge', period: 'jurassic', fromMya: 145, toMya: 145 } as Dino;
  const px = 10;
  const w = 40;
  const placed = layoutTimelineCompact([dino], px, w, 1);
  assert.equal(placed.items[0]!.x, xOf(145, px) - w / 2);
  assert.equal(placed.items[0]!.x + w / 2, xOf(145, px));
});

test('respects period left boundary', () => {
  // Card touching leftEdge exactly (x - itemW / 2 === leftEdge) is permitted:
  // For Triassic, leftEdge is xOf(252, 1) = 0.
  // desired = 20, itemW = 40 -> x = 20, x - itemW / 2 = 0 === leftEdge.
  const touchingDino = { id: 'touch', period: 'triassic', fromMya: 232, toMya: 232 } as Dino;
  const placed = layoutTimelineCompact([touchingDino], 1, 40, 1);
  assert.equal(placed.items[0]!.x - 40 / 2, 0);

  // Card whose left edge would cross left boundary (x - itemW / 2 < leftEdge) is rejected.
  const crossingDino = { id: 'cross', period: 'triassic', fromMya: 245, toMya: 245 } as Dino;
  assert.throws(
    () => layoutTimelineCompact([crossingDino], 1, 40, 1),
    (err: unknown) => {
      assert.ok(err instanceof Error);
      assert.equal((err as Error).name, 'Error');
      assert.equal((err as Error).message, 'Timeline has no room for cross at 1 px/million years');
      return true;
    }
  );
});

test('allows shift up to exactly 60 px and rejects shifts exceeding 60 px', () => {
  // Cretaceous boundary with 104px card:
  // rightEdge is xOf(66, px) - 8. Max center x is desired - 8 - 52 = desired - 60.
  // Shift is exactly 60px, which is within the allowed tolerance (shift <= 60).
  const boundaryDino = { id: 'boundary-dino', period: 'cretaceous', fromMya: 66, toMya: 66 } as Dino;
  const placed = layoutTimelineCompact([boundaryDino], 20, 104, 1);
  assert.equal(Math.abs(placed.items[0]!.x - xOf(66, 20)), 60);

  // When shift would exceed 60px (e.g. card width 106 -> shift = 8 + 53 = 61px), it is rejected.
  assert.throws(
    () => layoutTimelineCompact([boundaryDino], 20, 106, 1),
    (err: unknown) => {
      assert.ok(err instanceof Error);
      assert.equal((err as Error).name, 'Error');
      assert.equal((err as Error).message, 'Timeline has no room for boundary-dino at 20 px/million years');
      return true;
    }
  );
});

test('lane selection minimizes shift and prefers lower lanes on ties', () => {
  // Two animals with identical desired time in Jurassic:
  // First animal finds shift 0 in all lanes, so it picks lane 0 (tie-break to earlier lane).
  // Second animal finds lane 0 shifted by 46px, but lane 1 free with shift 0, so it picks lane 1.
  const d1 = { id: 'd1', period: 'jurassic', fromMya: 160, toMya: 160 } as Dino;
  const d2 = { id: 'd2', period: 'jurassic', fromMya: 160, toMya: 160 } as Dino;
  const placed = layoutTimelineCompact([d1, d2], 10, 40, 2);
  assert.deepEqual(placed.items, [
    { id: 'd1', x: 920, lane: 0 },
    { id: 'd2', x: 920, lane: 1 },
  ]);
});

test('throws descriptive error when timeline has no room for an animal', () => {
  const dino = { id: 'triceratops-test', period: 'triassic', fromMya: 252, toMya: 252 } as Dino;
  assert.throws(
    () => layoutTimelineCompact([dino], 10, 104, 1),
    (err: unknown) => {
      assert.ok(err instanceof Error);
      assert.equal((err as Error).name, 'Error');
      assert.equal((err as Error).message, 'Timeline has no room for triceratops-test at 10 px/million years');
      return true;
    }
  );
});
