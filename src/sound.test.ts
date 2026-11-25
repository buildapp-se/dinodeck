import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chime, peep, play } from './sound.ts';

// Node has no Web Audio, like WebKit (Playwright) on Windows: the sounds stay silent instead of throwing.
test('sounds without Web Audio do nothing and do not throw', () => {
  assert.equal(typeof (globalThis as { AudioContext?: unknown }).AudioContext, 'undefined');
  assert.doesNotThrow(() => play('audio/x.mp3'));
  assert.doesNotThrow(() => chime('right', 2));
  assert.doesNotThrow(() => peep('tyrannosaurus-rex', 8000));
});
