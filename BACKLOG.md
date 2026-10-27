# Dinodeck: backlog

Uppifrån och ned. Beslut och ordlista står i `CONTEXT.md`, läget i `HANDOFF.md`.

## P0

1. ✅ **Bildstil vald** (2026-10-03): gouache-bilderbok, se `CONTEXT.md`.
2. ✅ **Bilder till alla 30 djur** (2026-10-03). Nya djur följer pipelinen i `HANDOFF.md` och granskas mot en anatominot i `img-src/BRIEF-art.md` innan de konverteras.

## P1

3. ✅ **Utmaningar och låsta kort** (2026-10-03).
4. ✅ **Tidslinje** (2026-10-03).
5. ✅ **Scen** (2026-10-03). Kvar: de tre målade bakgrunderna, test på riktig pekskärm.
6. ✅ **Ljud och uttal** (2026-10-03): två läten per djur och namnet uppläst på två språk. **Patrik lyssnar igenom alla 120 klipp**: de är byggda och uppmätta men inte avlyssnade av någon.
7. ✅ **Offline** (service worker), manifest med ikoner och favicon (2026-10-03).
8. ✅ **Föräldraläge** (2026-10-03).

## P2

- Portera Sipdecks `promoteDeck` om nästa kort syns hoppa på riktig telefon (markerat `ponytail:` i `src/main.ts`).
- Palett och typsnitt sätts efter vald bildstil (`src/style.css` är provisorisk).
- Källa för Pteranodon är Wikipedia: byt till museum när en hittas som går att kontrollera.
- ✅ **En rad på kortets baksida om att färgen är en gissning** (byggd 2026-10-06 på grenen `batch/2026-10-06`, sammanslagen med `main` och utlagd 2026-10-07). Fältet heter `colour` (plus `colourDisputed`) i katalogen, texterna står i `src/text.ts`. Samma grepp som raden vid ljudet ("Ingen har hört djuret på riktigt"). Tre nivåer, ett nytt fält per djur i katalogen. Vilken nivå varje djur har står i kolumnen Tag i `docs/research/dinosaur-colour.md` avsnitt 6, texterna i avsnitt 7:
  - **Känt** (Microraptor, Archaeopteryx): "Forskare har hittat spår av färg i fossilen, så de här färgerna vet vi faktiskt en hel del om." / "Scientists have found traces of colour in the fossils, so we really do know quite a lot about these colours."
  - **Från släktingar:** "Ingen har hittat färgen hos just det här djuret, men vi vet hur nära släktingar såg ut och har utgått från dem." / "Nobody has found the colour of this animal itself, but we know what close relatives looked like and have used them as a guide."
  - **Gissning:** "Ingen vet vilken färg det här djuret hade. Färgerna är en gissning som bygger på djur som lever i dag." / "Nobody knows what colour this animal was. The colours are a guess based on animals that are alive today."
  - Extra rad för Archaeopteryx och Diplodocus, där forskarna är oense: "Här är forskarna inte överens än." / "Scientists do not agree about this one yet."
  - Fyra djur fick vid omfärgningen en kallare ton än researchfilens palett (se `HANDOFF.md`, omfärgningen). Nivån påverkas inte, alla fyra är redan gissning eller från släktingar.
