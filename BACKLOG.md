# Dinodeck: backlog

Uppifrån och ned. Beslut och ordlista står i `CONTEXT.md`, läget i `HANDOFF.md`.

## P0

1. **Välj bildstil.** Patrik väljer ur stilrunda 2 (`img-src/style-round/`). Därefter fryses tre referensbilder och promptmallen skrivs in i `HANDOFF.md`.
2. **Bilder till de 8 startkorten.** Generera i vald stil, frilägg, konvertera till `public/img/<id>.webp`. Avgör i samma steg om Codex ger genomskinlig bakgrund direkt eller om den tas bort i efterhand.

## P1

3. **Utmaningar och låsta kort.** Tre typer, tre åldersnivåer, 5 rätt vinner ett kort. Katalogen utökas till 30 djur (lista i `HANDOFF.md`). `won` läggs till i state.
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
