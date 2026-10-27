import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { colourNote, t } from './text.ts';

const ids = (level: string): string[] => DINOS.filter((d) => d.colour === level).map((d) => d.id).sort();

test('colour evidence follows docs/research/dinosaur-colour.md section 6', () => {
  assert.deepEqual(ids('known'), ['archaeopteryx', 'microraptor']);
  assert.deepEqual(ids('relatives'), [
    'ankylosaurus', 'apatosaurus', 'compsognathus', 'deinonychus', 'ichthyosaurus', 'mosasaurus', 'oviraptor',
    'plesiosaurus', 'protoceratops', 'pteranodon', 'quetzalcoatlus', 'styracosaurus', 'therizinosaurus', 'triceratops',
    'velociraptor',
  ]);
  assert.equal(ids('guess').length, 23);
  assert.deepEqual(DINOS.filter((d) => d.colourDisputed).map((d) => d.id).sort(), ['archaeopteryx', 'diplodocus', 'ichthyosaurus']);
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

test('UI translations for deck navigation and favorites in Swedish and English', () => {
  assert.equal(t('sv', 'deck'), 'Kort');
  assert.equal(t('en', 'deck'), 'Cards');
  assert.equal(t('sv', 'favorites'), 'Favoriter');
  assert.equal(t('en', 'favorites'), 'Favourites');
  assert.equal(t('sv', 'noFavorites'), 'Inga favoriter än. Svep ett kort åt höger eller tryck på hjärtat.');
  assert.equal(t('en', 'noFavorites'), 'No favourites yet. Swipe a card right or tap the heart.');
  assert.equal(t('sv', 'next'), 'Nästa');
  assert.equal(t('en', 'next'), 'Next');
  assert.equal(t('sv', 'flip'), 'Vänd kortet');
  assert.equal(t('en', 'flip'), 'Flip the card');
  assert.equal(t('sv', 'save'), 'Spara som favorit');
  assert.equal(t('en', 'save'), 'Save as favourite');
  assert.equal(t('sv', 'favourite'), 'Favorit');
  assert.equal(t('en', 'favourite'), 'Favourite');
  assert.equal(t('sv', 'clearFavs'), 'Ta bort alla favoriter');
  assert.equal(t('en', 'clearFavs'), 'Remove all favourites');
});