- Uppläsning av kortens texter (v2). **Patriks önskan 2026-10-27:** texten lyses upp medan rösten läser, så att barn som just börjat läsa kan följa med. Förslag: ord för ord (bokstav för bokstav går för fort). **Gratisvägen först:** OmniVoice, samma lokala röst som läser frågorna (tempo 0,75, Patriks val 2026-10-26), plus lokal tvångsinpassning (forced alignment) av den kända texten mot ljudet för ordens tider, t.ex. torchaudios MMS-aligner som kan svenska. Kräver ledigt minne, kör inte parallellt med många sessioner. **Alternativ röst:** ElevenLabs via OpenRouter (`POST /api/v1/audio/speech`, betalas ur OpenRouter-saldot, alltså ingen gratisplan; se filmverk `docs/research/generated-sound.md`). Patriks blindtest 2026-10-26 i filmverk: George bäst, Alice säger "kort" rätt, kvinnlig röst som startgissning för lekfullt. Korttexterna är ca 26 700 tecken på svenska och 27 600 på engelska: med `eleven-v4` (0,00008 USD per tecken 2026-10-27) ca 2 USD för svenska, `eleven-v4-turbo` hälften. OpenRouter ger inga ordtider, så ordmarkeringen kommer från lokal inpassning i båda fallen (filmverk har kört `KBLab/kb-whisper-large` på svenska).
- **ElevenLabs-vrålen, 11 djur kvar** (2026-10-27): Mosasaurus, Oviraptor, Pachycephalosaurus, Parasaurolophus, Plateosaurus, Plesiosaurus, Protoceratops, Quetzalcoatlus, Spinosaurus, Styracosaurus, Therizinosaurus har utkast men inget val (domningen stoppades av minnesbrist). Kör `uv run tools/judge-roars.py <id ...>`, kopiera vinnaren till `audio-src/elevenlabs-roars/<id>.mp3`, kör `tools/make-sounds.py`.
- **Patrik lyssnar igenom vrålen som Gemini valde** (22 djur, se `HANDOFF.md`). Gemini valde som Patrik på 1 av 7 kalibreringsdjur, alltså inte bättre än slumpen i smak, men den sållar bort uppenbart trasiga utkast. Byt via `audio-src/elevenlabs/listen.html`.
- Fria inspelningar av struts och kasuar saknas (stod i beslutet om ljud). Hittas några med CC0 eller public domain: lägg dem i `audio-src/sources.json` och byt ut duva och järpe i recepten.

## P3

- Silhuettfrågan: kontrollera att Coelophysis, Herrerasaurus, Eoraptor och Compsognathus inte hamnar som svarsalternativ till varandra, eller byt ett triasdjur mot en flygödla (Eudimorphodon).
- `tools/__pycache__/make-sounds.cpython-312.pyc` är incheckad sedan 2026-10-03: ta bort ur git och lägg `__pycache__/` i `.gitignore`.

- ✅ **Skriv ut för att färglägga** (konturerna omgjorda 2026-10-25 som rena linjeteckningar av Codex, se `HANDOFF.md`) (byggd 2026-10-06 på grenen `batch/2026-10-06`, sammanslagen med `main` och utlagd 2026-10-07). Konturerna gick att ta fram ur de färdiga bilderna (`tools/make-outlines.py`), inga nya bilder från Codex behövdes. **Patrik tittar på en utskrift**: konturerna är granskade av Claude på skärm, inte på papper. Ursprunglig beskrivning: två delar: (1) den egna scenen som målarbild, med bakgrund och utställda djur som konturer, (2) enskilda dinosaurier som målarbild. Kräver konturversioner (svartvit linjeteckning) av djur och bakgrunder: nya bilder från Codex, eller prova först om de går att ta fram ur de färdiga bilderna. Utskrift via webbläsarens egen utskriftsfunktion och en utskriftsstilmall.
- **Alternativa bildstilar som går att välja i appen**, till exempel söta dinosaurier. Patrik 2026-10-03: "mycket senare". Stilrunda 2 (`img-src/style-round/sheet2.png`) har sju kandidater. Kräver en bilduppsättning per stil och ett val i inställningarna.

## Appbutiker (granskning 2026-10-25)

Rekommenderad väg: Capacitor med `dist/` inbakat, för båda butikerna (fungerar helt offline, ingen adressrad, ingen analys från sajten). TWA för Play går, men laddar live-sajten och dess analys.

