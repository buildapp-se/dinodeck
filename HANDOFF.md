---
schemaVersion: 1
status: active
currentGoal: Hela P1 är byggt och live. Kvar: avlyssning av ljuden, test på riktig telefon och surfplatta
nextAction: Patrik lyssnar igenom de 120 ljudklippen och stickprovar de 30 höjdmåtten
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

## 2026-10-03: bilder till alla 30 djur

- **Alla 30 djur och tre scenbakgrunder ligger i `public/img/`.** 28 djur genererades i tre Codex-omgångar med T. rex och Velociraptor som stilreferens.
- **Granskning:** Claude gick igenom alla mot anatominoterna i liten storlek (400 px). Apatosaurus (för kort hals, ingen pisksvans) och Mosasaurus (stjärtfena som på en haj) gjordes om en gång och godkändes. Detaljer som antal fingrar och klor är inte kontrollerade i full storlek.
- **Silhuettfrågor** verifierade i Chromium: mörk form, tre färgbilder att välja mellan, rätt svar godkänns. De använder bara öppna kort, så låsta djur inte avslöjas i färg.
- **Storlek:** 30 djur 70 till 150 kB styck, bakgrunder 260 till 310 kB, hela `dist/` ca 4 MB.
- **Fälla:** bakgrundsborttagningen i `convert-art.py` tar ca 10 sekunder per bild (flodfyllning i ren Python). 28 bilder tar flera minuter: kör i bakgrunden.

## 2026-10-03: scenen

- **Byggt** (`src/sceneView.ts`, rutt `#/scen`): välj period, tryck på ett djur i listan för att ställa ut det, dra för att flytta, knappar för större, mindre, vänd och ta bort. Sparas i `state.scene` med lägen som andelar av scenens storlek, så den ser likadan ut på mobil och surfplatta.
- **Val av Claude:** djur börjar i skalenlig storlek (Diplodocus mycket större än Velociraptor), det som står längre ned ritas framför, högst 20 djur. Bara öppna kort som har bild går att ställa ut.
- **Ljud i scenen (tillagt senare samma dag):** två snabba tryck på ett utställt djur ger dess vrål. Räknas för hand i `pointerup`, eftersom webbläsarens `dblclick` inte går att lita på för ett finger på något som också dras. Ett tryck markerar bara, drag ger inget ljud, ljud av gäller här också.
- **Bakgrunder:** färgfält tills `public/img/bg-<period>.webp` finns. Brief: `img-src/BRIEF-bg.md`.
- **Verifierat** i Chromium 390×844: lägga till, dra, större, vända, byta bakgrund, ta bort, sparat efter omladdning. **Inte verifierat:** riktig pekskärm, surfplatta i liggande läge.
- **Fälla:** `vite preview` kan ligga kvar på porten efter att den stoppats, och webbläsaren kan visa gammal `index.html`. Ladda med `?v=N` och jämför skriptnamnet mot `dist/assets/` innan ett testresultat tros.

## 2026-10-03: tidslinjen

- **Byggt** (`src/timeline.ts` rena funktioner, `src/timelineView.ts`, rutt `#/tidslinje`): remsa i linjär skala, 20 px per miljon år, från 252 miljoner år sedan till idag. Djuren står vid mitten av sin tid, i rader så att inga krockar. Tryck på öppet djur ger kortet, tryck på låst ger utmaningen om just det djuret.
- **Poängen** visas i en fast översikt ovanför remsan: hela tiden på en skärmbredd, Stegosaurus och T. rex utsatta, och två streck med siffror ur katalogen (77 respektive 66 miljoner år). Rutan i översikten visar var i remsan man är.
- **Val av Claude:** första besöket öppnar vid äldsta djuret, inte vid tom trias. Läget i remsan minns man tills sidan laddas om. "Tillbaka" på ett kort leder till listan man kom från (favoriter eller tidslinje). Märken: asteroiden vid 66 och "Idag" vid 0. Periodgränser 252, 201, 145, 66 (avrundade).
- **Verifierat** i Chromium 390×844 och 1024×768 liggande, mot `vite preview`: 30 djur, 22 låsta som silhuett, tryck öppet och låst, tillbaka med bevarat läge, engelska, ingen sidledes scroll på sidan, fem poster får plats i navigeringen. `npm test`: 9 tester, bland annat att inga djur krockar i en rad och att varje djur ligger inom sin period.
- **Inte verifierat:** svep med finger på riktig pekskärm (remsan rullar med webbläsarens egen sidledes rullning), drag med mus.
- **Känt:** på liggande surfplatta blir djuren små (8 rader på 530 px höjd). Långa namn kortas med tre punkter.
- **Fälla:** Playwright-MCP:n delas mellan sessioner och svarar "Browser is already in use" om en annan session har den. Chrome DevTools-MCP:n med `isolatedContext` fungerar parallellt.

