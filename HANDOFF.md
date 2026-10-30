---
schemaVersion: 1
status: active
currentGoal: 50 djur live, söt stil i föräldraläget för alla (inte bekräftad av Patrik). Batch 5 (20 djur) researchas med Codex. Kvar: test på riktig telefon, surfplatta och papper, ungar till resten
nextAction: Batch 5: data ur docs/research/batch-5a.md och batch-5b.md, målning, söt bild och målarbild (Codex), vrål, läte och uttal (lokalt); söta vrål först efter 2026-11-06 (ElevenLabs). Uppläsning för batch 4 och 5 saknas (OmniVoice). Äldre: `uv run tools/retake-read.py audio-src/read/check.log`
blockers: []
reviewedAt: 2026-10-30
---

# Handoff: Dinodeck

## 2026-10-30: flera målarbilder på en gång

- **Live:** föräldraläget har "Skriv ut målarbilder": en utfällbar lista med djuren barnet har öppna (som på kortet, låsta visas inte), favoriterna förvalda, knapparna Alla och Inga, en utskriftsdialog för hela valet.
- **Så funkar det:** `printSheet(...sheets)` lägger varje ark i en egen `.print-sheet`. `tall` sitter nu per ark, så varje djur väljer riktning själv. Valet sparas inte: omritning av vyn (en brytare) nollställer till favoriterna.
- **Testfälla:** `page.pdf` utlöser `afterprint`, som tar bort `colouring`. Andra PDF:en i rad skriver därför ut appen: bygg arket på nytt före varje PDF.
- **Verifierat:** `npm test`; riktigt flöde i Chromium (håll knappen, välj, skriv ut, inga konsolfel); PDF med blandade djur: 4 sidor, rätt riktning per sida, också med `size` borttagen ur `@page`.
- **Inte verifierat:** riktig telefon, skrivare och papper, och utskrift av alla 50 på en gång.

## 2026-10-30: målarbilden vrids på stående papper

- **Problem (Patrik):** på mobilen blev utskriften stående fast den ska vara liggande. Webbläsare som struntar i `@page size` ger stående papper. Vilken telefon det gällde är inte känt.
- **Lösning:** `style.css`, `@container (max-width: 200mm)` på `body`: blir sidan smal vrids det breda arket 90 grader. Höga djur (`.tall`) rörs inte.
- **Fälla:** `@media print and (orientation)` följer pappersinställningen, inte `@page`: Chromium svarar `portrait` på en liggande sida. Vridning via mediefrågan hade förstört datorutskriften. Mätt med PDF.
- **Verifierat:** PDF i Chromium med telefonbredd, tittat på resultatet: med `@page` som förut (T. rex och scen liggande, Brachiosaurus stående), utan `size` i `@page` (simulerar telefonen) ligger T. rex och scen vridna på stående A4, en sida var. `npm test`, `npm run build`.
- **Inte verifierat:** riktig telefon. iOS och Android har egna utskriftsdialoger, och reglen hjälper bara om deras layout faktiskt blir stående bredd.
- **Linjetjocklek:** 1,1 till 2,3 mm på papper, median 1,8 mm över 50 djur (uppmätt på `public/img/line/`). Avsiktligt: briefen ber om 1 % av bildbredden, `make-outlines.py` förtjockar ytterligare. Oförändrat.

## 2026-10-28: söt stil, och tio nya djur på en gren

