"""Speak the challenge questions in Swedish with OmniVoice, as ready-made clips.

Runs in WSL, in the OmniVoice install that filmverk set up (see filmverk docs/research/generated-sound.md):

    MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu-24.04 -- bash -c 'cd ~/voice && HF_HOME=~/voice/hf ~/voice/OmniVoice/.venv/bin/python /mnt/c/dev/dinodeck/tools/make-voice-sv.py'
    for f in audio-src/omnivoice/*.wav; do ffmpeg -loglevel error -y -i "$f" -b:a 64k "public/audio/$(basename "${f%.wav}").mp3" || break; done

  -> audio-src/omnivoice/prompt-<key>-sv.wav, then mp3 in public/audio/

Local, no account, nothing sent anywhere. Patrik chose the voice by ear 2026-10-26: the model's own voice,
without a reference, at speed 0,75. That take, audio-src/omnivoice-ref.wav, is the reference for every clip,
since without one each sentence would get a new voice. Names and English stay with Piper (tools/make-names.py):
OmniVoice takes no phonetic spelling, so it cannot be told where a name is stressed, and gave Iguanodon no sound at all.

Every clip is transcribed back with KB-Whisper. Prints one line per check and exits non-zero if a clip is
suspect: the transcript is far from the text, or the length is off.
"""
import difflib
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
import torch

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio-src" / "omnivoice"
REF = ROOT / "audio-src" / "omnivoice-ref.wav"
REF_TEXT = "Hur många dinosaurier? Vem är det? Försök igen! Tyrannosaurus rex. Parasaurolophus."
# The chosen take: 7,0 s for its 84 characters, made with speed=0.75. Each clip gets its length at that pace
# instead of speed=0.75 itself, which twice returned no sound at all. Measured 2026-10-26: "Hur många
# dinosaurier?" takes 1,16 s in the take and 1,11 s in its clip.
PACE = 7.0 / len(REF_TEXT)

PROMPTS = {
    "how-old": "Hur gammal är du?",
    "who": "Vem är det?",
    "count": "Hur många dinosaurier?",
    "longest": "Vilken var längst?",
    "try-again": "Försök igen!",
}


def trim(y: np.ndarray, sr: int) -> np.ndarray:
    # Same as make-names.py: cut the silence, keep a breath of it, fade the ends, full level.
    loud = np.flatnonzero(np.abs(y) > 0.02 * np.abs(y).max())
    pad, fade = int(0.06 * sr), int(0.02 * sr)
    y = y[max(0, loud[0] - pad) : loud[-1] + pad].copy()
    y[:fade] *= np.linspace(0, 1, fade)
    y[-fade:] *= np.linspace(1, 0, fade)
    return 0.89 * y / np.abs(y).max()


def plain(s: str) -> str:
    return re.sub(r"[^a-zåäö]", "", s.lower())


def main() -> None:
    texts = {f"prompt-{k}-sv": t for k, t in PROMPTS.items()}

    from omnivoice.models.omnivoice import OmniVoice

    model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cuda:0", dtype=torch.float16)
    OUT.mkdir(parents=True, exist_ok=True)
    sr = model.sampling_rate
    for stem, text in texts.items():
        for _ in range(3):  # the model now and then returns nothing; a new try usually speaks
            y = np.asarray(model.generate(text=text, language="sv", ref_audio=str(REF), ref_text=REF_TEXT, duration=PACE * len(text))[0], dtype=np.float32).reshape(-1)
            if y.size:
                break
        else:
            raise RuntimeError(f"{stem}: the model returned no sound three times")
        sf.write(OUT / f"{stem}.wav", trim(y, sr), sr)
    del model
    torch.cuda.empty_cache()

    from transformers import pipeline

    asr = pipeline("automatic-speech-recognition", model="KBLab/kb-whisper-large", device="cuda:0", torch_dtype=torch.float16)
    problems = []
    for stem, text in texts.items():
        y, _ = sf.read(OUT / f"{stem}.wav", dtype="float32")
        heard = asr({"raw": y, "sampling_rate": sr}, generate_kwargs={"language": "sv"})["text"]
        score = difflib.SequenceMatcher(None, plain(text), plain(heard)).ratio()
        secs = len(y) / sr
        # ponytail: Whisper leans towards real words, so a low score flags a clip to listen to, not a verdict.
        # Length: the reference speaks about 0,05 s a letter in its questions, plus 0,12 s of kept silence.
        if score < 0.6 or not 0.03 * len(text) <= secs <= 0.12 * len(text) + 0.3:
            problems.append(f"{stem}: {secs:.1f} s, heard {heard.strip()!r} ({score:.2f})")
    print(f"{'FAIL' if problems else 'ok  '} {len(texts)} clips")
    for p in problems:
        print("     " + p)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
