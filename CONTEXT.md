# Dinodeck: kontext

Dinosauriekort för barn 3 till 10 år, som också ska hålla som litet uppslagsverk. Syskon till Sipdeck (`C:\dev\sipdeck`): samma kortlek med svep och vändning, annat innehåll.

## Låsta beslut (grillning 2026-10-03)

| Område | Beslut |
|---|---|
| Publik | Byggs som publik: inga konton, ingen persondata, inga annonser. Lanseras tyst. |
| Sparande | Bara `localStorage` (nyckel `dinodeck`). Ingen backend, ingen Cloudflare. |
| Språk | Svenska och engelska från start. Varje text i katalogen är `{ sv, en }`. |
| Ålder | 3 till 10 år. Kort barntext överst, längre text under. Uppläsning av texter är v2. |
| Urval | 40 kända djur (30 från start, 10 tillagda 2026-10-25, underlag i `docs/research/batch-3.md`). Flygödlor och havsreptiler är med, märkta "inte en dinosaurie". |
| Låsning | 8 startkort öppna, 32 vinns i utmaningar. Låsta kort visas som silhuett med "Vinn mig". Föräldraläge kan låsa upp allt. Kortleken visar bara de tre nästa att vinna, varvade med öppna kort (2026-10-26). |
| Dagens ägg | Ett ägg per dag (lokalt datum) kläcker en unge till ett kort barnet redan har; ungen syns på kortet med ett faktum. Ingen streak, missad dag kostar inget. Havsreptiler får inget ägg (födde levande). Kort med unge vinns först. (Patrik 2026-10-26) |
| Bläddring | Som Tinder: höger = favorit, vänster = nästa. Inget kort försvinner, det läggs sist. Tryck på djuret ger vrål, tryck på resten av kortet eller vändknappen vänder. Med ljudet av vänder även tryck på djuret. |
| Scen | Bara öppna eller vunna djur. Tre bakgrunder (trias, jura, krita). Flytta och ändra storlek. Sparas lokalt. |
| Tidslinje | Vågrät remsa trias, jura, krita, djuren där de levde, "idag"-märke. Tryck öppnar kortet. |
| Utmaningar | Tre typer: para silhuett, matte, faktafråga från kortet. Nivåer 3 till 5, 6 till 7, 8 till 10, vald med tre knappar vid varje start. 5 rätt vinner ett kort. Fel ger "försök igen", inget straff. |
| Profiler | En gemensam samling per enhet. Inga profiler. |
| Föräldraläge | Lås upp allt, nollställ, språk, ljud av. Öppnas med 3 sekunders tryck på kugghjulet uppe till höger. Språkbytet finns bara här. |
| Ljud | Två per djur: filmvrål när man trycker på djuret, och "så här tror forskare att den lät" på baksidan. Byggs av fria inspelningar av nutida djur, pitchade efter kroppsvikt. Bara CC0 eller public domain, antecknat per källfil i `audio-src/sources.json`. Parasaurolophus läte är ett syntetiskt horn. **Undantag från 2026-10-27:** filmvrålet ska låta kul, spännande och farligt som i Jurassic Park, och får därför komma från ElevenLabs Sound Effects (utkast via `tools/try-elevenlabs.py`, Patriks val i `audio-src/elevenlabs-roars/<id>.mp3`). Gratisplanen: Dinodeck räknas som icke-kommersiellt (gratis, ingen reklam, inga intäkter) och vrålen krediteras elevenlabs.io i föräldraläget, integritetssidan och `licenser.txt`. Släpps appen kommersiellt måste vrålen göras om på en betalplan, gamla gratisljud kan inte uppgraderas. Lager av flera djur i ett vrål är tillåtna när de smälter ihop till ett djur. Lätet på baksidan förblir CC0. |
| Uttal | Färdiga ljudklipp, 40 namn × 2 språk. Ingen tjänst och inget konto: Piper körs lokalt med rösterna `sv_SE-nst` (CC0) och `en_GB-cori` (public domain). Klippen får publiceras utan källhänvisning. Uttalet skrivs som fonetisk skrift i `tools/make-names.py`, inte som text. Samma verktyg gör de fem upplästa utmaningsfrågorna på engelska (`prompt-*-en.mp3`). De svenska frågorna läser OmniVoice, också lokalt (`tools/make-voice-sv.py`, i WSL). Patrik valde rösten på gehör 2026-10-26, eftersom Pipers svenska lät dålig. OmniVoice tar ingen fonetisk skrift, så namnen stannar hos Piper. Dess tokenizer kräver en attributionsrad, som finns i `public/licenser.txt` och länkas från föräldraläget. Rätt-, fel- och vinstljuden syntetiseras i `src/sound.ts` (`chime`), inga filer. |
| Fakta | Varje kort har källa i datat. Osäkert (färg, läte, fjädrar) skrivs som "forskare tror". Patrik stickprovar. |
| Bilder | En frilagd bild per djur. Används på kort, i scen och som silhuett (silhuetten görs i CSS). |
| Bildstil | Patrik valde `03-gouache-picturebook` ur stilrunda 1 (2026-10-03): detaljerad, naturtrogen bilderboksmålning. Referensbilder för teckningen är T. rex och Velociraptor. **Färg (Patrik 2026-10-03): variation mellan djuren är huvudregeln**, historiskt rätt är bra men inte nödvändigt. Den första uppsättningen blev orange och ockra rakt igenom och färgades om: varje djur har en egen palett (brunt, grått, blågrått, grönt, svart, vitt, med färg på kammar, kragar och plattor), som utgår från `docs/research/dinosaur-colour.md` avsnitt 6. Teckningen ändras inte vid omfärgning, så silhuetterna ligger fast. En alternativ "söt" stil som går att välja i appen ligger i backloggen, mycket senare. |
| Stack | Vite + TypeScript `strict`, inget ramverk. Tester med `node --test`. |
| Host | GitHub Pages, `buildapp.se/dinodeck/`, repo `buildapp-se/dinodeck`. Bara den hosten. |
| Storlek | Detaljvyn visar djuret som silhuett bredvid ett barn på 1,2 m, i samma skala. Djuret skalas efter höjd (`heightM`), inte längd: bilderna är målade snett framifrån. |
| Offline | Ja, service worker som sparar app, data, bilder och ljud. Själva sidan hämtas från nätet först, så en ny version syns vid nästa laddning. Inget tillägg, egen `src/sw.js`. |

