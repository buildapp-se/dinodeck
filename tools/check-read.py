"""Let a model that hears audio listen for words the read-aloud voice says wrong, so nobody has to hear all clips.

    uv run tools/check-read.py [model] [clip.mp3 ...]

Sends each clip in public/audio/read/ with its text from src/read-sv.json to OpenRouter (needs OPENROUTER_API_KEY)
and prints one line per clip it flags, then a verdict. Changes no files: a flagged word gets a spelling for the ear in
SAY in tools/make-read-sv.py and is made again. Whisper in make-read-sv.py catches wrong words but not wrong stress:
"banan" (the fruit) and "banan" (the track) are the same text.
"""
import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLIPS = ROOT / "public" / "audio" / "read"
VOTES = 3
BRIEF = """You are checking a Swedish text-to-speech clip for a children's app about dinosaurs.
The voice should say exactly this Swedish text: "{text}"
Listen and list every word that is mispronounced: wrong stress (so it sounds like another word), wrong vowel, a word swallowed, slurred or not Swedish, an extra or missing word.
Ignore the voice's character, speed and small accent. Dinosaur names may be said the Latin way.
Answer with JSON only: {{"problems": [{{"word": "<word as written>", "heard": "<what it sounded like>"}}]}}, empty list if all is right."""


def check(model: str, clip: Path, text: str, brief: str = BRIEF, field: str = "problems"):
    content = [
        {"type": "text", "text": brief.format(text=text)},
        {"type": "input_audio", "input_audio": {"data": base64.b64encode(clip.read_bytes()).decode(), "format": clip.suffix[1:]}},
    ]
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps({"model": model, "messages": [{"role": "user", "content": content}], "temperature": 0}).encode(),
        headers={"Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}", "Content-Type": "application/json"},
    )
    for attempt in range(6):  # an empty or malformed answer happens now and then, and so does 429 with 8 at once
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                answer = json.load(r)["choices"][0]["message"]["content"] or ""
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(5 * (attempt + 1))
            continue
        found = re.search(r"\{.*\}", answer, re.S)
        if found:
            return json.loads(found.group(0))[field]
    raise ValueError(f"{clip.name}: no usable answer in six tries")


NAME_BRIEF = """You are checking a Swedish text-to-speech clip for a children's app about dinosaurs.
The voice should say the dinosaur name {text}. CAPITALS mark the stressed syllable; the letters sound as in Swedish.
Is the name said that way: these syllables, stress on the capital one, nothing missing or added?
Answer with JSON only: {{"right": true or false}}"""


def names(model: str) -> int:
    """--names: for each animal, the OmniVoice draft (tools/make-names-sv-omni.py) that says the name as the card's
    hint does in all three listens, or none, and then Piper's clip stays."""
    drafts = ROOT / "audio-src" / "names-omni"
    rows = json.loads((drafts / "names.json").read_text(encoding="utf-8"))
    jobs = [(id_, n, f'"{name}", pronounced "{hint}"') for id_, name, hint in rows for n in (1, 2)]
    with ThreadPoolExecutor(8) as pool:
        got = list(pool.map(lambda j: sum(bool(check(model, drafts / f"{j[0]}-{j[1]}.wav", j[2], NAME_BRIEF, "right")) for _ in range(VOTES)), jobs))
    picks = {}
    for (id_, n, _), v in zip(jobs, got):
        if v == VOTES and id_ not in picks:
            picks[id_] = n
    print(" ".join(f"{i}={n}" for i, n in picks.items()))
    print(f"ok   {len(picks)} of {len(rows)} names pass")
    return 0


def main() -> int:
    args = sys.argv[1:]
    if args and args[0] == "--names":
        return names(args[1] if len(args) > 1 else "google/gemini-4-argon")
    model = args.pop(0) if args and "/" in args[0] and not args[0].endswith(".mp3") else "google/gemini-4-argon"
    times = json.loads((ROOT / "src" / "read-sv.json").read_text(encoding="utf-8"))
    clips = [Path(a) for a in args] or sorted(CLIPS.glob("*.mp3"))

    def text(clip: Path) -> str:
        # <id>-<key>.mp3, where the key is short, long, baby, colour or facts
        id_, key = re.match(r"(.+)-(short|long|baby|colour|facts)$", clip.stem).groups()  # type: ignore[union-attr]
        return times[id_][key]["text"]

    def votes(clip: Path) -> tuple[Path, list[dict]]:
        # One answer alone is noise: three runs on the same T. rex clips flagged three different sets of words
        # (2026-10-27). A word counts when two of three listens name it.
        runs = [check(model, clip, text(clip)) for _ in range(VOTES)]
        named = [{p["word"].lower().strip(".,!?") for p in run} for run in runs]
        return clip, [p for p in {p["word"].lower().strip(".,!?"): p for run in runs for p in run}.values()
                      if sum(p["word"].lower().strip(".,!?") in n for n in named) >= 2]

    with ThreadPoolExecutor(8) as pool:
        results = list(pool.map(votes, clips))
    flagged = [(c, p) for c, p in results if p]
    for c, p in flagged:
        print(f"     {c.stem}: " + "; ".join(f"{x['word']} -> {x['heard']}" for x in p))
    print(f"{'FAIL' if flagged else 'ok  '} {len(clips)} clips, {len(flagged)} flagged")
    return 1 if flagged else 0


if __name__ == "__main__":
    sys.exit(main())
