"""Ask a model that hears audio whether each cute roar sounds like a small dinosaur or like a human baby.

    uv run tools/review-cute-roars.py [file.mp3 ...]

Patrik 2026-10-28: several of the first cute drafts sounded like crying babies. Without files it reviews
every draft in audio-src/elevenlabs-cute/ and the picks in elevenlabs-cute-roars/. Needs OPENROUTER_API_KEY.
Prints "<file> <verdict> (<votes>) <reason>" per file and exits non-zero if any pick is not "dinosaur".
"""
import base64
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "audio-src"
MODEL, VOTES = "google/gemini-4-argon", 3
BRIEF = """This sound is for a children's app: a cute cartoon dinosaur makes it when tapped.
Listen and classify it as exactly one of:
- "dinosaur": a small creature or animal sound (chirp, squeak, little growl, honk, hoot). Cute is good.
- "human_baby": it sounds like a human infant or toddler (crying, babbling, giggling like a person, human voice).
- "other": anything else (music, speech, noise, glitch, two different animals).
Answer with JSON only: {"verdict": "<dinosaur|human_baby|other>", "reason": "<one short sentence>"}"""


def ask(path: Path) -> tuple[str, str]:
    content = [
        {"type": "text", "text": BRIEF},
        {"type": "input_audio", "input_audio": {"data": base64.b64encode(path.read_bytes()).decode(), "format": "mp3"}},
    ]
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps({"model": MODEL, "messages": [{"role": "user", "content": content}], "temperature": 0}).encode(),
        headers={"Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        text = json.load(r)["choices"][0]["message"]["content"] or ""
    found = re.search(r"\{.*\}", text, re.S)
    if not found:
        raise ValueError(f"no JSON: {text!r:.200}")
    a = json.loads(found.group(0))
    if a["verdict"] not in ("dinosaur", "human_baby", "other"):
        raise ValueError(f"bad verdict {a['verdict']!r}")
    return a["verdict"], a["reason"]


def main() -> int:
    files = [Path(f) for f in sys.argv[1:]] or sorted((ROOT / "elevenlabs-cute").glob("*.mp3")) + sorted((ROOT / "elevenlabs-cute-roars").glob("*.mp3"))
    bad_pick = False
    for f in files:
        votes: list[tuple[str, str]] = []
        for _ in range(VOTES + 3):  # an empty answer happens; retry a few times
            if len(votes) == VOTES:
                break
            try:
                votes.append(ask(f))
            except (ValueError, KeyError, TypeError):
                continue
        if not votes:
            print(f"FAIL {f.parent.name}/{f.name}: no usable answer", flush=True)
            bad_pick = True
            continue
        names = [v for v, _ in votes]
        best = max(set(names), key=names.count)
        print(f"{f.parent.name}/{f.name} {best} ({names.count(best)}/{len(names)}) {next(r for v, r in votes if v == best)}", flush=True)
        if f.parent.name == "elevenlabs-cute-roars" and best != "dinosaur":
            bad_pick = True
    return 1 if bad_pick else 0


if __name__ == "__main__":
    sys.exit(main())