## Ordlista

- **Startkort:** de 8 djur som är öppna från början (`starter: true` i `src/dinos.ts`).
- **Vunnet kort:** ett av de 32 övriga, upplåst genom en utmaning.
- **Frilagd bild:** djuret utan bakgrund (genomskinlig), `public/img/<id>.webp`.
- **Stilrunda:** samma två djur (T. rex, Velociraptor) ritade i flera stilar för jämförelse. Ligger i `img-src/style-round/`, som inte checkas in.

## Från Sipdeck, värt att minnas

- Subpath-host kräver relativa sökvägar överallt (`base: './'` i `vite.config.ts`).
- Svep: klassen för vändning sätts på det levande elementet, och ett kort som flyger iväg får aldrig ritas om.
- `touch-action: pan-y` ska sitta på själva scrollbehållaren.
- `img-src/` är gitignorerad: källbilderna finns bara på den här datorn.

## Audits
- OWASP Top 10: 2026-10-26, pass, code review only (Gemini 3.8 Flash, verified by Claude), static PWA with no server; 0 high, 0 medium; the lane's missing-CSP low is refuted live (zone sets frame-ancestors 'none' and X-Frame-Options), root-relative manifest and font URLs on the shared buildapp.se origin left as low
- Mutation: 2026-10-27, warn, Stryker 10 on 5 src files: challenge 86,29 % (64,47), print 97,50 % (27,50), state 89,57 % (66,87), text 11,30 % (3,77), timeline 100,00 % (75,76); tests by Gemini 3.8 Flash, reviewed by Claude
- npm audit (automated): 2026-10-06, pass, 1 targets; 0 failed, 0 blocked; evidence C:/dev/aifabriken/.runs/audits/2026-10-06-batch-b/dinodeck.json
- Secrets (automated): 2026-10-06, pass, 2 targets; 0 failed, 0 blocked; evidence C:/dev/aifabriken/.runs/audits/2026-10-06-batch-b/dinodeck.json
- Database: 2026-10-25, none, localStorage
- Actions: 2026-10-26, pass, zizmor 0 high, 0 medium, 0 low

