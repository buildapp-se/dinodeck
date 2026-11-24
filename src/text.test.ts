import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DINOS } from './catalog.ts';
import { buildTime, colourNote, dietName, groupNote, num, periodName, t, UI, weight, when } from './text.ts';
import type { Dino } from './dinos.ts';

const ids = (level: string): string[] => DINOS.filter((d) => d.colour === level).map((d) => d.id).sort();

test('colour evidence follows docs/research/dinosaur-colour.md section 6', () => {
  assert.deepEqual(ids('known'), ['archaeopteryx', 'borealopelta', 'microraptor', 'psittacosaurus']);
  assert.deepEqual(ids('relatives'), [
    'ankylosaurus', 'anurognathus', 'apatosaurus', 'compsognathus', 'deinonychus', 'ichthyosaurus', 'liopleurodon', 'mosasaurus', 'oviraptor',
    'plesiosaurus', 'protoceratops', 'pteranodon', 'quetzalcoatlus', 'shonisaurus', 'styracosaurus', 'therizinosaurus', 'triceratops',
    'velociraptor',
  ]);
  assert.equal(ids('guess').length, 28);
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

test('UI translations for detail view, measurements and confirmation in Swedish and English', () => {
  assert.equal(t('sv', 'clearFavsSure'), 'Tryck igen för att ta bort alla');
  assert.equal(t('en', 'clearFavsSure'), 'Tap again to remove them all');
  assert.equal(t('sv', 'back'), 'Tillbaka');
  assert.equal(t('en', 'back'), 'Back');
  assert.equal(t('sv', 'means'), 'Namnet betyder');
  assert.equal(t('en', 'means'), 'The name means');
  assert.equal(t('sv', 'lived'), 'Levde');
  assert.equal(t('en', 'lived'), 'Lived');
  assert.equal(t('sv', 'mya'), 'miljoner år sedan');
  assert.equal(t('en', 'mya'), 'million years ago');
  assert.equal(t('sv', 'length'), 'Längd');
  assert.equal(t('en', 'length'), 'Length');
  assert.equal(t('sv', 'wingspan'), 'Vingbredd');
  assert.equal(t('en', 'wingspan'), 'Wingspan');
  assert.equal(t('sv', 'weight'), 'Vikt');
  assert.equal(t('en', 'weight'), 'Weight');
  assert.equal(t('sv', 'about'), 'ungefär');
  assert.equal(t('en', 'about'), 'about');
});

test('when formats dinosaur period and time span in Swedish and English', () => {
  const rex = DINOS.find((d) => d.id === 'tyrannosaurus-rex')!;
  assert.equal(when('sv', rex), 'Krita, för 68 till 66 miljoner år sedan');
  assert.equal(when('en', rex), 'Cretaceous, 68 to 66 million years ago');
  const at = (id: string): Dino => DINOS.find((d) => d.id === id)!;
  assert.equal(when('sv', at('shonisaurus')), 'Trias, för 227 miljoner år sedan');
  assert.equal(when('sv', at('anurognathus')), 'Jura, för 150,8 till 148,5 miljoner år sedan');
});

test('every UI text exists in both languages, has no dash, and is used somewhere in the app', () => {
  const app = readdirSync('src')
    .filter((f) => f.endsWith('.ts') && f !== 'text.ts' && !f.endsWith('.test.ts'))
    .map((f) => readFileSync(`src/${f}`, 'utf8'))
    .join('\n');
  for (const key of Object.keys(UI) as (keyof typeof UI)[]) {
    for (const lang of ['sv', 'en'] as const) {
      assert.ok(t(lang, key).trim(), `${key} ${lang}: empty`);
      assert.ok(!/[—–]/.test(t(lang, key)), `${key} ${lang}: dash`);
    }
    assert.ok(app.includes(`'${key}'`), `${key}: never used`);
  }
});

test('period, diet and group names are filled in and tell the options apart', () => {
  for (const lang of ['sv', 'en'] as const) {
    const periods = (['triassic', 'jurassic', 'cretaceous'] as const).map((p) => periodName(lang, p));
    const diets = (['carnivore', 'herbivore', 'piscivore', 'omnivore'] as const).map((d) => dietName(lang, d));
    for (const list of [periods, diets]) {
      assert.ok(list.every((s) => s.trim()), lang);
      assert.equal(new Set(list).size, list.length, lang);
    }
  }
  assert.deepEqual([periodName('sv', 'jurassic'), periodName('en', 'triassic')], ['Jura', 'Triassic']);
  assert.deepEqual([dietName('sv', 'piscivore'), dietName('en', 'omnivore')], ['Fisk', 'Plants and small animals']);
  assert.equal(groupNote('sv', 'dinosaur'), '');
  assert.equal(groupNote('en', 'dinosaur'), '');
  assert.equal(groupNote('sv', 'pterosaur'), 'Flygödla, inte en dinosaurie');
  assert.equal(groupNote('en', 'marine'), 'Sea reptile, not a dinosaur');
  for (const lang of ['sv', 'en'] as const) {
    for (const g of ['pterosaur', 'marine'] as const) assert.ok(groupNote(lang, g).trim(), `${g} ${lang}`);
    for (const c of ['known', 'relatives', 'guess'] as const) assert.ok(colourNote(lang, { colour: c }).trim(), `${c} ${lang}`);
  }
});

test('numbers, weights and the build time follow each language', () => {
  assert.equal(num('sv', 12500.5), '12 500,5');
  assert.equal(num('en', 12500.5), '12,500.5');
  assert.equal(weight('sv', 999), '999 kg');
  assert.equal(weight('sv', 1000), '1 ton');
  assert.equal(weight('sv', 1500), '1,5 ton');
  assert.equal(weight('en', 70000), '70 tonnes');
  assert.equal(weight('en', 25), '25 kg');
  assert.equal(buildTime('sv', '2026-11-24T12:00:00Z'), '2026-11-24 13:00');
  assert.equal(buildTime('en', '2026-07-01T12:00:00Z'), '01/07/2026, 14:00');
});

test('a colour note without a dispute is the evidence sentence alone', () => {
  assert.equal(
    colourNote('en', { colour: 'known' }),
    'Scientists have found traces of colour in the fossils, so we really do know quite a lot about these colours.',
  );
  assert.equal(
    colourNote('sv', { colour: 'guess', colourDisputed: true }),
    'Ingen vet vilken färg det här djuret hade. Färgerna är en gissning som bygger på djur som lever i dag. Här är forskarna inte överens än.',
  );
});