- **Live (22:06, verifierat på buildapp.se):** föräldraläget har "Söta dinosaurier". På: varje kort, scenen och utmaningarna visar leksaksfiguren (`public/img/cute/<id>.webp`) och spelar ett sött vrål (`public/audio/cute/<id>-roar.mp3`). Storleksjämförelsen och målarbilderna behåller målningen. Valet överlever nollställning. `src/cute.ts`, `cute.test.ts` kräver båda filerna för varje djur i katalogen. **Inte avlyssnat eller provat av Patrik.**
- **Bilder:** Codex i stilen `r2-f-vinyl-toy` (stilrunda 2), brief `img-src/cute/BRIEF-all.md`, färger från varje djurs målning. Körs i batchar med en mapp per jobb (`img-src/cute/b<n>/`) via `img-src/cute/run-batches.sh`. "Selected model is at capacity" hos OpenAI: kör om batchen, det är inte kvoten.
- **Vrål:** ElevenLabs, `uv run tools/try-elevenlabs.py --cute` (2 utkast à 2 s). **Fälla: "baby" eller "toddler" i prompten gav gråtande människobebisar** (10 av 15, Patrik hörde det); prompter per djurtyp gav 67 av 70 dinosaurieljud. Varje utkast klassas av `tools/review-cute-roars.py` (dinosaurie, människobebis eller annat), sedan väljer `tools/judge-roars.py --cute`. Valda filer i `audio-src/elevenlabs-cute-roars/`. Gratisplanen: cirka 530 krediter kvar, återställs 2026-11-06 20:56. Söta vrål för nya djur är pausade tills dess (Patrik).
- **Batch 4, live 2026-10-29 (sammanslagen från grenen `batch-4`):** tio djur ur `docs/research/batch-4.md` (Codex med webbsök, höjder uppskattade som i batch 3): data, målning, söt bild, vrål och läte (`make-sounds.py`, 101/101 par), uttal (Piper; Piper skrev om befintliga namnklipp byte för byte, de återställdes, bara nya behölls), sött vrål. `when()` klarar ett enda datum (Shonisaurus 227) och skriver decimalkomma (Anurognathus 150,8). Målarbilderna gjordes 2026-10-29 när kvoten var tillbaka; `make-outlines.py` underkände Cryolophosaurus första försök (Codex flyttade och skalade om djuret), omgjort med uttrycklig instruktion att behålla målningens inramning. Saknas: uppläsning (OmniVoice, `tools/make-read-sv.py`). Inga ungar: researchen hittade inget säkert.
- **Batch 5:** `docs/research/BRIEF-batch-5.md` och `run-batch-5.sh` (två jobb, trias och jura respektive krita). Avbröts av kvoten: `batch-5b.md` på grenen har 4 djur som utkast, 5a inget.

## 2026-10-28: uppläsning för alla 40 djur

- **Live:** alla 40 djur läses upp på svenska (ingress, Visste du?, ungen, färg, Mer att läsa), 172 klipp, 12 MB (appen 23 MB offline). 29 av 40 namn i kortets röst.
- **Geminis lyssning** (`check-read.py`, svar sparas i `audio-src/read/checked.json`): 52 av 172 klipp flaggade, 6 fick inget svar. Lista i `audio-src/read/check.log` (gitignorerad). Vanligast: "växtätare" och "köttätare" med dubbel konsonant, enstaka upprepade ord ("att att", "hade lång hal had lång hals" i Plateosaurus Mer att läsa).
- **Fällor:** MMS-alignern körs på CPU (på grafikkortet bredvid Whisper: out of memory); Whisper behöver `chunk_length_s=30` för klipp över 30 s; `check-read.py` måste skriva UTF-8, annars läser `retake-read.py` fel ord.
- **Ej verifierat:** omtagningen (`tools/retake-read.py`), ordmarkeringen för örat, riktig telefon.

## 2026-10-27: uppläsning med ordmarkering, prov på T. rex

- **Live:** T. rex detaljsida på svenska, högtalarknapp efter ingressen och varje faktarad; orden lyser (ockra) medan OmniVoice läser. Knapparna döljs när ljudet är av. Andra djur och engelska visar texten som förut.
- **Hur:** `tools/make-read-sv.py` gör klipp (`public/audio/read/`) och ordtider (`src/read-sv.json`, importeras av `main.ts`, `readable()`); texterna samlas av `tools/read-texts.ts`. Ordtider med MMS-alignern; första försöket (orden fördelade efter bokstäver) drev upp till en sekund i långa texter. `SAY` stavar om feluttalade ord ("banaan"). `play()` i `src/sound.ts` ger nu en klocka till den som vill följa ljudet.
- **Verifierat:** Playwright på buildapp.se: orden tänds i ordning och pausen mellan meningarna hålls. Ej verifierat: att markeringen följer rösten för örat, på riktig telefon.
- **Fälla:** KB-Whispers ordtider (`return_timestamps="word"`) ger CUDA out of memory i WSL fast 7 GB är ledigt; vanlig transkribering fungerar.

## 2026-10-27: filmvrål från ElevenLabs, alla 40 live

