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