## 2026-10-03: föräldraläget

- **Byggt** (`src/parentView.ts`): kugghjulet uppe till höger hålls in i 3 sekunder (knappen fylls med färg under tiden). Kort tryck visar bara "Håll in i 3 sekunder". Innehåll: alla kort öppna (av och på), ljud (av och på), språk, nollställ samlingen.
- **Val av Claude:**
  - Språkknappen i sidhuvudet är borttagen, språk byts bara i föräldraläget. Första språket följer webbläsarens språk som förut.
  - "Alla kort öppna" är en strömbrytare (`state.unlockAll`), inte en engångshandling: vunna kort ligger kvar i `state.won`, så att slå av den ger tillbaka läget före.
  - Nollställning kräver två tryck och tar bort vunna kort, favoriter och scen. Språk och ljudval ligger kvar.
  - Adressen `#/foralder` öppnar inte läget, bara trycket gör det.
- **Verifierat** i Chromium 390×844 och 1024×768: kort tryck, 2 sekunder (öppnar inte), 3 sekunder (öppnar), alla fyra val sparas i `localStorage`, kortlek och tidslinje utan låsta kort när allt är öppet, nollställning i två steg. `npm test`: 10 tester.
- **Inte verifierat:** riktigt finger. Ett långt tryck på telefon kan ge markering eller meny i vissa webbläsare, spärrat i CSS och med `contextmenu`, men inte provat på enhet.
- **Känt:** slås "alla kort öppna" av igen ligger favoriter och scendjur som blev låsta kvar. I favoritlistan leder de då till utmaningen.

## 2026-10-03: offline och installation

- **Byggt:** `src/sw.js` (service worker), `public/manifest.webmanifest`, ikoner i `public/icons/` och `public/favicon.png` (gjorda av `tools/make-icons.py` ur T. rex-bilden). Inget nytt beroende.
- **Så fungerar versionsbytet:** `vite.config.ts` stämplar varje bygge med en tid (`__BUILD__`) och skriver `dist/sw.js` med stämpeln och listan över alla filer i `dist/` överst. Ny deploy ger alltså en ny `sw.js`, webbläsaren ser att filen ändrats, sparar allt på nytt under ett nytt cachenamn (`dinodeck-<stämpel>`) och tar bort det gamla.
  - **Sidan (`index.html`) hämtas från nätet först**, med sparad kopia som reserv efter 4 sekunder eller utan nät. Därför syns en ny version redan vid första laddningen efter deploy, inte vid andra.
  - **Allt annat hämtas ur cachen först.** Skript och stilmall har namn som ändras med innehållet. Bilder och ljud har fasta namn och byts när den nya service workern har sparat klart, alltså vid laddningen efter.
  - Versionen står längst ned i föräldraläget (byggtid, svensk tid).
- **Hur fort en deploy slår igenom, uppmätt live 2026-10-03:** sidan och appkoden direkt, vid första laddningen (även när den gamla service workern styr sidan). Offlinekopian senare: `sw.js` har fast namn och låg kvar i gammal version på CDN-kanten i ungefär 10 minuter efter deployen, och först när webbläsaren får den nya filen sparas allt på nytt.
- **Cloudflare ligger framför GitHub Pages** på buildapp.se (`Server: cloudflare`, bara som mellanlager, inga Workers). Filer med ändelse som `.js`, `.webp`, `.mp3` får `Cache-Control: max-age=14400` till webbläsaren (4 timmar), HTML får 600 sekunder. Det är förklaringen till fällan med gammal `index.html` längre ned.
  - Därför hämtar service workern varje fil med `?v=<stämpel>` och `cache: 'reload'` när den sparar: annars kunde en ny version spara förra deployens bild eller ljud för gott.
  - `curl` mot en fil utan fråga i adressen visar alltså inte säkert senaste deployen. Lägg på `?v=$RANDOM`.