- Utkast (3 per djur, Brachiosaurus 9) i `audio-src/elevenlabs/` (gitignorerad, `listen.html` där). `tools/try-elevenlabs.py` gör utkast, gratisplanen, ca 3 300 krediter totalt. Beslut och licens: CONTEXT, raden Ljud. Källraden står i föräldraläget, `integritet.html` och `licenser.txt`.
- Valt utkast ligger i `audio-src/elevenlabs-roars/<id>.mp3`; `tools/make-sounds.py` använder det i stället för receptets vrål.
- **Patrik valde 7:** T. rex 1, Triceratops 2, Stegosaurus 1, Diplodocus 3, Ankylosaurus 1, Pteranodon 2, Velociraptor 6 (Brachiosaurus 1-6 underkända).
- **Gemini valde 22** (`tools/judge-roars.py`, gemini-4-argon via OpenRouter, tre röster per djur, ca 1,5 öre per djur). Kalibrering mot Patriks sju: samma val på 1 av 7, alltså ingen smakdomare, bara en spärr mot trasiga utkast (två djur, konstiga slut). Valen: Allosaurus 1, Apatosaurus 1, Archaeopteryx 1, Argentinosaurus 1, Baryonyx 2, Brachiosaurus 7, Carnotaurus 2, Ceratosaurus 2, Coelophysis 2, Compsognathus 2, Deinonychus 2, Dilophosaurus 1, Edmontosaurus 1, Eoraptor 2, Gallimimus 2, Giganotosaurus 1, Herrerasaurus 3, Ichthyosaurus 2, Iguanodon 2, Kentrosaurus 1, Maiasaura 2, Microraptor 2.
- **Gemini valde de sista 11** samma kväll (Patriks "fixa allt"): Mosasaurus 1, Oviraptor 3, Pachycephalosaurus 3, Parasaurolophus 2, Plateosaurus 2, Plesiosaurus 1, Protoceratops 2, Quetzalcoatlus 2, Spinosaurus 2, Styracosaurus 1, Therizinosaurus 2.

## 2026-10-27: ungen hoppar, ny kläckning

- **Ungen:** ett gemensamt `hop()` i `src/main.ts` (pip plus hopp med huk, sträckning och landning) på kortleken, i detaljvyn och i kläckdialogen. Före: detaljvyn och dialogen gjorde ingenting vid tryck, kortleken hoppade bara 14 %.
- **Kläckningen:** oregelbunden spricka (`CRACK` i `src/main.ts`, skalhalvornas `clip-path` i `src/style.css` följer samma punkter) som växer från mitten, grenar vid tryck två, ägget gungar hårdare för varje tryck och vickar av sig själv innan första trycket. Överskalet flyger av, ungen poppar upp ur underskalet, glöd och konfetti med skalbitar (`burstHtml` delas med utmaningsvinsten). Ägget storleksätts på höjd i äggets form och dialogen förankras uppifrån i stående läge, så ägget står still när texten kommer.
- **Verifierat:** `npm test` och bygget gröna. Playwright 390×844, 375×667, 844×390: ungen piper och animeras vid tryck (touch) på kortleken, i detaljvyn och i dialogen, kortet vänds inte; ingen rullning i dialogen; ägget flyttas högst 2 px. Animationen är granskad som frysta bildrutor (Playwright-fönstret renderade 2 bilder/s), inte i full fart: **Patrik provar på telefon**.

## 2026-10-27: mutation-tester

Mutation-lanes under dygnet (Gemini 3.8 Flash och Gemini 4 Argon skrev tester, Stryker 10 mätte, Claude granskade): bara testfiler ändrade om inget annat sägs, inga tester borttagna, repots kontrollkedja grön. Poängen per fil står på Mutation-raden i CONTEXT. Auditsvep inför LinkedIn: UX, WCAG (axe plus tangentbord), Lighthouse, Markup, Headers, TLS och OG image alla pass; källänken på kortet höjd från 40 till 44 px (`src/style.css` `.link`). Faktagranskning (Gemini 3.8 Flash, granskad av Claude): Edmontosaurus maginnehåll står nu som osäkert (omtvistat enligt Wikipedia "Edmontosaurus"; lanens källa Uhl 2020 kunde inte bekräftas), Quetzalcoatlus vingar mäts från vingspets till vingspets. Baryonyx "liknade en gavials" avvisat, korrekt svenska. Argon-granskningen föll på kvoten.

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
- **Tangentbord (2026-10-26):** Delete eller Backspace tar bort markerat djur, samma väg som ta bort-knappen. Bara ett djur kan vara markerat åt gången.
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
- **Verifierat live** (buildapp.se, bygge 16:06 svensk tid, commit `0b6897b`): kontrollsumman för alla 26 bilder är samma som lokalt, både med `?v=<slump>` och med vanlig adress, och `sw.js` är den nya versionen. `npm test` 16 tester, `npm run build` grönt.
- **Inte verifierat:** en webbläsare med appen redan sparad (gammal service worker). Enligt mätningen i avsnittet om offline får den gamla bilder vid första laddningen och nya vid nästa. Den som hämtade en bild direkt, utan service worker, under de senaste fyra timmarna före deployen kan ha den kvar i webbläsarens cache lika länge.
- **Inte gjort:**
  - **Ikonerna och `og.png`** gjordes om ur den omfärgade T. rex samma kväll (21:43). Kontrollerat 2026-10-25: `tools/make-icons.py` ger byte för byte samma filer.
  - **`heightM`** behöver inte ses över: posen är densamma.
  - **Versionerade bildnamn.** Bilderna har fasta namn, så en besökare med appen installerad får gamla bilder vid första laddningen efter en deploy och nya vid nästa (se avsnittet om offline). Den riktiga lösningen är att låta Vite ge bilderna innehållshash i namnet: flytta `public/img/` till `src/img/` och hämta adresserna med `import.meta.glob('./img/*.webp', { eager: true, query: '?url', import: 'default' })`. Det rör sju ställen i `src/` och två skript i `tools/`, och gjordes inte här eftersom sessionen bara fick röra bilder och dokument.

