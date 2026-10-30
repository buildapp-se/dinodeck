import assert from 'node:assert/strict';

import { test } from 'node:test';

import { itemStyle } from './sceneView.ts';

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