- **Fälla, kostade en felsökning:** `<script crossorigin>` skickar en `Origin`-rubrik som installationen inte skickade, och en server som svarar `Vary: Origin` (`vite preview` gör det) får då cachen att missa just skript och stilmall. Sidan laddades offline men var tom. Lösning: `ignoreVary: true` i uppslagningen. Syntes bara med servern helt avstängd.
- **Fälla:** domänen delas med andra appar på buildapp.se. Service workern raderar bara cachar som börjar på `dinodeck-`. Rör aldrig `caches.keys()` utan det filtret.
- **Fälla för lokala prov:** service workern registreras även mot `vite preview` (inte mot `npm run dev`). Gammalt innehåll i en lokal webbläsare kan alltså komma ur cachen. Sidan själv är alltid färsk när servern är uppe, bilder först efter en laddning till.
- **Verifierat** lokalt i Chromium: 42 filer sparade, favicon och manifest svarar 200, nytt bygge visas vid första laddningen och gamla cachen tas bort, och med **servern avstängd** laddas kortlek, tidslinje och scen med alla bilder utan konsolfel.
- **Verifierat live** (buildapp.se, Chromium): en webbläsare med service workern från 10:56 fick nya appkoden vid första laddningen efter varje deploy, och bytte sedan själv till cachen från 11:18 med alla 162 filer och tog bort den gamla. Ljud levereras ur cachen (`deliveryType: cache-storage`). Inga konsolfel, favicon ger inte längre 404.
- **Inte verifierat:** live helt utan nät (verktygens offline-läge stryper sidan men inte service workern, så provet säger inget; lokalt är det provat med servern avstängd). Installation på hemskärm på riktig telefon (Android och iOS). Safari.

## 2026-10-03: ljuden

- **Byggt:** 60 ljud i `public/audio/` (`<id>-roar.mp3` och `<id>-call.mp3`, 1,3 MB totalt), `src/sound.ts` (uppspelning), `src/picture.ts` (träffar trycket själva djuret?), `tools/make-sounds.py`.
- **INTE AVLYSSNAT.** Claude kan inte höra. Ljuden är kontrollerade med mätning (längd, ljudnivå, och att tyngre djur blir djupare i alla 17 jämförbara par), inte med öron. Patrik behöver lyssna igenom dem. Ändra i tabellen `RECIPES` i skriptet och kör om.
- **Så låter ett djur:** varje ljud är ett recept av ett eller flera lager (källa, vilken stark passage, tonhöjdsknuff, volym). Tonhöjden följer vikten: uppspelningshastighet = (inspelat djurs vikt / dinosauriens vikt) upphöjt till 0,18, mellan 0,45 och 2,2. Längden följer också vikten, 0,9 till 3 sekunder. Vikterna läses ur katalogen.
- **Källor (9 filer, `audio-src/`, incheckade):** alligator, elefant, lejon, bison, duva, gråtrut, trana, korp, järpe. Alla från Wikimedia Commons, CC0 eller public domain (flera från amerikanska National Park Service och Fish and Wildlife Service). Sida, upphovsperson, licens, kontrollsumma och datum står per fil i `audio-src/sources.json`.
  - **Licensspärr i skriptet:** det vägrar köra om en källa har annan licens än CC0 eller public domain, eller om filens kontrollsumma inte är den som antecknades när licensen lästes.
  - **Struts och kasuar** (nämnda i beslutet) finns inte fritt på Commons. xeno-cantos sök-API kräver nyckel sedan version 3, Freesound kräver konto. Ersatta av duva (kuttrar med stängd näbb, som forskarna tror om de stora) och järpe (trummande, till Gallimimus).
  - Duvan är Commons egen mp3-version av filen: originalet har ett format som `soundfile` inte läser. Antecknat i källistan.
