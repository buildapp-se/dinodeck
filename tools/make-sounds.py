"""Build two sounds per animal from free recordings of animals alive today.

    uv run --with soundfile --with numpy tools/make-sounds.py

audio-src/<file> (listed with licence in audio-src/sources.json)
  -> public/audio/<id>-roar.mp3   the film roar, played when the animal on the card is tapped
  -> public/audio/<id>-call.mp3   closer to what researchers guess, played from the back of the card

Pitch follows body weight: a recording is slowed down for an animal heavier than the one recorded
(deeper and longer) and sped up for a lighter one (brighter and shorter).

Refuses to run on a source whose licence is not CC0 or public domain, or whose checksum does not
match the one written down when the licence was checked. Prints one line per check and exits
non-zero if any output looks wrong.
"""
import hashlib
import json
import math
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "audio-src", ROOT / "public" / "audio"
ALLOWED = {"CC0", "Public domain"}
SR = 32000  # output sample rate
K = 0.18  # how strongly weight bends pitch: rate = (recorded kg / dinosaur kg) ** K
RATE_MIN, RATE_MAX = 0.45, 2.2  # slower than 0.45 turns into a rumble no phone speaker can play
MAX_BYTES = 90_000

# Rumble, wind and hum below the animal's own voice, cut per source (Hz).
HIGH_PASS = {"alligator": 40, "elephant": 80, "lion": 40, "bison": 40, "dove": 150, "gull": 600, "crane": 300, "raven": 400, "grouse": 30}

# One layer is (source, which loud passage of it, pitch nudge, volume). The first layer is the main voice.
# "roar" is what a film would do. "call" follows the card's own text under "What did it sound like?".
L = lambda src, nth=0, tune=1.0, gain=1.0: (src, nth, tune, gain)
RECIPES: dict[str, dict[str, list | str]] = {
    # Big meat-eaters: film = big cat, research = closed-mouth rumble like a crocodile (and a dove, far down).
    "tyrannosaurus-rex": {"roar": [L("lion"), L("elephant", gain=0.5), L("alligator", gain=0.4)], "call": [L("alligator"), L("dove", gain=0.5)]},
    "giganotosaurus": {"roar": [L("lion", 1), L("alligator", gain=0.5)], "call": [L("alligator", 1)]},
    "spinosaurus": {"roar": [L("lion", tune=1.1), L("alligator", 1, gain=0.6)], "call": [L("alligator", 2)]},
    "allosaurus": {"roar": [L("lion", 1)], "call": [L("alligator", tune=1.05), L("dove", gain=0.4)]},
    "carnotaurus": {"roar": [L("lion", tune=1.15)], "call": [L("alligator", 1), L("dove", gain=0.4)]},
    "dilophosaurus": {"roar": [L("lion", 1), L("raven", gain=0.4)], "call": [L("alligator", 2, tune=1.1)]},
    # Long-necked giants: film = elephant, research = very deep sounds.
    "brachiosaurus": {"roar": [L("elephant")], "call": [L("bison")]},
    "diplodocus": {"roar": [L("elephant"), L("bison", gain=0.5)], "call": [L("bison"), L("dove", gain=0.3)]},
    "argentinosaurus": {"roar": [L("elephant"), L("alligator", gain=0.5)], "call": [L("bison", tune=0.95), L("alligator", gain=0.4)]},
    "apatosaurus": {"roar": [L("elephant", tune=0.95), L("lion", gain=0.3)], "call": [L("bison", tune=1.05)]},
    "plateosaurus": {"roar": [L("elephant"), L("bison", gain=0.4)], "call": [L("alligator", 2)]},
    # Plant-eaters with horns, plates and armour: low grunts and snorts.
    "triceratops": {"roar": [L("bison"), L("elephant", gain=0.4)], "call": [L("bison"), L("alligator", gain=0.4)]},
    "stegosaurus": {"roar": [L("bison", tune=0.9)], "call": [L("alligator")]},
    "ankylosaurus": {"roar": [L("bison"), L("alligator", gain=0.5)], "call": [L("alligator", 1), L("bison", gain=0.4)]},
    "iguanodon": {"roar": [L("elephant"), L("bison", gain=0.5)], "call": [L("bison")]},
    "therizinosaurus": {"roar": [L("bison"), L("elephant", gain=0.4)], "call": [L("dove"), L("alligator", gain=0.3)]},
    "pachycephalosaurus": {"roar": [L("bison")], "call": [L("bison", tune=1.1)]},
    "protoceratops": {"roar": [L("bison", tune=1.1)], "call": [L("bison")]},
    # Duck-bills: the hollow crest of Parasaurolophus worked like a wind instrument, so that one is synthesised.
    "parasaurolophus": {"roar": [L("elephant")], "call": "horn"},
    "maiasaura": {"roar": [L("elephant", tune=1.1)], "call": [L("elephant"), L("bison", gain=0.5)]},
    # Small and feathered: hisses, coos and bird calls.
    "velociraptor": {"roar": [L("crane"), L("raven", gain=0.5)], "call": [L("dove")]},
    "deinonychus": {"roar": [L("crane", 1), L("lion", gain=0.35)], "call": [L("raven"), L("dove", gain=0.4)]},
    "oviraptor": {"roar": [L("crane", tune=1.1)], "call": [L("dove", 1, tune=1.2)]},
    "gallimimus": {"roar": [L("crane", 1)], "call": [L("grouse")]},
    "compsognathus": {"roar": [L("gull", tune=1.3)], "call": [L("gull", 1, tune=1.5)]},
    "archaeopteryx": {"roar": [L("gull", 1, tune=1.2)], "call": [L("raven", 1)]},
    "microraptor": {"roar": [L("raven", tune=1.2)], "call": [L("gull", tune=1.2)]},
    # Not dinosaurs.
    "pteranodon": {"roar": [L("raven"), L("gull", gain=0.5)], "call": [L("gull", tune=0.9)]},
    "mosasaurus": {"roar": [L("lion", tune=0.9), L("alligator", gain=0.7)], "call": [L("alligator", tune=0.95)]},
    "plesiosaurus": {"roar": [L("alligator", 1), L("elephant", gain=0.3)], "call": [L("alligator", 1)]},
}


