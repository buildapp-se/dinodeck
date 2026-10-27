"""Test: film roars for the starter cards from ElevenLabs Sound Effects, to listen to before deciding.

    uv run tools/try-elevenlabs.py

Needs ELEVENLABS_API_KEY. Writes audio-src/elevenlabs/<id>-<n>.mp3 and listen.html beside them.
Costs 11 credits per second: 8 animals x 3 drafts x 3 s = 792 credits.
"""
import json
import os
import sys
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "audio-src" / "elevenlabs"
PICKED = OUT.parent / "elevenlabs-roars"  # chosen already: left off the listening page
DRAFTS, SECONDS = 3, 3.0
TAIL = ", single creature, close up, cinematic movie monster sound design, no music, no speech"
PROMPTS = {
    "tyrannosaurus-rex": "Tyrannosaurus rex roar, huge and terrifying, deep throaty bellow with a rattling growl",
    "triceratops": "Triceratops bellow, large horned dinosaur, deep snorting grunt into a powerful bull-like roar",
    "stegosaurus": "Stegosaurus call, big plated dinosaur, low rumbling moan with a huffing snort",
    # Second round 2026-10-27, none of the first three was good: bigger and more dramatic.
    "brachiosaurus": "Brachiosaurus bellow, colossal long-necked giant dinosaur, awe-inspiring deep majestic trumpeting roar that swells and echoes across a valley",
    "velociraptor": "Velociraptor attack call, menacing pack-hunting dinosaur, aggressive high screeching bark with a rattling hiss and snarl, terrifying",
    "diplodocus": "Diplodocus call, giant long-necked dinosaur, deep resonant foghorn-like bellow",
    "ankylosaurus": "Ankylosaurus growl, heavy armoured dinosaur, gravelly low grunting roar with a snort",
    "pteranodon": "Pteranodon screech, giant flying reptile, piercing raspy cry like a huge eagle",
    # The next eight to win (toWin() in src/main.ts), 2026-10-27.
    "oviraptor": "Oviraptor call, feathered dinosaur the size of a turkey, sharp honking squawk with a throaty hiss, alarmed and fierce",
    "parasaurolophus": "Parasaurolophus call, duck-billed dinosaur with a long hollow crest, deep resonant trombone-like horn blast that echoes",
    "maiasaura": "Maiasaura bellow, big duck-billed mother dinosaur guarding her nest, loud warning honk into a deep protective roar",
    "protoceratops": "Protoceratops call, small sturdy frilled dinosaur, angry snorting grunt into a short squealing bellow",
    "spinosaurus": "Spinosaurus roar, gigantic sail-backed river predator dinosaur, wet gurgling growl into a monstrous crocodile-like roar",
    "allosaurus": "Allosaurus roar, large fierce predator dinosaur, savage snarling roar with a raspy rattle",
    "giganotosaurus": "Giganotosaurus roar, colossal predator dinosaur bigger than T. rex, earth-shaking deep thunderous roar",
    "carnotaurus": "Carnotaurus roar, horned fast predator dinosaur, harsh barking roar with a vicious bull-like snort",
}


def generate(text: str) -> bytes:
    body = json.dumps({"text": text + TAIL, "duration_seconds": SECONDS, "prompt_influence": 0.5}).encode()
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",
        data=body,
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    more = sys.argv[1:]  # ids that get DRAFTS new drafts after the ones they have: `uv run tools/try-elevenlabs.py velociraptor`
    for id_, text in PROMPTS.items():
        have = len(list(OUT.glob(f"{id_}-*.mp3")))
        for n in range(have + 1 if id_ in more else 1, (have if id_ in more else 0) + DRAFTS + 1):
            path = OUT / f"{id_}-{n}.mp3"
            if path.exists():
                continue  # rerun only fills the gaps, never pays twice
            data = generate(text)
            if len(data) < 5000:
                print(f"FAIL {path.name}: {len(data)} bytes")
                return 1
            path.write_bytes(data)
            print(f"ok {path.name}")
    # One choice per animal, "none" asks for new drafts; the summary at the bottom is pasted back to Claude.
    def row(id_: str) -> str:
        drafts = sorted(OUT.glob(f"{id_}-*.mp3"), key=lambda p: int(p.stem.rsplit("-", 1)[1]))
        opts = "".join(
            f'<label><input type=radio name="{id_}" value="{p.stem.rsplit("-", 1)[1]}"> {p.stem.rsplit("-", 1)[1]} <audio controls src="{p.name}"></audio></label><br>'
            for p in drafts
        )
        return f'<h2>{id_}</h2>{opts}<label><input type=radio name="{id_}" value="nya"> inget bra, gör nya</label>'
    script = """<script>
const out = document.querySelector('textarea');
document.addEventListener('change', () => { out.value = [...new Set([...document.querySelectorAll('input')].map(i => i.name))]
  .map(n => n + '=' + (document.querySelector(`input[name="${n}"]:checked`)?.value ?? '?')).join('\\n'); });
</script>"""
    (OUT / "listen.html").write_text(
        f"<!doctype html><meta charset=utf-8><title>Vrål</title><body style='font-family:sans-serif;max-width:40em;margin:auto'>"
        f"{''.join(row(i) for i in PROMPTS if not (PICKED / f'{i}.mp3').exists())}<h2>Klistra in till Claude</h2><textarea rows=10 cols=40 readonly></textarea>{script}",
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
