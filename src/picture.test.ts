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
  assert.equal(onPicture(300, 400, 0, 200, 150, 200), false);
  assert.equal(onPicture(300, 400, 300, 0, 150, 200), false);
  assert.equal(onPicture(300, 400, -10, 200, 150, 200), false);
  assert.equal(onPicture(300, 400, 300, -10, 150, 200), false);
  assert.equal(onPicture(300, 400, -10, -10, 150, 200), false);
});

test('points on the exact boundary edges and corners land on the picture', () => {
  // 500×1000 in a 400×200 box is drawn 100×200, x from 150 to 250, y from 0 to 200.
  assert.equal(onPicture(400, 200, 500, 1000, 150, 100), true); // left edge
  assert.equal(onPicture(400, 200, 500, 1000, 250, 100), true); // right edge
  assert.equal(onPicture(400, 200, 500, 1000, 200, 0), true); // top edge
  assert.equal(onPicture(400, 200, 500, 1000, 200, 200), true); // bottom edge

  // corners
  assert.equal(onPicture(400, 200, 500, 1000, 150, 0), true); // top-left
  assert.equal(onPicture(400, 200, 500, 1000, 250, 0), true); // top-right
  assert.equal(onPicture(400, 200, 500, 1000, 150, 200), true); // bottom-left
  assert.equal(onPicture(400, 200, 500, 1000, 250, 200), true); // bottom-right

  // 600×400 in a 300×400 box is drawn 300×200, x from 0 to 300, y from 100 to 300.
  assert.equal(onPicture(300, 400, 600, 400, 0, 200), true); // left edge
  assert.equal(onPicture(300, 400, 600, 400, 300, 200), true); // right edge
  assert.equal(onPicture(300, 400, 600, 400, 150, 100), true); // top edge
  assert.equal(onPicture(300, 400, 600, 400, 150, 300), true); // bottom edge
});
