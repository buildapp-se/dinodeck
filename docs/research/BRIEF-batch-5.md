# Research brief: batch 5, ten more animals per job

Write the file named in your prompt. Touch no other file. `docs/research/batch-4.md` is the newest finished batch: read it too, its ten animals are already in the deck (50 in all), and do not pick anything it lists under "Considered and left out" unless the reason no longer holds. Do not write app code, do not init git.

## Read first

- `docs/research/batch-3.md`: the format, the checking method and the depth to match exactly.
- `src/dinos.ts` (the `Dino` type, `Group`, `Diet`, `Period`, the `NHM` helper) and `src/dinos-won.ts` (the `WIKI` helper, the 32 animals already in).
- `docs/research/dinosaur-colour.md` sections 2 and 6 (colour tags), `img-src/BRIEF-art.md` (art brief line format).
- `docs/research/babies.md`: if the format there applies per animal, add a baby entry per new animal in the same format.

## Job

Pick 10 animals not already in the deck, ONLY from the periods named in your prompt (another job covers the other periods at the same time). Children 3 to 10 must find them exciting, and each must look clearly different from the 40 already in, as a silhouette. Keep a spread over diets and groups. Favour famous ones kids know, then ones with a striking feature (a crest, spikes, a sail, a weird head). Pterosaurs and marine reptiles are allowed, marked "not a dinosaur" like the existing ones. List what you considered and left out, with the reason, as batch 3 does.

For each animal: a ready-to-paste `Dino` object (Swedish and English, children's language, same tone and lengths as batch 3), one art brief line, one colour tag, and the sources.

## Rules

- Use web search. Every number must come from a page you actually read: the NHM Dino Directory page (check its `<title>` names the animal, a missing page returns 200 with the title "undefined") or the full Wikipedia article. Say where NHM and Wikipedia disagree and which one the card follows.
- Uncertain things (colour, sound, feathers) are written as "scientists think" / "forskare tror".
- Swedish: decimal comma, space as thousands separator, never an em-dash.
- No invented facts. If you cannot confirm a fact, leave it out.

Final message: one line per animal (name, period, diet), and anything you could not verify.

## Height

Fill `heightM` as batch 3 and batch 4 do: your own estimate from the stated measurements and proportions, labelled as an estimate with a one-line explanation. A single known date is allowed: then `fromMya` equals `toMya`.
