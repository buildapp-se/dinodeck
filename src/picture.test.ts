import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onPicture } from './picture.ts';

test('a wide picture in a tall box leaves bands above and below', () => {
  // 900×545 in a 300×400 box is drawn 300×182, from y = 109 to y = 291.
  assert.equal(onPicture(300, 400, 900, 545, 150, 200), true);
  assert.equal(onPicture(300, 400, 900, 545, 5, 110), true);
  assert.equal(onPicture(300, 400, 900, 545, 150, 100), false);
  assert.equal(onPicture(300, 400, 900, 545, 150, 300), false);
});

test('a tall picture in a wide box leaves bands at the sides', () => {
  // 500×1000 in a 400×200 box is drawn 100×200, from x = 150 to x = 250.
  assert.equal(onPicture(400, 200, 500, 1000, 200, 5), true);
  assert.equal(onPicture(400, 200, 500, 1000, 140, 100), false);
  assert.equal(onPicture(400, 200, 500, 1000, 260, 100), false);
});

test('a picture that has not loaded cannot be hit', () => {
  assert.equal(onPicture(300, 400, 0, 0, 150, 200), false);
});
