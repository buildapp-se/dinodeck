import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

/** Width and height of a lossy WebP ("VP8 " chunk), the kind tools/ and Pillow write. */
function webpSize(file: string): string {
  const b = readFileSync(file);
  assert.equal(b.toString('latin1', 12, 16), 'VP8 ', `${file}: not a simple lossy WebP`);
  return `${b.readUInt16LE(26) & 0x3fff}x${b.readUInt16LE(28) & 0x3fff}`;
}

// Chrome drops a screenshot from the install dialog without a word when its declared size is wrong.
test('every manifest screenshot exists and has the size the manifest declares', () => {
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8')) as { screenshots: { src: string; sizes: string }[] };
  assert.ok(manifest.screenshots.length > 0);
  for (const s of manifest.screenshots) assert.equal(webpSize(`public/${s.src}`), s.sizes, s.src);
});
