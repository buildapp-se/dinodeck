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
DRAFTS, SECONDS = 3, 3.0
TAIL = ", single creature, close up, cinematic movie monster sound design, no music, no speech"
PROMPTS = {
    "tyrannosaurus-rex": "Tyrannosaurus rex roar, huge and terrifying, deep throaty bellow with a rattling growl",
    "triceratops": "Triceratops bellow, large horned dinosaur, deep snorting grunt into a powerful bull-like roar",
    "stegosaurus": "Stegosaurus call, big plated dinosaur, low rumbling moan with a huffing snort",
    "brachiosaurus": "Brachiosaurus call, enormous long-necked dinosaur, majestic deep trumpeting hoot that echoes",
    "velociraptor": "Velociraptor screech, small fierce predator dinosaur, sharp hissing shriek with clicking barks, scary",
    "diplodocus": "Diplodocus call, giant long-necked dinosaur, deep resonant foghorn-like bellow",
    "ankylosaurus": "Ankylosaurus growl, heavy armoured dinosaur, gravelly low grunting roar with a snort",
    "pteranodon": "Pteranodon screech, giant flying reptile, piercing raspy cry like a huge eagle",
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
    for id_, text in PROMPTS.items():
        for n in range(1, DRAFTS + 1):
            path = OUT / f"{id_}-{n}.mp3"
            if path.exists():
                continue  # rerun only fills the gaps, never pays twice
            data = generate(text)
            if len(data) < 5000:
                print(f"FAIL {path.name}: {len(data)} bytes")
                return 1
            path.write_bytes(data)
            print(f"ok {path.name}")
    rows = "".join(
        f"<h2>{id_}</h2>" + "".join(f'<p>{n} <audio controls src="{id_}-{n}.mp3"></audio></p>' for n in range(1, DRAFTS + 1))
        for id_ in PROMPTS
    )
    (OUT / "listen.html").write_text(f"<!doctype html><meta charset=utf-8><title>Vrål</title><body style='font-family:sans-serif'>{rows}", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
