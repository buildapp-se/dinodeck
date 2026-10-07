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
- Uppläsning av kortens texter (v2).
- Fria inspelningar av struts och kasuar saknas (stod i beslutet om ljud). Hittas några med CC0 eller public domain: lägg dem i `audio-src/sources.json` och byt ut duva och järpe i recepten.

## P3

- ✅ **Skriv ut för att färglägga** (byggd 2026-10-06 på grenen `batch/2026-10-06`, sammanslagen med `main` och utlagd 2026-10-07). Konturerna gick att ta fram ur de färdiga bilderna (`tools/make-outlines.py`), inga nya bilder från Codex behövdes. **Patrik tittar på en utskrift**: konturerna är granskade av Claude på skärm, inte på papper. Ursprunglig beskrivning: två delar: (1) den egna scenen som målarbild, med bakgrund och utställda djur som konturer, (2) enskilda dinosaurier som målarbild. Kräver konturversioner (svartvit linjeteckning) av djur och bakgrunder: nya bilder från Codex, eller prova först om de går att ta fram ur de färdiga bilderna. Utskrift via webbläsarens egen utskriftsfunktion och en utskriftsstilmall.
- **Alternativa bildstilar som går att välja i appen**, till exempel söta dinosaurier. Patrik 2026-10-03: "mycket senare". Stilrunda 2 (`img-src/style-round/sheet2.png`) har sju kandidater. Kräver en bilduppsättning per stil och ett val i inställningarna.

## Granskning 2026-10-06

Fynd från den automatiska sviten (aifabriken `tools/audit-suite.ts`: headers, npm audit, secrets, Actions, markup, axe). Mätvärdena står som `(automated)`-rader under `## Audits` i CONTEXT.md.

- [ ] `[P3]` Actions: de fyra `uses:` i `deploy.yml` pekar på en tagg (`@v4`, `@v3`), inte på en commit-hash (zizmor unpinned-uses, 4 high med zizmors nyare standardpolicy, hittat 2026-10-06 vid rättningen nedan). Inte åtgärdat: låg utanför den godkända punkten.
- [x] `[P2]` (rättat 2026-10-06 på grenen `batch/2026-10-06`; Deploy-workflowen grön på `main` 2026-10-07) Actions: `.github/workflows/deploy.yml:10-11` ger för breda `permissions` på workflow-nivå (zizmor excessive-permissions, 2 high): flytta dem till jobbet som behöver dem. Rad 21 checkar ut utan `persist-credentials: false` (artipacked, medium).
