"""Make flagged read-aloud clips again, and keep whichever take the listening check flags less.

    uv run tools/check-read.py > audio-src/read/check.log    (the flags to act on)
    uv run tools/retake-read.py audio-src/read/check.log

For each flagged clip the old take is moved to audio-src/read/old/, make-read-sv.py speaks and times a new one
(in WSL), check-read.py listens to it, and the take with fewer flagged words stays. In "Did you know?" only the
point holding the flagged word is made again. Ends with the encode step and check-read.py on everything.
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, OLD, MP3 = ROOT / "audio-src" / "read", ROOT / "audio-src" / "read" / "old", ROOT / "public" / "audio" / "read"
TIMES = ROOT / "src" / "read-sv.json"
WSL = ["wsl.exe", "-d", "Ubuntu-24.04", "--", "bash", "-c",
       "cd ~/voice && HF_HOME=~/voice/hf ~/voice/OmniVoice/.venv/bin/python /mnt/c/dev/dinodeck/tools/make-read-sv.py"]


def flags(log: str) -> dict[str, list[str]]:
    """{clip stem: flagged words} from check-read.py's output; unchecked clips are left out."""
    out = {}
    for stem, rest in re.findall(r"^     (\S+): (.+)$", log, re.M):
        words = [w.split(" -> ")[0] for w in rest.split("; ") if not w.startswith("?")]
        if words:
            out[stem] = words
    return out


def run_make() -> None:
    subprocess.run(WSL, check=False)  # exits non-zero on suspect clips; the listening check below decides


def encode(stem: str) -> None:
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(SRC / f"{stem}.wav"), "-ac", "1", "-b:a", "48k", str(MP3 / f"{stem}.mp3")], check=True)


def main() -> int:
    flagged = flags(Path(sys.argv[1]).read_text(encoding="utf-8"))
    times = json.loads(TIMES.read_text(encoding="utf-8"))
    # A "facts" flag points at the fact-<n> that holds the word.
    parts: dict[str, str] = {}  # wav stem made again -> the clip stem the check listens to
    for stem, words in flagged.items():
        id_, key = re.match(r"(.+)-(short|long|baby|colour|facts)$", stem).groups()  # type: ignore[union-attr]
        if key != "facts":
            parts[stem] = stem
            continue
        for k, v in times[id_].items():
            if k.startswith("fact-") and any(w.lower().strip(".,!?") in v["text"].lower() for w in words):
                parts[f"{id_}-{k}"] = stem
    OLD.mkdir(exist_ok=True)
    for part in parts:
        shutil.move(SRC / f"{part}.wav", OLD / f"{part}.wav")
    old_times = json.loads(TIMES.read_text(encoding="utf-8"))
    run_make()  # speaks every missing wav, times it, rebuilds the facts clips
    for stem in set(parts.values()):
        encode(stem)
    out = subprocess.run(["uv", "run", str(ROOT / "tools" / "check-read.py"), *[str(MP3 / f"{s}.mp3") for s in set(parts.values())]],
                         capture_output=True, text=True, encoding="utf-8").stdout
    again = flags(out)
    worse = [s for s in set(parts.values()) if len(again.get(s, [])) > len(flagged[s])]
    # Worse takes go back: the old sound and its old times, and the facts clip is joined again.
    for part, stem in parts.items():
        if stem in worse:
            shutil.move(OLD / f"{part}.wav", SRC / f"{part}.wav")
    if worse:
        new_times = json.loads(TIMES.read_text(encoding="utf-8"))
        for part, stem in parts.items():
            if stem in worse:
                id_ = stem.rsplit("-", 1)[0]
                key = part[len(id_) + 1:]
                new_times[id_][key] = old_times[id_][key]
        TIMES.write_text(json.dumps(new_times, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        run_make()  # nothing to speak: rebuilds the facts clips from the restored points
        for stem in worse:
            encode(stem)
    kept = len(set(parts.values())) - len(worse)
    print(f"ok   {len(set(parts.values()))} clips made again, {kept} new takes kept, {len(worse)} old takes back")
    print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
