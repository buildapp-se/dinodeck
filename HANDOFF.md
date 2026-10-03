---
schemaVersion: 1
status: active
currentGoal: Steg 1 och 2 live (kortlek, favoriter, utmaningar, 30 djur), sedan bilder i vald stil
nextAction: Granska och konvertera Codex-bilderna för de 28 återstående djuren, sedan tidslinjen
blockers: []
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

## 2026-10-03: scenen

- **Byggt** (`src/sceneView.ts`, rutt `#/scen`): välj period, tryck på ett djur i listan för att ställa ut det, dra för att flytta, knappar för större, mindre, vänd och ta bort. Sparas i `state.scene` med lägen som andelar av scenens storlek, så den ser likadan ut på mobil och surfplatta.
- **Val av Claude:** djur börjar i skalenlig storlek (Diplodocus mycket större än Velociraptor), det som står längre ned ritas framför, högst 20 djur. Bara öppna kort som har bild går att ställa ut.
- **Bakgrunder:** färgfält tills `public/img/bg-<period>.webp` finns. Brief: `img-src/BRIEF-bg.md`.
- **Verifierat** i Chromium 390×844: lägga till, dra, större, vända, byta bakgrund, ta bort, sparat efter omladdning. **Inte verifierat:** riktig pekskärm, surfplatta i liggande läge.
- **Fälla:** `vite preview` kan ligga kvar på porten efter att den stoppats, och webbläsaren kan visa gammal `index.html`. Ladda med `?v=N` och jämför skriptnamnet mot `dist/assets/` innan ett testresultat tros.

## Köra

- `npm run dev`: utvecklingsserver.
- `npm test`: typkontroll och tester. Läs exit-koden, inte bara utskriften.
- `npm run build`: bygger till `dist/`.
- Push till `main` bygger och lägger ut via `.github/workflows/deploy.yml`.

## Bildpipeline

Codex CLI körs härifrån: `codex exec --skip-git-repo-check -s workspace-write -C /c/dev/dinodeck "<prompt>"`, med `$imagegen` i briefen. Resultaten hamnar i `C:\Users\patri\.codex\generated_images\` och kopieras till `img-src/`.

**Vald stil: `03-gouache-picturebook` ur stilrunda 1.** Arbetsgång per djur:

1. **Generera.** Mall, anatominot och färger per djur står i `img-src/BRIEF-art.md`. Referensbilderna `img-src/tyrannosaurus-rex.png` och `velociraptor.png` bifogas varje körning. Prompten måste stå före `-i`, annars sväljer flaggan den: `codex exec ... "<prompt>" -i a.png -i b.png`.
2. **Granska** bilden mot anatominoten. Gör om bara det som är fel.
3. **Konvertera:** `uv run --with pillow tools/convert-art.py <id>`. Tar bort vit bakgrund (eller behåller genomskinlighet som redan finns), beskär och sparar `public/img/<id>.webp`, längsta sida 900 px. Skriptet avslutar med fel om en bild ser fel ut.

- Codex ger ibland genomskinlig bakgrund och ibland vit, trots samma instruktion. Skriptet klarar båda.
- Vitt som är helt inneslutet av kroppen tas inte bort (markerat `ponytail:` i skriptet).
- `img-src/` är gitignorerad: källbilder och briefer finns bara på den här datorn.
- **Stilrunda 1** (`img-src/style-round/sheet.png`): åtta stilar i en och samma Codex-session blev nästan samma teckning i olika färg. Claude underkände rundan, Patrik valde ändå en av dem.
- **Stilrunda 2** (`sheet2.png`): en Codex-session per stil gav sju tydligt olika stilar. Sparade som kandidater till alternativa stilar (backlog P3).
- **Fälla:** Codex bearbetade alla PNG i mappen, även en fil som inte var dess egen. Briefen måste säga vilka filer som får röras.
- **Fälla:** skalets säkerhetsspärr stoppar omdirigering till dynamiskt filnamn (`> "x-$key.log"`). Använd fast filnamn och `>>`.

## De 30 djuren

- **Startkort (8, i katalogen):** Tyrannosaurus rex, Triceratops, Stegosaurus, Brachiosaurus, Velociraptor, Diplodocus, Ankylosaurus, Pteranodon.
- **Vinns (22, i katalogen):** Spinosaurus, Allosaurus, Giganotosaurus, Carnotaurus, Dilophosaurus, Deinonychus, Compsognathus, Gallimimus, Oviraptor, Therizinosaurus, Archaeopteryx, Microraptor, Argentinosaurus, Apatosaurus, Iguanodon, Parasaurolophus, Maiasaura, Pachycephalosaurus, Protoceratops, Plateosaurus, Mosasaurus, Plesiosaurus.

## Fakta och källor

Mått, årtal och fakta i katalogen är avrundade mittvärden skrivna av Claude ur minnet, inte hämtade rad för rad ur källan. Innehållet är inte jämfört mot källsidorna. Patrik stickprovar.

Källänkarna: 27 djur pekar på NHM Dino Directory, Pteranodon, Mosasaurus och Plesiosaurus på Wikipedia (de finns inte i NHM:s katalog). Kontrollerade 2026-10-03 genom att djurets namn står i sidans `<title>`.

**Fälla:** nhm.ac.uk svarar HTTP 200 även för sidor som inte finns (titeln blir då "undefined | Natural History Museum"). En statuskod bevisar alltså ingenting där, kontrollera titeln.
