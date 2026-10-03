# Dinodeck: backlog

Uppifrån och ned. Beslut och ordlista står i `CONTEXT.md`, läget i `HANDOFF.md`.

## P0

1. ✅ **Bildstil vald** (2026-10-03): gouache-bilderbok, se `CONTEXT.md`.
2. **Bilder till alla 30 djur.** Pipeline i `HANDOFF.md`. Varje bild granskas mot anatominoten i `img-src/BRIEF-art.md` innan den konverteras.

## P1

3. ✅ **Utmaningar och låsta kort** (2026-10-03). Kvar: verifiera silhuettfrågorna i webbläsare när bilder finns.
4. **Tidslinje.**
5. **Scen** med tre bakgrunder.
6. **Ljud och uttal.** Tryck på djuret ger vrål, så vändning flyttas då till resten av kortet och knappen. Villkoren för röstsyntes-tjänstens gratisnivå läses innan konto skaffas.
7. **Offline** (service worker) och manifest med ikoner.
8. **Föräldraläge.**

## P2

- Portera Sipdecks `promoteDeck` om nästa kort syns hoppa på riktig telefon (markerat `ponytail:` i `src/main.ts`).
- Palett och typsnitt sätts efter vald bildstil (`src/style.css` är provisorisk).
- Favicon saknas (404 i konsolen).
- Källa för Pteranodon är Wikipedia: byt till museum när en hittas som går att kontrollera.
- Uppläsning av kortens texter (v2).

## P3

- **Alternativa bildstilar som går att välja i appen**, till exempel söta dinosaurier. Patrik 2026-10-03: "mycket senare". Stilrunda 2 (`img-src/style-round/sheet2.png`) har sju kandidater. Kräver en bilduppsättning per stil och ett val i inställningarna.
