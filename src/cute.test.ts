import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { BABIES } from './babies.ts';
import { artSrc, babySrc, roarSrc } from './cute.ts';

test('every animal has a cute image and a cute roar, so the switch never shows a hole', () => {
  const missing = DINOS.flatMap((d) => [artSrc(d.id, true), roarSrc(d.id, true)]).filter((f) => !existsSync(`public/${f}`));
  assert.deepEqual(missing, []);
});

test('every baby that can hatch has a cute version too', () => {
  assert.deepEqual(Object.keys(BABIES).map((id) => babySrc(id, true)).filter((f) => !existsSync(`public/${f}`)), []);
});

test('each style points at its own file: an empty path would pass the checks above, since public/ exists', () => {
  assert.deepEqual([artSrc('x', true), babySrc('x', true), roarSrc('x', true)], ['img/cute/x.webp', 'img/cute/baby/x.webp', 'audio/cute/x-roar.mp3']);
  assert.deepEqual([artSrc('x', false), babySrc('x', false), roarSrc('x', false)], ['img/x.webp', 'img/baby/x.webp', 'audio/x-roar.mp3']);
});