- **Första avlyssningen (Patrik, T. rex-vrålet):** ett farligt ljud och ett mesigt pip i samma fil. Pipet var elefanttrumpeten som lager: elefanten väger 4 ton, så viktregeln sänker den knappt (hastighet 0,88 mot lejonets 0,51), och den är bara 1,6 s lång. Borttagen som lager ur fyra vrål (T. rex, Triceratops, Therizinosaurus, Plesiosaurus), ersatt av lejon eller mer alligator. Regeln står som kommentar vid `RECIPES`.
  - **Inte avlyssnat efter rättningen.** Elefanten är fortfarande huvudröst i nio ljud (vrålen för Brachiosaurus, Diplodocus, Argentinosaurus, Apatosaurus, Plateosaurus, Iguanodon, Parasaurolophus, Maiasaura, och Maiasauras läte). De har 1 500 till 3 400 Hz i tyngdpunkt och kan låta lika ljusa.
- **Parasaurolophus** läte är syntetiskt (funktionen `horn`): en lång och en kort ton kring 100 Hz med övertoner, som en trombon. Ingen inspelning, alltså ingen licens.
- **I appen:** tryck på själva djuret på framsidan ger vrål och ett litet hopp, tryck utanför bilden, på namnet eller på vändknappen vänder. På baksidan och i detaljvyn finns "Lyssna" under "Hur lät den?", med raden "Ingen har hört djuret på riktigt. Ljudet är en gissning." Låsta kort låter inte. Med ljudet av (föräldraläget) försvinner knapparna och tryck på djuret vänder.
- **Val av Claude:** Web Audio i stället för `<audio>`, eftersom Safari ber om ljudfiler i delar och en fil sparad av service workern inte svarar på det. Ljuden sparas för offline tillsammans med allt annat (102 filer).
- **Verifierat** i Chromium 390×844 och 1024×768: tryck på djuret spelar rätt fil utan att vända, tryck ovanför bilden och på namnet vänder, "Lyssna" spelar lätet, svep sparar favorit utan ljud, ljud av döljer allt. `npm test`: 13 tester.
- **Inte verifierat:** hur det låter. Riktig telefon, särskilt iPhone (ljud kräver ett tryck först, och tyst läge kan stänga av Web Audio). Djupa läten kan bli svaga i en telefonhögtalare: alligatorbaserade läten har bara omkring 30 % av energin över 300 Hz.

## 2026-10-03: uttal av namnen

- **Byggt:** 60 klipp i `public/audio/` (`<id>-say-sv.mp3`, `<id>-say-en.mp3`, 638 kB), knapp med högtalare vid uttalsraden på kortets baksida och i detaljvyn, `tools/make-names.py`.
- **Ingen tjänst, inget konto.** Talsyntesen är Piper (`piper-tts` 1.8.0, GPL-3, körs bara som verktyg på den här datorn och följer inte med appen). Villkor lästa 2026-10-03 i varje rösts `MODEL_CARD`:
  - Svenska `sv_SE-nst-medium`: tränad från grunden av KB-labb på NST-databasen, **CC0**.
  - Engelska `en_GB-cori-high`: tränad från grunden på inspelningar från LibriVox, **public domain**.
  - Förrådet med röster (`rhasspy/piper-voices`) är MIT. Klippen får publiceras och kräver ingen källhänvisning. Röster som är finjusterade från `lessac` valdes bort: den datamängden har hårdare villkor.
- **Fälla: ge inte rösten namnet som text.** Svenska rösten lägger då trycket på första stavelsen i alla namn och säger sj-ljud i Brachiosaurus och Pachycephalosaurus. Engelska rösten får Deinonychus, Maiasaura, Iguanodon och Plateosaurus fel. Uttalet står därför som fonetisk skrift (IPA, så som espeak-ng skriver den) per namn och språk i tabellen `NAMES`, och matas in med `[[ ... ]]`. Det följer uttalshjälpen i katalogen (`pronounce`).
- **INTE AVLYSSNAT.** Claude har granskat den fonetiska skriften, inte ljudet. Skriptet kontrollerar att rösten har alla tecken och att längden är rimlig per ljud. Låter ett namn fel: ändra raden i `NAMES` och kör om.
- Röstmodellerna (177 MB) laddas ned vid första körningen till `audio-src/voices/`, som är gitignorerad.
- **Verifierat** i Chromium 390×844 och 1024×768: knappen spelar rätt fil på svenska och engelska, på kortets baksida och i detaljvyn, och döljs med ljudet av. Offline sparas nu 162 filer, `dist/` är 6,8 MB.

