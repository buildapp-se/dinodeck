"""Speak the 30 names in Swedish and English, as ready-made clips.

    uv run --python 3.12 --with piper-tts --with soundfile --with numpy tools/make-names.py

  -> public/audio/<id>-say-sv.mp3, public/audio/<id>-say-en.mp3

Runs Piper on this computer: no account, no service, nothing sent anywhere. The two voices are
trained from scratch on free recordings (licences in VOICES below) and are downloaded on first run
to audio-src/voices/, which is not checked in.

The names are not given to the voice as text. Left to itself it stresses every Swedish name on the
first syllable and says "sh" in Brachiosaurus, and gets Deinonychus, Maiasaura and Iguanodon wrong in
English. Each name is written out below in the voice's own phonetic alphabet instead (IPA, as espeak-ng
writes it), following the pronunciation hint on the card. ˈ marks the stressed syllable, ˌ a lighter one.

Prints one line per check and exits non-zero if anything looks wrong.
"""
import re
import sys
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf
from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
VOICE_DIR, OUT = ROOT / "audio-src" / "voices", ROOT / "public" / "audio"
HUB = "https://huggingface.co/rhasspy/piper-voices/resolve/main"
# Model card of each voice, read 2026-10-03. Both datasets are free to use, and neither model is a
# fine-tune of a voice with stricter terms. The voices repository itself is MIT.
VOICES = {
    "sv": ("sv/sv_SE/nst/medium/sv_SE-nst-medium", "NST Swedish speech database, CC0, trained from scratch by KBLab (National Library of Sweden)"),
    "en": ("en/en_GB/cori/high/en_GB-cori-high", "LibriVox recordings, public domain, trained from scratch by Bryce Beattie"),
}
SLOWER = 1.15  # a little slower than the voice's normal pace: these are for children learning a long word

S = "sˈaʉːrʉːs"  # Swedish -saurus, stressed where a Swede puts it
E = "sˈɔːɹəs"  # English -saurus
NAMES: dict[str, dict[str, str]] = {
    "tyrannosaurus-rex": {"sv": f"tˌyranuː{S} rˈɛks", "en": f"taɪɹˌanə{E} ɹˈɛks"},
    "triceratops": {"sv": "trɪsˈeːratɔps", "en": "tɹaɪsˈɛɹətˌɒps"},
    "stegosaurus": {"sv": f"stˌeːɡuː{S}", "en": f"stˌɛɡə{E}"},
    "brachiosaurus": {"sv": f"brˌakɪuː{S}", "en": f"bɹˌakɪə{E}"},
    "velociraptor": {"sv": "vˌɛluːsɪrˈaptɔr", "en": "vəlˈɒsəɹˌaptə"},
    "diplodocus": {"sv": "dɪplˈoːdɔkʉːs", "en": "dɪplˈɒdəkəs"},
    "ankylosaurus": {"sv": f"ˌaŋkyluː{S}", "en": f"aŋkˌaɪlə{E}"},
    "pteranodon": {"sv": "tɛrˈɑːnuːdɔn", "en": "təɹˈanədˌɒn"},
    "spinosaurus": {"sv": f"spˌiːnuː{S}", "en": f"spˌaɪnə{E}"},
    "allosaurus": {"sv": f"ˌaluː{S}", "en": f"ˌalə{E}"},
    "giganotosaurus": {"sv": f"ɡˌɪɡanuːtuː{S}", "en": f"dʒˌɪɡənˌəʊtə{E}"},
    "carnotaurus": {"sv": "kˌɑːɳuːtˈaʉːrʉːs", "en": "kˌɑːnətˈɔːɹəs"},
    "dilophosaurus": {"sv": f"dˌɪluːfuː{S}", "en": f"daɪlˌəʊfə{E}"},
    "deinonychus": {"sv": "dɛjnˈoːnykʉːs", "en": "daɪnˈɒnɪkəs"},
    "compsognathus": {"sv": "kˌɔmpsɔɡnˈɑːtʉːs", "en": "kˌɒmpsɒɡnˈaθəs"},
    "gallimimus": {"sv": "ɡˌalɪmˈiːmʉːs", "en": "ɡˌalɪmˈaɪməs"},
    "oviraptor": {"sv": "ˌuːvɪrˈaptɔr", "en": "ˈəʊvɪɹˌaptə"},
    "therizinosaurus": {"sv": f"tˌɛrɪsɪnuː{S}", "en": f"θˌɛɹɪzˌɪnə{E}"},
    "archaeopteryx": {"sv": "ˌarkɛˈɔptɛryks", "en": "ˌɑːkiːˈɒptəɹɪks"},
    "microraptor": {"sv": "mˈiːkruːrˌaptɔr", "en": "mˈaɪkɹəʊɹˌaptə"},
    "argentinosaurus": {"sv": f"ˌarɡɛntˌiːnuː{S}", "en": f"ˌɑːdʒəntˌiːnə{E}"},
    "apatosaurus": {"sv": f"ˌapatuː{S}", "en": f"əpˌatə{E}"},
    "iguanodon": {"sv": "ɪɡɵˈɑːnuːdɔn", "en": "ɪɡwˈɑːnədˌɒn"},
    "parasaurolophus": {"sv": "pˌarasaʉːrˈoːluːfʉːs", "en": "pˌaɹəsɔːɹˈɒləfəs"},
    "maiasaura": {"sv": "mˌajasˈaʉːra", "en": "mˌaɪəsˈɔːɹə"},
    "pachycephalosaurus": {"sv": f"pˌakysˌɛfaluː{S}", "en": f"pˌakɪsˌɛfələ{E}"},
    "protoceratops": {"sv": "prˌuːtuːsˈeːratɔps", "en": "pɹˌəʊtəʊsˈɛɹətˌɒps"},
    "plateosaurus": {"sv": f"plˌatɛuː{S}", "en": f"plˌatɪə{E}"},
    "mosasaurus": {"sv": f"mˌuːsa{S}", "en": f"mˌəʊzə{E}"},
    "plesiosaurus": {"sv": f"plˌeːsɪuː{S}", "en": f"plˌiːsɪə{E}"},
}