## 2026-10-06: nattbatch på grenen `batch/2026-10-06`

Tre punkter ur backloggen, byggda och committade på grenen. **Sammanslaget med `main` och utlagt 2026-10-07 på Patriks order.** Arbetskopia: `C:\dev\.worktrees\batch-2026-10-06\dinodeck`.

- **Färgraden** (`14286bd`): ny rubrik "Vilken färg hade den?" på kortets baksida och i detaljvyn, mellan ljudet och "Mer att läsa". Nivå per djur i fältet `colour` (`known`, `relatives`, `guess`), extra mening via `colourDisputed`. 2 kända, 12 från släktingar, 16 gissning.
  - **Val av Claude:** rubrikens ordalydelse. Raden syns även med ljudet av (ljudets gissningsrad döljs då, den här inte). Gallimimus räknas som gissning: tabellen säger "Plausible guess (feathers informed by relatives)", och raden handlar om färg.
  - **Verifierat:** `npm test` (nivåerna jämförs mot tabellen i researchfilen, 22 tester totalt efter batchen). Chromium 390×844 och 1024×768 mot `vite preview`: rätt text på svenska och engelska för alla tre nivåer och båda oeniga djuren, i detaljvyn och på kortets baksida, ingen sidledes scroll.
- **Rättigheter i `deploy.yml`** (`d5f4d06`): `permissions: {}` på workflow-nivå, `contents: read` på bygget, `pages: write` och `id-token: write` på utläggningen, `persist-credentials: false` vid utcheckningen.
  - **Verifierat:** `uvx zizmor --offline`: excessive-permissions (2) och artipacked (1) är borta. Kvar: unpinned-uses (4), ny punkt i backloggen.
  - **Verifierat 2026-10-07:** utläggningen går igenom på GitHub. Deploy-workflowen gick grön på `main` efter sammanslagningen, med rättigheterna på jobbnivå.
- **Målarbilder** (`54ddbc8`): knappen "Skriv ut och färglägg" i detaljvyn (ett djur med namn) och en skrivarknapp bredvid periodvalet i scenen (bakgrunden och de utställda djuren på sin plats).
  - **Så görs konturerna:** `uv run --with pillow tools/make-outlines.py` läser varje bild i `public/img/` och skriver `public/img/line/<samma namn>` (33 filer, ca 560 kB). Skillnaden mellan två oskärpor ger linjerna, bildens frilagda kant ger en sluten ytterkontur. Djuren är vita inuti och genomskinliga utanför, så de täcker bakgrundens linjer i scenen. **Byts en bild ska skriptet köras om**, annars visar målarbilden den gamla teckningen. Testet kontrollerar bara att filen finns.
  - **Så skrivs det ut:** `src/print.ts` lägger arket i `#print`, sätter klassen `colouring` på `<html>` och anropar webbläsarens utskrift. Utskriftsstilmallen i `src/style.css` döljer allt annat. Klassen tas bort vid `afterprint`, så en vanlig utskrift från webbläsarens meny ger appen som förut.
  - **Val av Claude:** färdiga filer i stället för att räkna fram konturen i webbläsaren (fungerar offline och lika i alla webbläsare, kostar 560 kB i offlinekopian, `dist/` är nu ca 6,7 MB). Knapparna syns för barnet, inte bara i föräldraläget. Den utskrivna scenen visar hela scenen i 3:2, även det som på en stående telefon ligger utanför bild.
  - **Verifierat:** `npm test`. Chromium med utskriftsläge påslaget och PDF i A4: bara arket syns, konturfilerna används, lägen och storlekar i scenen stämmer med det sparade, 33 konturfiler finns med i service workerns lista. Claude har tittat på alla 33 konturer i liten storlek och på de två PDF:erna.
  - **Inte verifierat:** riktig skrivare och papper, utskrift från telefon eller surfplatta (iOS och Android öppnar egna utskriftsdialoger), Safari och Firefox. Bakgrunderna blir täta av små streck på marken: om det är roligt att färglägga avgör Patrik. Tätheten styrs av de tre talen i `backdrop()` i skriptet.