## 2026-10-03: bilden täckte namnet på bred skärm

- **Fel** (Patrik såg det på Triceratops i detaljvyn): på surfplatta och dator rann bilden ut över namn och uttalsknapp, upp till 226 px (Brachiosaurus). Syntes inte i 390 px bredd, där bilden blir lägre än rutan.
- **Orsak:** `.art` är ett rutnät, och en rad med standardvärdet `auto` växer med bildens egen höjd i stället för att hålla sig till rutans. `height: 100%` på bilden hjälper då inte.
- **Rättning:** `grid-template: minmax(0, 1fr) / minmax(0, 1fr)` på `.art`, alltså en cell som är exakt så stor som rutan. Rättat i den delade klassen, så kortlek, favoritrutor, utmaning och detaljvy får samma beteende.
- **Verifierat** i 390×844 och 1024×768 på sju djur med olika bildformat, plus kortlek, favoritruta och utmaning.
- **Lärdom:** höga bilder i bred ruta ska alltid provas i 1024, inte bara 390. Batchen mätte överlapp bara i mobilstorlek.

## 2026-10-03: storleksjämförelse och dragbar översikt

- **Storleksjämförelse** (detaljvyn, alltså kortet från favoriter och tidslinje): djuret som mörk silhuett och ett barn på 1,2 m på samma marklinje, i samma skala. Raden under säger höjd och längd. `src/scale.ts` räknar pixlar per meter, vyn ligger i `renderDetail`.
- **Fälla som kostade ett varv:** första versionen skalade bilden efter kroppslängd. Bilderna är målade snett framifrån, så bildens bredd är mycket mindre än längden, och Triceratops blev 6,8 m hög, Argentinosaurus 27 m. Den versionen lades aldrig ut. Nu skalas bilden efter **höjd**.
- **Nytt fält `heightM`** på alla 30 djur: från marken till högsta punkten så som djuret står på bilden (huvud, plattor, segel eller kam). Skrivna av Claude ur minnet efter att ha tittat på varje bilds pos, inte hämtade ur källan. Patrik stickprovar.
  - Mest ungefärliga: Pteranodon (flyger, 4 m är posens höjd), Mosasaurus och Plesiosaurus (simmar), Microraptor (glidflyger), Argentinosaurus (halsens vinkel avgör). För de som inte står på marken säger raden bara längd eller vingbredd.
  - Byts en bild mot en med annan pos ska `heightM` ses över.
- **Översikten på tidslinjen går att dra i.** Tryck eller drag flyttar remsan så att den punkten hamnar i mitten. Patrik läste den som ett handtag, och det var den inte.
- **Verifierat** i Chromium 390×844 och 1024×768: barn och djur har samma skala (nio djur mätta), står på samma linje och ryms i rutan. Översikten: tryck, drag, släpp. `npm test`: 16 tester.
- **Inte verifierat:** riktigt finger på översikten.

## 2026-10-03: omfärgning av kortbilderna

- **Varför:** alla 30 djur blev orange och ockra. Patrik bestämde variation som huvudregel. Färg per djur: `docs/research/dinosaur-colour.md` avsnitt 6. Briefer: `img-src/BRIEF-recolour.md` och `BRIEF-recolour-redo.md`.
- **Gjort:** 26 djur omfärgade av Codex (`$imagegen` i EDIT-läge med originalet som mål, alltså samma teckning i ny färg). Inte omfärgade: Microraptor, Archaeopteryx, Mosasaurus, Plesiosaurus.
- **Mappar (`img-src/`, bara på den här datorn):** `v1/` original (rör aldrig), `v2/` första omfärgningen, `v2b/` andra omgången för sju djur, `img-src/<id>.png` det som faktiskt konverterades, `review/` kontaktark.
- **Omgång 3 kördes aldrig om.** Den avbrutna körningen hade redan genererat alla åtta bilder, det var bara kopieringen till `v2/` som dog av minnesbrist. De hämtades ur `~/.codex/generated_images/` enligt Codex egen slutrapport i `img-src/recolour-run.log`. Läs loggens sista rader innan en avbruten körning görs om.
- **Andra omgången, sju djur:** allosaurus, argentinosaurus, carnotaurus, diplodocus, plateosaurus, protoceratops, therizinosaurus var fortfarande gyllenbruna. Orsak: briefens ord ("tawny", "sandy", "ochre", "mid brown") landar i samma ton som originalen. Omgörningen förbjöd orange och gult helt och slog över: sju grå djur.
  - **Valt ur omgång 2 (kallare än researchfilens palett):** argentinosaurus (blek sten, brun sadel), diplodocus (mörk valnöt), plateosaurus (grädde med längsgående ränder), protoceratops (blek, mörk mask och kragkant).
  - **Behållna ur omgång 1:** allosaurus (grå versionen gick inte att skilja från giganotosaurus), carnotaurus (enda gula med grå prickar), therizinosaurus (brunt stöds av släktingen, grå liknade gallimimus).
  - Byta tillbaka ett djur: kopiera önskad fil från `v2/` eller `v2b/` till `img-src/<id>.png` och kör `convert-art.py <id>`.
