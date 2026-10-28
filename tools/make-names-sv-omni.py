"""Try the Swedish names in OmniVoice, the voice that reads the cards, as drafts beside Piper's clips.

    node -e "import('./src/catalog.ts').then(({DINOS}) => require('fs').writeFileSync('audio-src/names-omni/names.json', JSON.stringify(DINOS.map((d) => [d.id, d.name, d.pronounce.sv]))))"
    MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu-24.04 -- bash -c 'cd ~/voice && HF_HOME=~/voice/hf ~/voice/OmniVoice/.venv/bin/python /mnt/c/dev/dinodeck/tools/make-names-sv-omni.py'
    uv run tools/check-read.py --names    (picks the drafts that say the name as the card's hint does)
    then the picks go in OMNI in tools/make-names.py, and each is encoded over Piper's clip:
    ffmpeg -y -i audio-src/names-omni/<id>-<n>.wav -ac 1 -b:a 64k public/audio/<id>-say-sv.mp3

  -> audio-src/names-omni/<id>-1.wav (the name as written) and <id>-2.wav (the card's hint run together,
     "te-RA-no-don" -> "Teranodon"), which spells the sounds the Swedish way.

OmniVoice takes no stress marks, which is why the names went to Piper (make-names.py). Patrik wanted the card's
voice for them too (2026-10-27): a name moves over only when a listening check says it is stressed right;
the rest stay with Piper.
"""
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
import torch

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio-src" / "names-omni"
_spec = importlib.util.spec_from_file_location("voice", Path(__file__).with_name("make-voice-sv.py"))
voice = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(voice)
SLOWER = 1.15  # as make-names.py: a little slower, for children learning a long word


def main() -> None:
    from omnivoice.models.omnivoice import OmniVoice

    model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cuda:0", dtype=torch.float16)
    sr = model.sampling_rate
    only = set(sys.argv[1:])  # ids given: two more takes of each spelling, numbered after the drafts already there
    for id_, name, hint in json.loads((OUT / "names.json").read_text(encoding="utf-8")):
        if only and id_ not in only:
            continue
        respelled = " ".join(w.replace("-", "").lower().capitalize() for w in hint.split())
        start = 1 + max((int(p.stem.rsplit("-", 1)[1]) for p in OUT.glob(f"{id_}-*.wav")), default=0) if only else 1
        for n, text in enumerate([name, respelled] * (2 if only else 1), start):
            for _ in range(3):  # the model now and then returns nothing
                y = np.asarray(model.generate(text=text + ".", language="sv", ref_audio=str(voice.REF), ref_text=voice.REF_TEXT, duration=voice.PACE * len(text) * SLOWER + 0.3)[0], dtype=np.float32).reshape(-1)
                if y.size:
                    sf.write(OUT / f"{id_}-{n}.wav", voice.trim(y, sr), sr)
                    break
            else:
                print(f"FAIL {id_}-{n}: no sound three times")
        print(f"     {id_}", flush=True)


if __name__ == "__main__":
    main()
