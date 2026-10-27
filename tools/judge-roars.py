"""Let a model that hears audio pick the best ElevenLabs draft per animal, when nobody has time to listen.

    uv run tools/judge-roars.py [model] [id ...]

Sends every draft of an animal in one request to OpenRouter (needs OPENROUTER_API_KEY) and prints
"<id>=<n> <reason>" per animal. Without ids it judges every animal with drafts but no pick in
audio-src/elevenlabs-roars/. Changes no files: copying the winner is a separate, deliberate step.
"""
import base64
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOTES = 3
DRAFTS, PICKED =ROOT / "audio-src" / "elevenlabs", ROOT / "audio-src" / "elevenlabs-roars"
BRIEF = """You are choosing the film roar for a dinosaur card game for children aged 4 to 8.
When a child taps the animal on the card, the sound plays. It should sound fun, exciting and a bit dangerous,
like a dinosaur in a blockbuster film. The animal is: {name}.
You get {n} audio drafts, numbered 1 to {n} in order. Judge each on:
- one single creature (not two animals, not a crowd, no sound that changes into a different animal halfway)
- exciting and cinematic, fits this animal's size and kind
- clean: no music, no speech, no glitches, no long silence, no harsh distortion
Answer with JSON only: {{"best": <number>, "reason": "<one short sentence>"}}"""


# Drafts Patrik has already turned down are never offered again.
REJECTED = {"brachiosaurus": range(1, 7)}


def drafts(id_: str) -> list[Path]:
    found = sorted(DRAFTS.glob(f"{id_}-*.mp3"), key=lambda p: int(p.stem.rsplit("-", 1)[1]))
    return [p for p in found if int(p.stem.rsplit("-", 1)[1]) not in REJECTED.get(id_, ())]


def judge(model: str, id_: str) -> tuple[int, str]:
    files = drafts(id_)
    content: list[dict] = [{"type": "text", "text": BRIEF.format(name=id_.replace("-", " "), n=len(files))}]
    for i, p in enumerate(files, 1):
        content.append({"type": "text", "text": f"Draft {i}:"})
        content.append({"type": "input_audio", "input_audio": {"data": base64.b64encode(p.read_bytes()).decode(), "format": "mp3"}})
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps({"model": model, "messages": [{"role": "user", "content": content}], "temperature": 0}).encode(),
        headers={"Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        text = json.load(r)["choices"][0]["message"]["content"]
    found = re.search(r"\{.*\}", text or "", re.S)
    if not found:
        raise ValueError(f"{id_}: no JSON in the answer: {text!r:.300}")
    answer = json.loads(found.group(0))
    best = int(answer["best"])
    if not 1 <= best <= len(files):
        raise ValueError(f"{id_}: draft {best} does not exist ({len(files)} drafts)")
    # Draft numbers on disk can start above 1 (a second round), so map the position back to the file.
    return int(files[best - 1].stem.rsplit("-", 1)[1]), answer["reason"]


def main() -> int:
    args = sys.argv[1:]
    model = args.pop(0) if args and "/" in args[0] else "google/gemini-4-argon"
    ids = args or sorted({p.stem.rsplit("-", 1)[0] for p in DRAFTS.glob("*.mp3")} - {p.stem for p in PICKED.glob("*.mp3")})
    failed = False
    for id_ in ids:
        # Three votes, majority wins: one answer alone swings between drafts. An empty answer (it happens) is skipped.
        votes: list[tuple[int, str]] = []
        for _ in range(VOTES + 3):
            if len(votes) == VOTES:
                break
            try:
                votes.append(judge(model, id_))
            except (ValueError, KeyError, TypeError):
                continue  # empty or malformed answer
        if not votes:
            print(f"FAIL {id_}: no usable answer", flush=True)
            failed = True
            continue
        nums = [n for n, _ in votes]
        best = max(set(nums), key=nums.count)
        print(f"{id_}={best} ({nums.count(best)}/{len(nums)}) {next(r for n, r in votes if n == best)}", flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
