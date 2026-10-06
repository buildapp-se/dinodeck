import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { colourNote } from './text.ts';

const ids = (level: string): string[] => DINOS.filter((d) => d.colour === level).map((d) => d.id).sort();

test('colour evidence follows docs/research/dinosaur-colour.md section 6', () => {
  assert.deepEqual(ids('known'), ['archaeopteryx', 'microraptor']);
  assert.deepEqual(ids('relatives'), [
    'ankylosaurus', 'apatosaurus', 'compsognathus', 'deinonychus', 'mosasaurus', 'oviraptor',
    'plesiosaurus', 'protoceratops', 'pteranodon', 'therizinosaurus', 'triceratops', 'velociraptor',
  ]);
  assert.equal(ids('guess').length, 16);
  assert.deepEqual(DINOS.filter((d) => d.colourDisputed).map((d) => d.id).sort(), ['archaeopteryx', 'diplodocus']);
});

test('the colour line says how sure it is, and adds the dispute only where there is one', () => {
  const of = (id: string, lang: 'sv' | 'en'): string => colourNote(lang, DINOS.find((d) => d.id === id)!);
  assert.match(of('microraptor', 'sv'), /^Forskare har hittat spår av färg/);
  assert.match(of('triceratops', 'en'), /close relatives/);
  assert.match(of('tyrannosaurus-rex', 'sv'), /gissning/);
  assert.match(of('diplodocus', 'sv'), /gissning.* Här är forskarna inte överens än\.$/);
  assert.match(of('archaeopteryx', 'en'), /Scientists do not agree about this one yet\.$/);
  assert.doesNotMatch(of('microraptor', 'en'), /do not agree/);
});