def weights() -> dict[str, float]:
    """Body weight per animal, read from the catalogue so the two never drift apart."""
    found: dict[str, float] = {}
    for name in ("dinos.ts", "dinos-won.ts"):
        text = (ROOT / "src" / name).read_text(encoding="utf-8")
        for m in re.finditer(r"id: '([^']+)'.*?weightKg: ([\d.]+)", text, re.S):
            found[m.group(1)] = float(m.group(2))
    return found


def load_sources() -> dict[str, tuple[np.ndarray, int, float]]:
    """key -> (mono samples, sample rate, weight of the recorded animal). Stops on a licence or checksum problem."""
    out = {}
    for s in json.loads((SRC / "sources.json").read_text(encoding="utf-8")):
        if s["license"] not in ALLOWED:
            sys.exit(f"FAIL {s['file']}: licence {s['license']!r} is not CC0 or public domain")
        path = SRC / s["file"]
        if hashlib.sha1(path.read_bytes()).hexdigest() != s["sha1"]:
            sys.exit(f"FAIL {s['file']}: not the file whose licence was checked (checksum differs)")
        x, sr = sf.read(path, always_2d=True)
        mono = x.mean(axis=1)
        # High-pass in one step: zero everything below the cut-off, which also removes any DC offset.
        spec = np.fft.rfft(mono)
        spec[np.fft.rfftfreq(len(mono), 1 / sr) < HIGH_PASS[s["key"]]] = 0
        out[s["key"]] = (np.fft.irfft(spec, len(mono)), sr, float(s["kg"]))
    return out


