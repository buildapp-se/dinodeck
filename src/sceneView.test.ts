import assert from 'node:assert/strict';

import { test } from 'node:test';

import { itemStyle, startSize } from './sceneView.ts';
import { DINOS } from './catalog.ts';
import type { Dino } from './dinos.ts';
import { MAX_SIZE, MIN_SIZE } from './state.ts';

test('scene items are placed with translate, not left/top (left/top would run layout on every drag move)', () => {
  const f = { worldWidth: 300, worldHeight: 200, left: 10, top: 20 };
  const s = itemStyle(f, { id: 'diplodocus', x: 0.5, y: 0.25, size: 0.5, flip: true });
  assert.equal(s.translate, '160px 70px');
  assert.equal(s.width, '150px');
  assert.equal(s.transform, 'translate(-50%, -50%) scaleX(-1)');
  assert.deepEqual(Object.keys(s).sort(), ['transform', 'translate', 'width'], 'no left/top in the style');
});

test('itemStyle keeps the centre of the item at its x/y, flip only mirrors', () => {
  const f = { worldWidth: 1000, worldHeight: 400, left: 0, top: 0 };
  const s = itemStyle(f, { id: 'velociraptor', x: 0.8, y: 0.5, size: 0.12, flip: false });
  assert.equal(s.translate, '800px 200px');
  assert.equal(s.transform, 'translate(-50%, -50%) scaleX(1)');
});

test('startSize: a placed animal starts at a size that follows its length, inside the scene limits', () => {
  const sized = (lengthM: number): number => startSize({ ...DINOS[0]!, lengthM });
  const of = (id: string): Dino => DINOS.find((d) => d.id === id)!;
  assert.ok(startSize(of('diplodocus')) > startSize(of('velociraptor')), 'a Diplodocus dwarfs a Velociraptor');
  assert.equal(sized(0), MIN_SIZE);
  assert.equal(sized(7), 0.22);
  assert.equal(sized(35), 0.62);
  assert.equal(sized(100), MAX_SIZE, 'never bigger than the largest size the resize buttons allow');
  assert.equal(sized(-10), MIN_SIZE, 'never smaller than the smallest');
});