- **Överhoppat, kräver Patrik:** `promoteDeck` (villkorad av ett hopp som bara syns på riktig telefon), palett och typsnitt (smak), uppläsning av texter (omfång och röst, och ingen har lyssnat på det som redan finns), alternativa bildstilar (nya bilder), struts och kasuar (inga fria inspelningar hittade förra gången, och ett byte ändrar ljud som ingen kan lyssna på i natt).
- **Pteranodons källa, inte bytt:** American Museum of Natural History har en sida (`amnh.org/explore/news-blogs/pteranodon-longiceps`), men den svarar 403 på både hämtverktyg och `curl`, så innehållet gick inte att kontrollera mot kortet. Öppna den i en webbläsare och jämför innan länken byts.

## Köra

- `npm run dev`: utvecklingsserver.
- `npm test`: typkontroll och tester. Läs exit-koden, inte bara utskriften.
- `npm run build`: bygger till `dist/`, och skriver `dist/sw.js`.
- `uv run --with pillow tools/make-icons.py`: gör om ikoner och favicon.
- `uv run --with pillow tools/make-outlines.py`: gör om konturerna till målarbilderna (`public/img/line/`). Körs efter varje bildbyte.
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

## Automated audit batch, 2026-10-06

Cross-project run from elwyn-dash with aifabriken `tools/audit-suite.ts` (headers, npm audit, secrets, Actions, markup, axe at one mobile viewport; TLS and Lighthouse not run). Results are the `(automated)` lines under `## Audits` in CONTEXT.md, findings under `## Granskning 2026-10-06` in BACKLOG.md. Only the local checks ran (no address in the audit inventory): npm audit pass, secrets pass, Actions fail (2 high, 1 medium in `deploy.yml`). No application code or deployment changed. `reviewedAt` was left alone: the goal and next action above were not reviewed.

## Beroendeuppdatering 2026-10-17

- vite 8.3.4, @types/node 26.6.5 (bara låsfilen). `npm test` och `npm run build` gröna före och efter, `npm audit` 0. Inte pushat: en push till `main` deployar.

## 2026-10-25: chunk med Patriks önskemål

Allt på `main`, utlagt. Commits `e70909b` till `bce5181`.

- **og-bilden** var redan rätt (live, 200 för FB, LinkedIn, Slack och X, byte för byte samma som `make-icons.py` ger). Tillagt: `og:site_name`, `og:image:type`, `twitter:image` och alt.
- **Actions pinnade på commit-hash** (samma huvudversioner). `uvx zizmor --offline`: inga fynd. Deploy grön efteråt.
- **Tidslinjen kapades av bottenfältet** på telefon med webbläsarens fält synliga (prov 390×664): remsan hade `min-height: 400px`, fem rader behöver ca 570 px. Nu mäts remsan efter ritning, och får den inte plats med fem rader blir det fyra (`timelineView.ts`). Radhöjden krymper dessutom i CSS om det ändå är trångt.
- **Favoriter:** hjärtat i detaljvyn är helrött när kortet är favorit, vitt med röd kant annars (`aria-pressed`). "Ta bort alla favoriter" under listan, två tryck som nollställningen i föräldraläget.
- **Storleksjämförelsen finns nu även på kortets baksida** i kortleken. Den låg bara i detaljvyn: inget beslut hade tagits emot baksidan, den byggdes bara där. `scaleHtml` och `fitScale` i `main.ts` delas av båda, `ResizeObserver` eftersom ett kort byggs innan det finns på sidan.
- **Carnotaurus:** armarna hade en stor krökt rovklo och vänsterfoten fyra framåtriktade klor. Rättat av Codex i EDIT-läge (original i `img-src/v3/carnotaurus-before.png`): små stumparmar med trubbiga fingrar, tre tår plus sporre. Silhuett mot förra kortbilden 98,9 %.
- **Målarbilderna omgjorda.** Kantdetektering på gouache gav prickig hudtextur och fläckig mark, grå gröt på papper. Nu ritar Codex om varje målning som ren linjeteckning (brief `img-src/BRIEF-line.md`, resultat `img-src/line/`), och `tools/make-outlines.py` förtjockar linjerna, gör utsidan genomskinlig med flodfyllning, ger ytterkonturen extra tyngd och beskär exakt som kortbilden. Utskriften är liggande A4.
  - **Kontroller i skriptet:** fylld yta mot målningens silhuett 85 till 120 % (fångar läckage genom ett glapp i konturen), bläckandel 5 till 40 %.
  - **Verifierat:** PDF i A4 från appens egen utskrift, ett djur och en scen, granskat i 300 dpi. Alla 43 konturer granskade på kontaktark.
  - **Inte verifierat:** riktig skrivare och papper.
  - `public/img/line/` växte från ca 560 kB till 3,5 MB (1 200 px, mjuka kanter). `dist/` är 11 MB.