def loud_start(x: np.ndarray, sr: int, seconds: float, nth: int) -> int:
    """Start of the nth loudest passage of that length. Later passages never overlap earlier ones."""
    n = min(len(x), max(1, int(seconds * sr)))
    hop = max(1, sr // 20)
    energy = np.concatenate(([0.0], np.cumsum(x * x)))
    starts = np.arange(0, len(x) - n + 1, hop)
    score = energy[starts + n] - energy[starts]
    best = 0
    for _ in range(nth + 1):
        if not np.isfinite(score).any():
            break  # a short source has fewer passages than asked for: reuse the last one found
        best = int(starts[int(np.argmax(score))])
        score[np.abs(starts - best) < n] = -np.inf
    return best


def pitched(source: tuple[np.ndarray, int, float], kg: float, seconds: float, nth: int, tune: float) -> np.ndarray:
    x, sr, src_kg = source
    rate = min(RATE_MAX, max(RATE_MIN, (src_kg / kg) ** K * tune))
    start = loud_start(x, sr, seconds * rate, nth)
    # Reading the recording at `rate` times normal speed is what changes the pitch.
    at = start + np.arange(int(seconds * SR)) * rate * sr / SR
    return np.interp(at[at < len(x) - 1], np.arange(len(x)), x)


def horn(seconds: float = 2.6) -> np.ndarray:
    """A long low toot and a short one: a tube resonating near 100 Hz, with overtones a phone speaker can play."""
    def note(length: float, f0: float) -> np.ndarray:
        t = np.arange(int(length * SR)) / SR
        freq = f0 * (1 + 0.04 * np.exp(-t * 6)) * (1 + 0.006 * np.sin(2 * np.pi * 5 * t))  # settles into the note, slight wobble
        phase = 2 * np.pi * np.cumsum(freq) / SR
        # Overtones fall off slowly and peak around 400 Hz, like a brass bell.
        tone = sum(np.sin(k * phase) * math.exp(-((k * f0 - 400) / 450) ** 2) / k**0.4 for k in range(1, 16))
        env = np.minimum(1, t / 0.12) * np.minimum(1, (length - t) / 0.35)
        return tone * env
    gap = np.zeros(int(0.12 * SR))
    return np.concatenate([note(seconds * 0.62, 98), gap, note(seconds * 0.33, 110)])


def finish(y: np.ndarray) -> np.ndarray:
    """Fades at both ends, a little saturation so deep sounds carry on small speakers, then full level."""
    y = y / (np.abs(y).max() or 1)
    y = np.tanh(1.6 * y)
    fade_in, fade_out = int(0.015 * SR), min(int(0.4 * SR), len(y) // 4)
    y[:fade_in] *= np.linspace(0, 1, fade_in)
    y[-fade_out:] *= np.linspace(1, 0, fade_out)
    return 0.89 * y / (np.abs(y).max() or 1)


def build(recipe: list | str, kg: float, sources: dict) -> np.ndarray:
    if recipe == "horn":
        return finish(horn())
    # Heavier animals call for longer: 1 kg about a second, 10 tonnes about three.
    seconds = min(3.0, max(0.9, 0.9 + 0.5 * math.log10(kg)))
    layers = [gain * pitched(sources[src], kg, seconds, nth, tune) / (np.abs(sources[src][0]).max() or 1) for src, nth, tune, gain in recipe]
    mix = np.zeros(max(len(layer) for layer in layers))
    for layer in layers:
        mix[: len(layer)] += layer
    return finish(mix)


def centroid(y: np.ndarray) -> float:
    """Where the weight of the spectrum sits, in Hz: lower means it sounds deeper."""
    spec = np.abs(np.fft.rfft(y * np.hanning(len(y))))
    return float((spec * np.fft.rfftfreq(len(y), 1 / SR)).sum() / spec.sum())


def main() -> None:
    kg = weights()
    if set(kg) != set(RECIPES):
        sys.exit(f"FAIL recipes and catalogue differ: {sorted(set(kg) ^ set(RECIPES))}")
    sources = load_sources()
    print(f"ok   {len(sources)} sources, licence and checksum match audio-src/sources.json")
    OUT.mkdir(parents=True, exist_ok=True)
    problems: list[str] = []
    made: dict[tuple[str, str], np.ndarray] = {}
    for dino, recipe in RECIPES.items():
        for kind in ("roar", "call"):
            y = build(recipe[kind], kg[dino], sources)
            path = OUT / f"{dino}-{kind}.mp3"
            sf.write(path, y, SR, format="MP3")
            made[(dino, kind)] = y
            if not 0.5 <= len(y) / SR <= 3.2:
                problems.append(f"{path.name}: {len(y) / SR:.1f} s")
            if path.stat().st_size > MAX_BYTES:
                problems.append(f"{path.name}: {path.stat().st_size} bytes")
            if float(np.sqrt(np.mean(y * y))) < 0.05:
                problems.append(f"{path.name}: nearly silent")
    # The promise of the whole script, measured: same main voice and passage, the heavier animal sounds deeper.
    pairs = wrong = 0
    for kind in ("roar", "call"):
        same: dict[tuple, list[str]] = {}
        for dino, recipe in RECIPES.items():
            if recipe[kind] != "horn" and len(recipe[kind]) == 1:
                src, nth, _, _ = recipe[kind][0]
                same.setdefault((src, nth), []).append(dino)
        for dinos in same.values():
            for a in dinos:
                for b in dinos:
                    if kg[a] >= 3 * kg[b]:
                        pairs += 1
                        if centroid(made[(a, kind)]) >= centroid(made[(b, kind)]):
                            wrong += 1
                            problems.append(f"{a} ({kind}) is not deeper than {b}")
    total = sum(p.stat().st_size for p in OUT.glob("*.mp3"))
    print(f"{'FAIL' if problems else 'ok  '} {len(made)} sounds, {total // 1024} kB, {pairs - wrong}/{pairs} heavier-is-deeper pairs")
    for p in problems:
        print("     " + p)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