- [ ] `[P1]` Beslut: släppa i butikerna, och i så fall Capacitor eller TWA. Kräver Google-utvecklarkonto (stängt test med 12 testare i 14 dagar för nya personliga konton) och Apple Developer Program (kostar).
- [ ] `[P1]` Cloudflare Web Analytics på buildapp.se injicerar ett tredjepartsskript. Stäng av för `/dinodeck/*` eller gå via Capacitor. Apple 1.3 Kids.
- [x] `[P1]` (klart 2026-10-26, multiplikationsfråga i `<dialog>`) Källänken på kortets baksida bakom en föräldraspärr.
- [x] `[P1]` (klart 2026-10-26, `public/integritet.html`) Integritetspolicy för Dinodeck, länkad från föräldraläget.
- [ ] `[P2]` Capacitor: spegla sparat läge till `@capacitor/preferences` (iOS kan rensa webbvyns lagring vid lite utrymme).
- [ ] `[P2]` Manifest: `screenshots`, featuregrafik 1024×500. (Ikon 1024 i `store/icon-1024.png` och 512 i `public/icons/` klara 2026-10-26, `tools/make-icons.py`.)
- [x] `[P2]` (klart 2026-10-26, egen liggande layout) Telefon på tvären (844×390).
- [x] `[P2]` (klart 2026-10-26) Barn som inte läser: upplästa frågor och rätt/fel-ljud.
- [ ] `[P3]` Innehåll: tio dubbletter utbytta 2026-10-26. Kvar: "samtidigt som T. rex" och papegojnäbb på flera kort, ca 20 fakta som upprepar kortets egen text. Coelophysis kannibalrad (motbevisad i texten) för 4-åringar?
- [x] `[P3]` (klart 2026-10-26, `document.title`) Sidtitel i engelskt läge.

## Design (granskning 2026-10-25, resten)

Det mesta från de tre designagenterna är gjort (se HANDOFF, natt 2026-10-25/26). Kvar:

- [x] `[P2]` (klart 2026-10-26) Kortlekens ordning: bara de tre nästa att vinna, varvade med öppna kort.
- [x] `[P2]` (klart 2026-10-26, Patriks idé) Dagens ägg: en unge om dagen till ett öppet kort, tolv ungar.
- [ ] `[P2]` Ungar till de övriga 24 djuren som lägger ägg (havsreptilerna föder levande, inget ägg). Nästa i tur: de mest kända, t.ex. Spinosaurus, Allosaurus, Iguanodon, Edmontosaurus. Fakta per unge måste ha källa (`docs/research/babies.md`); för arter utan kända ungar skrivs det ärligt, med släkting.
- [ ] `[P3]` Målarbilder av ungarna.
- [x] `[P2]` (klart 2026-10-26) Föräldraläget: sammanfattning (vunna kort, kläckta ungar, favoriter, tre senast vunna).
- [ ] `[P3]` Föräldraläget: skriv ut favoriternas målarbilder i ett svep. Veckans kort kräver datum per vinst (sparas inte i dag).
- [ ] `[P3]` Hjälp efter två fel (rätt svar pulserar); silhuettfrågor på nivå 3-5 med olika kroppsformer; silhuetter även på nivå 8-10.
- [x] `[P3]` (klart 2026-10-26, agent) Visuellt: faktaruta på baksidan, detaljvyns knappar i två nivåer (utskrift fylld), märke i sidhuvudet, tidslinjen centrerad med periodpiller, solfjäder i kortstapeln, radieskala `--r-s` till `--r-pill`, gamla CSS-lagret sammanslaget.
- [ ] `[P3]` Nytt djur i scenen: fall in med studs; "NY"-märke på vunna kort tills de vänts.
- [ ] `[P3]` Scenen: dra med `translate` i stället för `left/top` (layout varje rörelse).

## Granskning 2026-10-06

Fynd från den automatiska sviten (aifabriken `tools/audit-suite.ts`: headers, npm audit, secrets, Actions, markup, axe). Mätvärdena står som `(automated)`-rader under `## Audits` i CONTEXT.md.

- [x] `[P3]` (rättat 2026-10-25, pinnade på commit-hash, zizmor utan fynd) Actions: de fyra `uses:` i `deploy.yml` pekar på en tagg (`@v4`, `@v3`), inte på en commit-hash (zizmor unpinned-uses, 4 high med zizmors nyare standardpolicy, hittat 2026-10-06 vid rättningen nedan). Inte åtgärdat: låg utanför den godkända punkten.
- [x] `[P2]` (rättat 2026-10-06 på grenen `batch/2026-10-06`; Deploy-workflowen grön på `main` 2026-10-07) Actions: `.github/workflows/deploy.yml:10-11` ger för breda `permissions` på workflow-nivå (zizmor excessive-permissions, 2 high): flytta dem till jobbet som behöver dem. Rad 21 checkar ut utan `persist-credentials: false` (artipacked, medium).