- **10 nya djur** (research `docs/research/batch-3.md`, agentens tvivel står sist i filen): Coelophysis, Herrerasaurus, Eoraptor (trias), Ceratosaurus, Kentrosaurus, Ichthyosaurus (jura), Baryonyx, Styracosaurus, Edmontosaurus, Quetzalcoatlus (krita). Alla vinns i utmaningar. Bilder (BRIEF-art batch 4a och 4b), målarbilder, läten (`make-sounds.py`), uttal (`make-names.py`), färgnivå (rad 31 till 40 i `dinosaur-colour.md` avsnitt 6).
  - **Tidslinjen:** slutet av krita trängs. Skalan får nu gå upp till 70 px per miljon år (förut 50): fem rader från 32, fyra från 56. Remsan är 8 300 px med fem rader, 14 300 med fyra. Den döda `layoutTimeline` togs bort.
  - **Namnklippen för de 30 gamla** blev annorlunda vid omkörning (troligen nyare Piper), så de gamla ligger kvar oförändrade. De nya ligger i `git stash` (`stash@{0}`) och kan släppas.
  - **Val av Claude:** Ichthyosaurus fick `colourDisputed` (två pigmentstudier säger olika). Baryonyx datering 130 till 125 miljoner år behölls, nyare datering kan vara 126 till 121.
  - **Risk:** tre tvåbenta triasdjur (Coelophysis, Herrerasaurus, Eoraptor) och Compsognathus kan vara svåra att skilja i silhuettfrågan.
  - **Inte verifierat:** ljuden och uttalet (ingen har lyssnat), Eoraptors fingrar och Kentrosaurus taggpar är inte helt rätt enligt Codex egen granskning, syns knappt i kortstorlek.

### Kväll 2026-10-25: Patriks fynd

- **Dubbla ljud:** recepten blandade två inspelningar (Diplodocus elefant + bison m.fl.), det hördes som två djur. Nu en röst per ljud, `make-sounds.py` stoppar annars. Ett avsnitt med paus i hördes också som två läten: `longest_call` behåller bara det längsta. Fem fågelläten blev för korta och fick annan källa. 80 ljud, 128/128 tyngre-är-djupare. Inte avlyssnat.
- **Ta bort alla favoriter:** smal och längst ner (`.row.danger` från föräldraläget vann på specificitet). CSS-ändringen hamnade i ljudcommiten `48d6c95`.
- **T. rex-meningen** (kort och tidslinje) betydde bara "T. rex levde senare". Nu: "Det är kortare tid mellan T. rex och oss än mellan T. rex och Stegosaurus."
- **Pteranodon:** tappen bakom höften (såg ut som en penis) borttagen av Codex i bild och målarbild, original i `img-src/v3/`.

### Granskning med fyra agenter, 2026-10-25 kväll

Buggjakt i webbläsare, kodgranskning, innehåll och språk, appbutiker och barn-UX. Rättat och live (`80587e7`, `3b27d9e`), verifierat i webbläsare:

- **Utmaningen** ritade över nästa vy om barnet tryckte i menyn inom 700 ms (fastnade, eller vinstskärmen över kortleken). Räknaren visade "/ 22" fast 32 ska vinnas. Med alla kort vunna "vanns" alltid T. rex, och med "Alla kort öppna" sa den "Du har vunnit alla". Nav-tryck på sidan som redan visas ritar nu om (vinstskärmen, sedan Utmaning, gjorde förut ingenting).
- **Scenen** fick en ny kopia vid bakåt eller omladdning av `#/scen/<id>`. På 360×640 låg brickan bakom menyn och verktygsraden ovanpå det nya djuret: verktygen sitter nu i scenens överkant, scenen krymper i stället för brickan.
- **Service workern** sparar varje fil under sin innehållshash och kopierar oförändrade filer från förra cachen. En deploy laddade förut ner alla 262 filer (11 MB) på varje enhet; vid prov 2. `AbortSignal.timeout` (Safari 16) bytt mot `AbortController`, 5xx på sidan ger sparad kopia.
- **Ljud:** senaste trycket vinner (förut kunde ett långsamt ljud klippa ett nytt), högst 24 avkodade ljud i minnet.
- **Tidslinjen** öppnar på äldsta djuret (förut 650 px förbi Eoraptor), ritas om när en surfplatta vrids.
- **Övrigt:** långa namn i svarsknappar bryts (Parasaurolophus gick utanför 360 px), fisk räknas som kött i "Vad åt?", räknefrågan frågar "Hur många T. rex?" som bilden visar, dubbeltryck räknas inte som bekräftelse på "Ta bort alla favoriter", låsta favoriter visas som silhuett, fokus stannar på hjärtat, storleksbilden hoppar inte (CLS 0,44).
- **Innehåll:** ca 40 rättelser i fakta och språk, bl.a. Triceratops tänder klippte (malde inte), Brachiosaurus näsborrar, Archaeopteryx hade ingen näbb, inga kända Argentinosaurus-ägg, Baryonyx 126 till 122 milj. år, Protoceratops 85 kg (läten omgjorda), "för 68 till 66 miljoner år sedan", Quetzalcoatlus betyder fjäderklädd orm.

