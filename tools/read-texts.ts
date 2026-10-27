// Every Swedish card text that can be read aloud, for tools/make-read-sv.py. Keys match readable() in src/main.ts.
//   node tools/read-texts.ts  -> audio-src/read/texts.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { DINOS } from '../src/catalog.ts';
import { BABIES } from '../src/babies.ts';
import { colourNote } from '../src/text.ts';

const texts = DINOS.flatMap((d) => [
  { id: d.id, key: 'short', text: d.short.sv },
  ...d.facts.map((f, i) => ({ id: d.id, key: `fact-${i + 1}`, text: f.sv })),
  ...(BABIES[d.id] ? [{ id: d.id, key: 'baby', text: BABIES[d.id]!.sv }] : []),
  { id: d.id, key: 'colour', text: colourNote('sv', d) },
  { id: d.id, key: 'long', text: d.long.sv },
]);
mkdirSync('audio-src/read', { recursive: true });
writeFileSync('audio-src/read/texts.json', JSON.stringify(texts, null, 1));
console.log(`ok   ${texts.length} texts, ${texts.reduce((n, x) => n + x.text.length, 0)} characters`);
