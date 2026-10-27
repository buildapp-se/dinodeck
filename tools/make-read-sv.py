"""Read the card texts aloud in Swedish with OmniVoice, with the time of every word, so the card can light
each word up while it is spoken (for children who are just starting to read).

Three steps, the middle one in WSL like tools/make-voice-sv.py (same voice, same reference, same pace):

    node --input-type=module -e "import {DINOS} from './src/catalog.ts'; import {writeFileSync} from 'node:fs'; writeFileSync('audio-src/read/texts.json', JSON.stringify(DINOS.flatMap((d) => [{id: d.id, key: 'short', text: d.short.sv}, ...d.facts.map((f, i) => ({id: d.id, key: 'fact-' + (i + 1), text: f.sv}))]), null, 1))"
    MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu-24.04 -- bash -c 'cd ~/voice && HF_HOME=~/voice/hf ~/voice/OmniVoice/.venv/bin/python /mnt/c/dev/dinodeck/tools/make-read-sv.py [id ...]'
    for f in audio-src/read/*.wav; do ffmpeg -loglevel error -y -i "$f" -ac 1 -b:a 48k "public/audio/read/$(basename "${f%.wav}").mp3" || break; done

  -> audio-src/read/<id>-<key>.wav, public/audio/read/<id>-<key>.mp3 and src/read-sv.json: {id: {key: {text, words: [[start, end], ...]}}},
     one [start, end] in seconds per word of `text` split on spaces.

A clip whose text is unchanged is not made again. Every clip is transcribed back with KB-Whisper to catch a
clip that says something else; the word times come from the sound itself (word_times). Prints one line per
check and exits non-zero if a clip is suspect.
"""
import difflib
import gc
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
import torch

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "audio-src" / "read"
TIMES = ROOT / "src" / "read-sv.json"  # imported by the app (src/main.ts)

_spec = importlib.util.spec_from_file_location("voice", Path(__file__).with_name("make-voice-sv.py"))
voice = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(voice)  # REF, REF_TEXT, PACE, trim() and plain() are shared with the questions


# Words the voice says wrong, spelled for the ear: the card still shows the real word. Same number of words,
# so the times still fit. "banan" came out as the race track, not the fruit (Patrik, 2026-10-27).
SAY = {"banan": "banaan"}


def spoken(text: str) -> str:
    def say(w: str) -> str:
        core = w.rstrip(".,!?")
        new = SAY.get(core.lower())
        return w if not new else (new.capitalize() if core[0].isupper() else new) + w[len(core):]
    return " ".join(say(w) for w in text.split())