def catalogue_ids() -> set[str]:
    ids: set[str] = set()
    for name in ("dinos.ts", "dinos-won.ts"):
        ids.update(re.findall(r"^\s+id: '([^']+)',$", (ROOT / "src" / name).read_text(encoding="utf-8"), re.M))
    return ids


def load_voice(lang: str) -> PiperVoice:
    path, _ = VOICES[lang]
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    model = VOICE_DIR / (path.rsplit("/", 1)[1] + ".onnx")
    for file, url in ((model, f"{HUB}/{path}.onnx"), (Path(f"{model}.json"), f"{HUB}/{path}.onnx.json")):
        if not file.exists():
            print(f"downloading {file.name}")
            urllib.request.urlretrieve(url, file)
    return PiperVoice.load(model)


def speak(voice: PiperVoice, ipa: str) -> tuple[np.ndarray, int]:
    # [[ ]] hands Piper the sounds directly instead of text to interpret. The full stop makes the voice land the word.
    chunks = list(voice.synthesize(f"[[ {ipa}. ]]", syn_config=SynthesisConfig(length_scale=SLOWER)))
    y = np.concatenate([c.audio_float_array for c in chunks])
    sr = chunks[0].sample_rate
    # Cut the silence before and after, keep a short breath of it, fade both ends, bring to full level.
    loud = np.flatnonzero(np.abs(y) > 0.02 * np.abs(y).max())
    pad = int(0.06 * sr)
    y = y[max(0, loud[0] - pad) : loud[-1] + pad]
    fade = int(0.02 * sr)
    y[:fade] *= np.linspace(0, 1, fade)
    y[-fade:] *= np.linspace(1, 0, fade)
    return 0.89 * y / np.abs(y).max(), sr


def main() -> None:
    if catalogue_ids() != set(NAMES):
        sys.exit(f"FAIL names and catalogue differ: {sorted(catalogue_ids() ^ set(NAMES))}")
    OUT.mkdir(parents=True, exist_ok=True)
    problems: list[str] = []
    seconds: list[float] = []
    for lang in VOICES:
        voice = load_voice(lang)
        known = set(voice.config.phoneme_id_map)
        for dino, said in NAMES.items():
            unknown = set(said[lang]) - known
            if unknown:
                problems.append(f"{dino} ({lang}): the voice has no sound for {sorted(unknown)}")
                continue
            y, sr = speak(voice, said[lang])
            path = OUT / f"{dino}-say-{lang}.mp3"
            sf.write(path, y, sr, format="MP3")
            seconds.append(len(y) / sr)
            # A name takes roughly 0.06 to 0.2 s per sound. Far outside that, the voice skipped or stuttered.
            sounds = len(re.sub(r"[ˈˌː ]", "", said[lang]))
            if not 0.05 * sounds <= len(y) / sr <= 0.22 * sounds:
                problems.append(f"{path.name}: {len(y) / sr:.2f} s for {sounds} sounds")
    total = sum(p.stat().st_size for p in OUT.glob("*-say-*.mp3"))
    print(f"{'FAIL' if problems else 'ok  '} {len(seconds)} names, {min(seconds):.1f} to {max(seconds):.1f} s, {total // 1024} kB")
    for p in problems:
        print("     " + p)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
