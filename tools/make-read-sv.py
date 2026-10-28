"""Read the card texts aloud in Swedish with OmniVoice, with the time of every word, so the card can light
each word up while it is spoken (for children who are just starting to read).

Three steps, the middle one in WSL like tools/make-voice-sv.py (same voice, same reference, same pace):

    node tools/read-texts.ts
    MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu-24.04 -- bash -c 'cd ~/voice && HF_HOME=~/voice/hf ~/voice/OmniVoice/.venv/bin/python /mnt/c/dev/dinodeck/tools/make-read-sv.py [id ...]'
    for f in audio-src/read/*.wav; do case $f in *-fact-*) continue;; esac; ffmpeg -loglevel error -y -i "$f" -ac 1 -b:a 48k "public/audio/read/$(basename "${f%.wav}").mp3" || break; done

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
FACT_GAP = 0.8  # seconds of quiet between the "Did you know?" points
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


_fa: tuple | None = None


def word_times(said: str, y: np.ndarray, sr: int) -> list[list[float]]:
    """A [start, end] for every space-separated word of `said`, by forced alignment: torchaudio's MMS
    aligner (1 100 languages) is given the known text and finds where each letter sits in the sound.
    It knows only a-z, so å, ä and ö are read as a, a and o; a word with no letters at all (a number)
    gets the gap between its neighbours. Whisper's own word times crash in this WSL install (CUDA out of
    memory with 7 GB free, 2026-10-27), and spreading words by letters drifted a second in long texts."""
    global _fa
    import torchaudio

    if _fa is None:
        b = torchaudio.pipelines.MMS_FA
        _fa = (b.get_model(), b.get_tokenizer(), b.get_aligner(), b.sample_rate)
    model, tokenizer, aligner, rate = _fa
    words = said.split()
    norm = ["".join(c for c in w.lower().translate(str.maketrans("åäöéü", "aaoeu")) if "a" <= c <= "z") for w in words]
    wave = torchaudio.functional.resample(torch.from_numpy(y).unsqueeze(0), sr, rate)  # on the CPU: beside Whisper on the 8 GB card it ran out of memory (2026-10-28)
    with torch.inference_mode():
        emission, _ = model(wave)
        spans = aligner(emission[0], tokenizer([n for n in norm if n]))
    step = wave.shape[1] / emission.shape[1] / rate  # seconds per emission frame
    found = iter(spans)
    times: list[list[float] | None] = [None if not n else [s[0].start * step, s[-1].end * step] for n in norm for s in [next(found) if n else None]]
    for i, t in enumerate(times):
        if t is None:
            lo = times[i - 1][1] if i else 0.0  # type: ignore[index]
            hi = next((x[0] for x in times[i + 1:] if x), len(y) / sr)
            times[i] = [lo, hi]
    return [[round(a, 2), round(b, 2)] for a, b in times]  # type: ignore[misc]


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

    asr = pipeline("automatic-speech-recognition", model="KBLab/kb-whisper-large", device="cuda:0", torch_dtype=torch.float16, chunk_length_s=30)  # some clips run past 30 s
    problems = []
    for u in todo:
        y, sr = sf.read(SRC / f"{u['id']}-{u['key']}.wav", dtype="float32")
        out = asr({"raw": y, "sampling_rate": sr}, generate_kwargs={"language": "sv"})
        score = difflib.SequenceMatcher(None, voice.plain(u["text"]), voice.plain(out["text"])).ratio()
        secs = len(y) / sr
        times = word_times(u["said"], y, sr)
        # ponytail: Whisper leans towards real words, so a low score flags a clip to listen to, not a verdict.
        if score < 0.75 or not 0.03 * len(u["text"]) <= secs <= 0.12 * len(u["text"]) + 0.3:
            problems.append(f"{u['id']}-{u['key']}: {secs:.1f} s, heard {out['text'].strip()!r:.80} ({score:.2f})")
        if any(b[0] < a[0] for a, b in zip(times, times[1:])) or times[-1][1] > secs + 0.2:
            problems.append(f"{u['id']}-{u['key']}: word times out of order or past the end")
        old.setdefault(u["id"], {})[u["key"]] = {"text": u["text"], "words": times} | ({"said": u["said"]} if u["said"] != u["text"] else {})
        TIMES.write_text(json.dumps(old, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")  # a crash keeps what is done
    for id_ in {u["id"] for u in units}:
        keys = [u["key"] for u in units if u["id"] == id_]
        # Texts no longer read aloud (the sound paragraph, Patrik 2026-10-27) leave the app's data.
        old[id_] = {k: v for k, v in old[id_].items() if k in keys or k == "facts"}
        # "Did you know?" is read as one clip: every point, with a pause between them (Patrik 2026-10-27).
        facts = [k for k in keys if k.startswith("fact-")]
        parts, words, at = [], [], 0.0
        for k in facts:
            y, sr = sf.read(SRC / f"{id_}-{k}.wav", dtype="float32")
            words += [[round(a + at, 2), round(b + at, 2)] for a, b in old[id_][k]["words"]]
            parts += [y, np.zeros(int(FACT_GAP * sr), dtype=np.float32)]
            at += len(y) / sr + FACT_GAP
        sf.write(SRC / f"{id_}-facts.wav", np.concatenate(parts[:-1]), sr)
        old[id_]["facts"] = {"text": " ".join(old[id_][k]["text"] for k in facts), "words": words}
    TIMES.write_text(json.dumps(old, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{'FAIL' if problems else 'ok  '} {len(todo)} clips timed")
    for p in problems:
        print("     " + p)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