- **Kontroller (båda skriver en rad per bild och avslutar med fel):**
  - `uv run --with pillow img-src/check-recolour.py`: kontur mot `v1/` (snitt genom union av de frilagda formerna, gräns 90 %) och kontaktark `img-src/review/sheet.png`. `V2=v2b` eller `V2=.` väljer mapp. Resultat: 26 av 26, lägst 96,4 %.
  - `uv run --with pillow img-src/check-cards.py`: kortbildens silhuett mot den incheckade, och ark på mörk bakgrund `img-src/review/cards-dark.png`. Resultat: 26 av 26, lägst 94 %, bildstorlek inom 1 %.
- **Fälla:** måttet "andel orange" i `check-recolour.py` räknar även brunt (samma färgton, bara mörkare). Det duger för att se att något hänt, inte för att godkänna. Ögat avgör.
- **Fälla:** "inget orange alls" ger grått. Nästa gång: namnge den färg som ska in (blågrå, mossgrön, valnöt), inte den som ska bort.
- **Granskat av Claude i liten storlek** (380 px per bild): inga tappade horn, plattor, klor eller fjädrar, ingen mark eller bakgrund. Inte granskat i full storlek. Patrik har inte sett bilderna.
- **Inte gjort:**
  - **Ikonerna** (`public/icons/`, favicon) är gjorda ur den gamla orange T. rex-bilden. `tools/make-icons.py` gör om dem.
  - **`heightM`** behöver inte ses över: posen är densamma.
  - **Versionerade bildnamn.** Bilderna har fasta namn, så en besökare med appen installerad får gamla bilder vid första laddningen efter en deploy och nya vid nästa (se avsnittet om offline). Den riktiga lösningen är att låta Vite ge bilderna innehållshash i namnet: flytta `public/img/` till `src/img/` och hämta adresserna med `import.meta.glob('./img/*.webp', { eager: true, query: '?url', import: 'default' })`. Det rör sju ställen i `src/` och två skript i `tools/`, och gjordes inte här eftersom sessionen bara fick röra bilder och dokument.

## Köra

- `npm run dev`: utvecklingsserver.
- `npm test`: typkontroll och tester. Läs exit-koden, inte bara utskriften.
- `npm run build`: bygger till `dist/`, och skriver `dist/sw.js`.
- `uv run --with pillow tools/make-icons.py`: gör om ikoner och favicon.
- `uv run --with soundfile --with numpy tools/make-sounds.py`: bygger om alla 60 läten. En rad per kontroll, felkod om något ser fel ut.
- `uv run --python 3.12 --with piper-tts --with soundfile --with numpy tools/make-names.py`: bygger om de 60 namnklippen.
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

Mått (även `heightM`), årtal och fakta i katalogen är avrundade mittvärden skrivna av Claude ur minnet, inte hämtade rad för rad ur källan. Innehållet är inte jämfört mot källsidorna. Patrik stickprovar.

Källänkarna: 27 djur pekar på NHM Dino Directory, Pteranodon, Mosasaurus och Plesiosaurus på Wikipedia (de finns inte i NHM:s katalog). Kontrollerade 2026-10-03 genom att djurets namn står i sidans `<title>`.

**Fälla:** nhm.ac.uk svarar HTTP 200 även för sidor som inte finns (titeln blir då "undefined | Natural History Museum"). En statuskod bevisar alltså ingenting där, kontrollera titeln.