**Inte rättat, kräver Patrik** (står i BACKLOG under Appbutiker): Cloudflare Web Analytics laddar `static.cloudflareinsights.com/beacon.min.js` på live-sajten (verifierat 2026-10-25). Inga kakor, men tredjepartsanalys stoppar Apples Kids-kategori. Ändras i Cloudflare-zonen buildapp.se, som delas med andra projekt. Patrik tar det själv om det blir butiksappar. Källänken och integritetspolicyn är gjorda, se nedan.

### Natt 2026-10-25/26: resten av granskningen och designrunda

Live (`06db28a` till `65b5f59`), verifierat i Chromium mot `vite preview` på 390×844, 844×390, 667×375, 820×1180 och 1440×900:

- **Målarbilder:** tolv konturer gick ut i kanten (svansspetsar, nosar), omritade av Codex med marginal (`img-src/v3/line-edge/`). `make-outlines.py` beskär efter teckningens egen ram och jämför täthet, inte yta. Höga djur (Brachiosaurus, Quetzalcoatlus, Therizinosaurus) skrivs ut på stående A4, `print.ts` väljer; resten liggande. Prövat som PDF, en sida var.
- **Föräldraspärr:** källänken öppnas efter en multiplikationsfråga (6 till 9) i en `<dialog>`. **Integritetspolicy:** `public/integritet.html` (sv/en), länkad från föräldraläget, nämner Cloudflare-räkningen på webbversionen.
- **Övrigt:** sidtiteln följer språket, manifest med `id`, `categories`, `orientation: any`. Tio dubblettfakta utbytta. Fokus följer med till nästa kort med tangentbord, `storage`-händelsen synkar två öppna kopior, ResizeObserver kopplas bort.
- **Design** (tre granskningsagenter: visuellt, flöde, rörelse och layout):
  - Liggande telefon: menyn som list till vänster, kortet efter höjd (4:3), scenens fack i två kolumner bredvid, utmaningen utan scroll. Tidslinjen behåller minst fyra rader (tre får inte plats med 40 djur).
  - Surfplatta och dator: kortet 3:4 och centrerat, utmaningen centrerad (sjönk förut till botten), favoritrutnätet max 1100 px.
  - Utmaning: syntetiserade ljud (Web Audio, inga filer) för rätt (ett tonsteg högre per stjärna), fel och vinst; vibration på Android; fel knapp skakar; vrålet kommer med färgen; större skur och glöd; "En till" spelar nästa kort på samma nivå. Frågorna läses upp på nivå 3-5 och 6-7 (Piper, `prompt-*.mp3`, 10 klipp) med högtalarknapp. Stapel bredvid "8 / 32".
  - Rörelse: nästa kort glider fram, kastkurvan behåller fingrets fart, vyer tonar över (View Transitions), alla knappar ger efter vid tryck. Scroll nollställs mellan vyer (detaljvyn öppnade förut halvvägs ner).
  - Scenen: verktygen som ikoner på ljus platta, nya djur sprids från mitten i stället för samma punkt.
- **Beslut tagna utan Patrik:** spärren som multiplikation; kortlekens ordning orörd (öppna först); vänsterpilen på hoppa över-knappen behålls (samma håll som svepet).
- **Inte verifierat:** riktig telefon (vibration, `:active` i iOS Safari, View Transitions i Safari), skrivare, ljuden och uppläsningen avlyssnade.

### 2026-10-26: Dagens ägg, kortleksordning, föräldrasammanfattning

