import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { dinoSheet, sceneSheet } from './print.ts';

test('every animal and backdrop has a line drawing to print', () => {
  const names = [...DINOS.map((d) => d.id), 'bg-triassic', 'bg-jurassic', 'bg-cretaceous'];
  assert.deepEqual(names.filter((n) => !existsSync(`public/img/line/${n}.webp`)), []);
});

test('the colouring page uses the line drawing, never the painting', () => {
  const html = dinoSheet(DINOS[0]!);
  assert.match(html, /src="img\/line\/tyrannosaurus-rex\.webp"/);
  assert.match(html, />Tyrannosaurus rex</);
});

test('the printed scene keeps place, size, facing and stacking order', () => {
  const html = sceneSheet({
    bg: 'triassic',
    items: [
      { id: 'diplodocus', x: 0.25, y: 0.7, size: 0.5, flip: false },
      { id: 'velociraptor', x: 0.8, y: 0.333333, size: 0.12, flip: true },
    ],
  });
  assert.match(html, /img\/line\/bg-triassic\.webp/);
  assert.match(html, /diplodocus\.webp" alt="" style="left:25%;top:70%;width:50%;transform:translate\(-50%,-50%\) scaleX\(1\)"/);
  assert.match(html, /velociraptor\.webp" alt="" style="left:80%;top:33\.33%;width:12%;transform:translate\(-50%,-50%\) scaleX\(-1\)"/);
  assert.ok(html.indexOf('diplodocus') < html.indexOf('velociraptor'), 'later items are drawn on top');
  assert.doesNotMatch(html, /src="img\/(?!line\/)/);
});
