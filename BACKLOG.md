# Dinodeck: backlog

Uppifrån och ned. Beslut och ordlista står i `CONTEXT.md`, läget i `HANDOFF.md`.

## P0

1. ✅ **Bildstil vald** (2026-10-03): gouache-bilderbok, se `CONTEXT.md`.
2. ✅ **Bilder till alla 30 djur** (2026-10-03). Nya djur följer pipelinen i `HANDOFF.md` och granskas mot en anatominot i `img-src/BRIEF-art.md` innan de konverteras.

## P1

3. ✅ **Utmaningar och låsta kort** (2026-10-03).
4. ✅ **Tidslinje** (2026-10-03).
5. ✅ **Scen** (2026-10-03). Kvar: de tre målade bakgrunderna, test på riktig pekskärm.
6. ✅ **Ljud** (2026-10-03), två per djur. **Patrik lyssnar igenom alla 60**: de är byggda och uppmätta men inte avlyssnade. Kvar: **uttal** av namnen, 30 × 2 språk.
7. ✅ **Offline** (service worker), manifest med ikoner och favicon (2026-10-03).
8. ✅ **Föräldraläge** (2026-10-03).

## P2

- Portera Sipdecks `promoteDeck` om nästa kort syns hoppa på riktig telefon (markerat `ponytail:` i `src/main.ts`).
- Palett och typsnitt sätts efter vald bildstil (`src/style.css` är provisorisk).
- Källa för Pteranodon är Wikipedia: byt till museum när en hittas som går att kontrollera.
- Uppläsning av kortens texter (v2).
- Fria inspelningar av struts och kasuar saknas (stod i beslutet om ljud). Hittas några med CC0 eller public domain: lägg dem i `audio-src/sources.json` och byt ut duva och järpe i recepten.

## P3

- **Skriv ut för att färglägga** (Patrik 2026-10-03, "i framtiden"). Två delar: (1) den egna scenen som målarbild, med bakgrund och utställda djur som konturer, (2) enskilda dinosaurier som målarbild. Kräver konturversioner (svartvit linjeteckning) av djur och bakgrunder: nya bilder från Codex, eller prova först om de går att ta fram ur de färdiga bilderna. Utskrift via webbläsarens egen utskriftsfunktion och en utskriftsstilmall.
- **Alternativa bildstilar som går att välja i appen**, till exempel söta dinosaurier. Patrik 2026-10-03: "mycket senare". Stilrunda 2 (`img-src/style-round/sheet2.png`) har sju kandidater. Kräver en bilduppsättning per stil och ett val i inställningarna.
