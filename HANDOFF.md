---
schemaVersion: 1
status: active
currentGoal: Steg 1 och 2 live (kortlek, favoriter, utmaningar, 30 djur), sedan bilder i vald stil
nextAction: Patrik väljer bildstil ur stilrunda 2, därefter bilder till de 8 startkorten
blockers: [bildstil ej vald]
reviewedAt: 2026-10-03
---

# Handoff: Dinodeck

## 2026-10-03: projektstart, steg 1

- **Byggt:** kortlek med svep (höger = favorit, vänster = nästa), vändning, baksida med fakta, favoritlista med detaljvy, språkbyte sv/en, 8 startkort med text på båda språken.
- **Filer:** `src/dinos.ts` (katalog och typer), `src/deck.ts` (svep, portat från Sipdeck), `src/state.ts` (localStorage, rena funktioner), `src/text.ts` (gränssnittstexter och format), `src/main.ts` (vyer och hash-rutter `#/`, `#/favoriter`, `#/dino/<id>`).
- **Verifierat:** `npm test` (typkontroll + 4 tester) och `npm run build` gröna. I Chromium 390×844 mot `vite preview`: tryck vänder, hjärtknapp och svep höger sparar, vänster sparar inte, favoritlista, detaljvy, språkbyte, ingen sidledes scroll.
- **Inte verifierat:** riktig telefon eller surfplatta, Safari, Firefox.
- **Bilder saknas.** Korten visar en platshållare (🦕) tills `public/img/<id>.webp` finns.

## 2026-10-03: steg 2, utmaningar och låsta kort

- **Byggt:** katalogen är 30 djur (`src/dinos.ts` 8 startkort, `src/dinos-won.ts` 22 som vinns, ihopsatta i `src/catalog.ts`). Låsta kort visas mörka med "Vinn mig". Utmaning: åldersval, 5 rätt vinner kortet, fel ger "Försök igen" utan straff. `won` sparas i state.
- **Frågetyper** (`src/challenge.ts`, rena funktioner): räkna (3 till 5), plus och minus (6 till 7), gånger och faktafrågor om kost, period och längst (8 till 10). **Silhuett-para** finns i koden men slås på av sig själv först när minst tre bilder finns i `public/img/`.
- **Verifierat:** `npm test` (typkontroll + 6 tester, 1 200 slumpade frågor kontrollräknade). I Chromium 390×844: låst kort går inte att vända eller spara, en utmaning per nivå spelad till vinst, vunnet kort öppet och överst i leken, detaljvy efter vinst.
- **Inte verifierat:** silhuettfrågor i webbläsare (inga bilder finns), riktig telefon.

## Köra

- `npm run dev`: utvecklingsserver.
- `npm test`: typkontroll och tester. Läs exit-koden, inte bara utskriften.
- `npm run build`: bygger till `dist/`.
- Push till `main` bygger och lägger ut via `.github/workflows/deploy.yml`.

## Bildpipeline

Codex CLI körs härifrån: `codex exec --skip-git-repo-check -s workspace-write -C /c/dev/dinodeck "<prompt>"`, med `$imagegen` i briefen. Resultaten hamnar i `C:\Users\patri\.codex\generated_images\` och kopieras till `img-src/`.

- **Stilrunda 1 underkänd.** Åtta stilar i en och samma Codex-session blev samma halvrealistiska paleoart i olika färg. Brief: `img-src/style-round/BRIEF.md`.
- **Stilrunda 2:** en ny Codex-session per stil, stilen först i prompten, `img-src/style-round/BRIEF2.md` och `styles2.txt`. Filer `r2-<stil>-<djur>.png`.
- **Fälla:** Codex bearbetade alla PNG i mappen, även en fil som inte var dess egen. Briefen måste säga vilka filer som får röras.
- **Fälla:** skalets säkerhetsspärr stoppar omdirigering till dynamiskt filnamn (`> "x-$key.log"`). Använd fast filnamn och `>>`.

## De 30 djuren

- **Startkort (8, i katalogen):** Tyrannosaurus rex, Triceratops, Stegosaurus, Brachiosaurus, Velociraptor, Diplodocus, Ankylosaurus, Pteranodon.
- **Vinns (22, i katalogen):** Spinosaurus, Allosaurus, Giganotosaurus, Carnotaurus, Dilophosaurus, Deinonychus, Compsognathus, Gallimimus, Oviraptor, Therizinosaurus, Archaeopteryx, Microraptor, Argentinosaurus, Apatosaurus, Iguanodon, Parasaurolophus, Maiasaura, Pachycephalosaurus, Protoceratops, Plateosaurus, Mosasaurus, Plesiosaurus.

## Fakta och källor

Mått, årtal och fakta i katalogen är avrundade mittvärden skrivna av Claude ur minnet, inte hämtade rad för rad ur källan. Innehållet är inte jämfört mot källsidorna. Patrik stickprovar.

Källänkarna: 27 djur pekar på NHM Dino Directory, Pteranodon, Mosasaurus och Plesiosaurus på Wikipedia (de finns inte i NHM:s katalog). Kontrollerade 2026-10-03 genom att djurets namn står i sidans `<title>`.

**Fälla:** nhm.ac.uk svarar HTTP 200 även för sidor som inte finns (titeln blir då "undefined | Natural History Museum"). En statuskod bevisar alltså ingenting där, kontrollera titeln.