def word_times(text: str, y: np.ndarray, sr: int) -> list[list[float]]:
    """A [start, end] for every space-separated word of `text`. The voice speaks at a set pace per letter
    (duration = PACE * length), so the words are laid out over the time it actually speaks, by letters,
    skipping its pauses. Whisper's own word times crash the transformers in the WSL install (CUDA out of
    memory with 7 GB free, 2026-10-27).
    ponytail: a word can land 0,1-0,2 s off; forced alignment (torchaudio MMS) if that is ever seen."""
    hop = sr // 100
    env = np.array([np.sqrt(np.mean(y[i:i + hop] ** 2)) for i in range(0, len(y) - hop + 1, hop)])
    talking = env > env.max() * 0.05
    # A pause is at least 0,12 s of quiet; shorter dips are inside words and count as speech.
    quiet = ~talking
    i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if j - i < 12:
                talking[i:j] = True
            i = j
        else:
            i += 1
    frames = np.flatnonzero(talking)  # the 10 ms frames where it speaks, in order
    words = text.split()
    # Each sentence gets its own stretch of speech between the long pauses (0,3 s and up), when they add up.
    cuts = [k + 1 for k in np.flatnonzero(np.diff(frames) > 30)]
    ends = [k + 1 for k, w in enumerate(words[:-1]) if w[-1] in ".!?"]
    if len(cuts) != len(ends):
        cuts, ends = [], []
    times = []
    for fs, ws in zip(np.split(frames, cuts), np.split(np.array(words, dtype=object), ends)):
        letters = [max(1, len(voice.plain(w))) for w in ws]
        total, at = sum(letters), 0
        for n in letters:
            a = fs[min(len(fs) - 1, at * len(fs) // total)]
            b = fs[min(len(fs) - 1, (at + n) * len(fs) // total - 1)]
            times.append([round(a / 100, 2), round((b + 1) / 100, 2)])
            at += n
    return times


def main() -> None:
    units = json.loads((SRC / "texts.json").read_text(encoding="utf-8"))
    only = set(sys.argv[1:])
    if only:
        units = [u for u in units if u["id"] in only]
    old = json.loads(TIMES.read_text(encoding="utf-8")) if TIMES.exists() else {}
    for u in units:
        u["said"] = spoken(u["text"])
    done = lambda u: old.get(u["id"], {}).get(u["key"], {})  # noqa: E731
    todo = [u for u in units if done(u).get("text") != u["text"] or done(u).get("said", u["text"]) != u["said"] or not (SRC / f"{u['id']}-{u['key']}.wav").exists()]
    # A clip with no times yet (a run that stopped after speaking) keeps its sound; only a changed text speaks again.
    speak = [u for u in todo if not (SRC / f"{u['id']}-{u['key']}.wav").exists() or u["key"] in old.get(u["id"], {})]
    print(f"ok   {len(units)} texts, {len(speak)} to speak, {len(todo)} to time")

    if speak:
        from omnivoice.models.omnivoice import OmniVoice

        model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cuda:0", dtype=torch.float16)
        sr = model.sampling_rate
        for u in speak:
            for _ in range(3):  # the model now and then returns nothing; a new try usually speaks
                y = np.asarray(model.generate(text=u["said"], language="sv", ref_audio=str(voice.REF), ref_text=voice.REF_TEXT, duration=voice.PACE * len(u["said"]))[0], dtype=np.float32).reshape(-1)
                if y.size:
                    break
            else:
                raise RuntimeError(f"{u['id']}-{u['key']}: the model returned no sound three times")
            sf.write(SRC / f"{u['id']}-{u['key']}.wav", voice.trim(y, sr), sr)
            print(f"     made {u['id']}-{u['key']}", flush=True)
        del model
        gc.collect()  # the voice model must be gone from the 8 GB card before Whisper loads
        torch.cuda.empty_cache()

    from transformers import pipeline

    asr = pipeline("automatic-speech-recognition", model="KBLab/kb-whisper-large", device="cuda:0", torch_dtype=torch.float16)
    problems = []
    for u in todo:
        y, sr = sf.read(SRC / f"{u['id']}-{u['key']}.wav", dtype="float32")
        out = asr({"raw": y, "sampling_rate": sr}, generate_kwargs={"language": "sv"})
        score = difflib.SequenceMatcher(None, voice.plain(u["text"]), voice.plain(out["text"])).ratio()
        secs = len(y) / sr
        times = word_times(u["text"], y, sr)
        # ponytail: Whisper leans towards real words, so a low score flags a clip to listen to, not a verdict.
        if score < 0.75 or not 0.03 * len(u["text"]) <= secs <= 0.12 * len(u["text"]) + 0.3:
            problems.append(f"{u['id']}-{u['key']}: {secs:.1f} s, heard {out['text'].strip()!r:.80} ({score:.2f})")
        if any(b[0] < a[0] for a, b in zip(times, times[1:])) or times[-1][1] > secs + 0.2:
            problems.append(f"{u['id']}-{u['key']}: word times out of order or past the end")
        old.setdefault(u["id"], {})[u["key"]] = {"text": u["text"], "words": times} | ({"said": u["said"]} if u["said"] != u["text"] else {})
    TIMES.write_text(json.dumps(old, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{'FAIL' if problems else 'ok  '} {len(todo)} clips timed")
    for p in problems:
        print("     " + p)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