- **Dagens ägg** (Patriks idé): ett ägg uppe till vänster på kortleken när det finns en unge att kläcka. Tre tryck knäcker det (spricka, knäckljud, vibration), en unge till ett av de öppna korten kommer ut med ett faktum och flyttar in på kortet: liten bild nere till höger på framsidan och i detaljvyn, faktat under "Ungen" på baksidan. Tryck på ungen piper. Ett ägg per lokalt datum (`state.eggDay`); ägget räknas som använt först vid tredje trycket. Inget ägg om inget öppet kort har en okläckt unge.
- **Tolv ungar:** de åtta startkorten plus Maiasaura, Protoceratops, Parasaurolophus och Oviraptor. Målade av Codex (`img-src/BRIEF-baby.md`, vuxenbilden som referens), konverterade med `convert-art.py baby/<id>` till 480 px. Fakta granskade av en agent mot källor, sju omformulerade (`docs/research/babies.md`). Havsreptilerna får aldrig ägg (födde levande, testat).
- **Kortleken:** bara de tre nästa att vinna ligger i leken, varvade med öppna kort (`deckOrder`). Nästa att vinna = kort med unge först, sedan katalogordning. Utmaningen utan valt kort tar nästa i tur i stället för slump.
- **Föräldraläget:** sammanfattning överst (vunna kort och kläckta ungar med stapel, favoriter, tre senast vunna).
- **Ikon:** Dinodeck har egen ikon (buildapp.se:s hus är sajtens). 1024 px för App Store i `store/icon-1024.png`.
- **Beslut tagna utan Patrik:** ungen kommer bara till kort barnet redan har (ägget delar inte ut vinstkort); vilken unge slumpas bland de möjliga; ägget ligger på kortleken, inte i menyn.
- **Inte verifierat:** riktig telefon (knäckljud, vibration), Protoceratops-ungens krage är nästan vuxen.
- **Visuell putsning** (agent i egen worktree, sammanslagen): faktaruta på kortets baksida och i detaljvyn, "Skriv ut och färglägg" är detaljvyns enda fyllda knapp, appikonen som märke i sidhuvudet, tidslinjens rader centrerade och perioderna som piller, korten bakom det översta lätt vridna, en radieskala (`--r-s` 8 till `--r-pill`), gamla CSS-lagret ihopslaget (712 till ca 650 rader, beräknade stilar jämförda före och efter). Ägget döljs när kortet är vänt (täckte namnet). Inga överflöden eller konsolfel på 390×844, 844×390, 667×375, 820×1180, 1440×900.
- **Ungarnas pip** (Patrik 2026-10-26): `peep()` i `src/sound.ts`, syntetiskt som klangerna. Två till fyra snabba "piip" som stiger och faller, mönstret bestämt av djurets id (samma unge låter alltid likadant), tonhöjden efter den vuxnas vikt (ca 1 700 Hz för Brachiosaurus, ca 3 300 Hz för Velociraptor). Piper när ungen kläcks och när man trycker på den. Inte avlyssnat av människa.
- **Hjärtknappen på kortleken** är ifylld när översta kortet redan är favorit (`fillDeck`, `aria-pressed`). Provat genom tolv kort.
- **Remote med kontonamn:** `origin` är `https://Elwyndaz@github.com/buildapp-se/dinodeck.git`, så push fungerar oavsett vilket gh-konto som är aktivt (fackligastudier-ui används av affisch och projekt).

### 2026-10-26: svenska frågorna med OmniVoice

- Räknefrågan heter nu "Hur många dinosaurier?" (Patrik: man ser knappt vilken art det är).
- Patrik jämförde ElevenLabs (Alice och Jessica), OmniVoice och Piper. Han valde OmniVoice utan referens i tempo 0,75 (`audio-src/omnivoice-ref.wav`). De fem svenska `prompt-*-sv.mp3` är gjorda med `tools/make-voice-sv.py`, med det valda klippet som referens. Alla fem transkriberades tillbaka ordagrant av KB-Whisper, och de har samma tempo som det valda klippet. Ingen har lyssnat på de färdiga klippen.
- Fälla: med `speed=0.75` kom två gånger ett helt tomt klipp. Längd per klipp (`duration`) och omförsök gav rätt alla fem.
- Namnen och engelskan stannar hos Piper. Patrik researchar talsyntes med en annan agent.
- Licens för Boson Higgs Audio 2 (OmniVoices tokenizer) läst i sin helhet: attributionsraderna finns i `public/licenser.txt`, länkade i föräldraläget. Utökad licens krävs först över 100 000 användare per år.
- ElevenLabs-prov kostade cirka 0,008 USD från OpenRouter-saldot.
