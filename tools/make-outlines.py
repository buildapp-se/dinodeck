"""Colouring pages from the line drawings Codex redrew from each painting.

img-src/line/<name>.png (black lines on white, same canvas as img-src/<name>.png)
  -> public/img/line/<name>.webp
Animals: black lines, white body, see-through outside, cropped exactly like the card picture,
so an animal covers the backdrop behind it and stands where the painted one stood in the scene.
Backdrops: black lines on white.

Run with: uv run --with pillow tools/make-outlines.py [name ...]
Prints one line per picture and exits with an error if a drawing is empty, flooded or leaks.
"""
import importlib.util
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC, LINE, OUT = ROOT / "img-src", ROOT / "img-src/line", ROOT / "public/img/line"
LONGEST = 1200  # about 160 dpi across an A4 page: smooth lines on paper
KEY = 128  # a grey the cleaned drawing never contains

sys.dont_write_bytecode = True  # importing convert-art.py would leave a __pycache__ in tools/
spec = importlib.util.spec_from_file_location("convert_art", ROOT / "tools/convert-art.py")
convert_art = importlib.util.module_from_spec(spec)
spec.loader.exec_module(convert_art)


def ink(drawing: Image.Image, weight: int) -> Image.Image:
    """Thicker, darker lines with soft edges: 0 is ink, 255 is paper. Codex draws thinner than asked."""
    grey = drawing.convert("L").filter(ImageFilter.MinFilter(weight))
    return grey.point(lambda v: 0 if v < 110 else 255 if v > 210 else round((v - 110) * 2.55))


def animal(name: str) -> tuple[Image.Image, str | None]:
    lines = ink(Image.open(LINE / f"{name}.png"), 3)
    painted = convert_art.cut_out(Image.open(SRC / f"{name}.png")).getchannel("A").point(lambda v: 255 if v > 128 else 0)
    # Everything the paper reaches from the border is outside. A gap in the outline lets it in.
    flood = lines.point(lambda v: 255 if v > 200 else 0)
    w, h = flood.size
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if flood.getpixel(xy) == 255:
            ImageDraw.floodfill(flood, xy, KEY)
    inside = flood.point(lambda v: 0 if v == KEY else 255)
    # A bolder outer contour reads best on paper and gives the shape a clear edge to colour up to.
    contour = ImageChops.subtract(inside, inside.filter(ImageFilter.MinFilter(7)))
    lines = ImageChops.darker(lines, ImageChops.invert(contour))
    # How densely each silhouette fills its own box: a redrawing may be smaller than the painting, a leak is emptier.
    p, d = painted.getbbox(), inside.getbbox()
    density = lambda mask, b: sum(mask.histogram()[255:]) / max(1, (b[2] - b[0]) * (b[3] - b[1]))
    fill = density(inside, d) / density(painted, p)
    out = Image.merge("RGBA", (lines, lines, lines, inside))
    # The drawing's own box: the redrawn lines never sit exactly on the painting, and its box cut tail tips flat.
    out = out.crop(d)
    scale = LONGEST / max(out.size)
    out = out.resize((round(out.width * scale), round(out.height * scale)), Image.Resampling.LANCZOS)
    # A leak empties the body; a drawing that grew past the painting would sit wrong in the scene.
    problem = None if 0.85 < fill < 1.2 else f"silhouette fills its box {fill:.0%} as densely as the painting's"
    return out, problem


def backdrop(name: str) -> tuple[Image.Image, str | None]:
    return ink(Image.open(LINE / f"{name}.png"), 3).convert("RGB"), None


def main() -> int:
    OUT.mkdir(exist_ok=True)
    names = sys.argv[1:] or sorted(p.stem for p in (ROOT / "public/img").glob("*.webp"))
    bad = 0
    for name in names:
        if not (LINE / f"{name}.png").exists():
            print(f"FAIL {name}: img-src/line/{name}.png missing")
            bad += 1
            continue
        out, problem = backdrop(name) if name.startswith("bg-") else animal(name)
        out.save(OUT / f"{name}.webp", lossless=True, method=6)
        # Share of the drawn area that is ink. The 33 drawings of 2026-10-25 lie between 17 % and 35 %
        # (slim and feathered animals highest, since the share is of their own small area).
        dark = out.convert("L").point(lambda v: 255 if v < 128 else 0)
        area = out.getchannel("A").point(lambda v: 255 if v else 0) if out.mode == "RGBA" else Image.new("L", out.size, 255)
        share = sum(ImageChops.multiply(dark, area).histogram()[255:]) / max(1, area.histogram()[255])
        if not problem and not 0.05 < share < 0.4:
            problem = f"{share:.0%} ink"
        bad += problem is not None
        size = (OUT / f"{name}.webp").stat().st_size // 1024
        print(f"FAIL {name}: {problem}" if problem else f"ok   {name}: {share:.0%} ink, {size} kB")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
