"""Line drawings for colouring in, taken out of the finished paintings.

Reads every picture in public/img/ and writes public/img/line/<same name>.
Animals: black lines, white body, see-through outside, so an animal covers the backdrop behind it.
Backdrops: black lines on white.

Run with: uv run --with pillow tools/make-outlines.py
Prints one line per picture and exits with an error if a drawing looks empty or flooded.
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

IMG = Path(__file__).resolve().parent.parent / "public/img"
OUT = IMG / "line"


def lines(grey: Image.Image, fine: float, coarse: float, cut: int) -> Image.Image:
    """Where the painting is darker than its surroundings: 0 is line, 255 is paper.
    The difference of two blurs follows drawn edges and ignores brush texture finer than `fine`."""
    darker = ImageChops.subtract(grey.filter(ImageFilter.GaussianBlur(coarse)), grey.filter(ImageFilter.GaussianBlur(fine)))
    return darker.point(lambda v: 0 if v > cut else 255)


def animal(src: Image.Image) -> Image.Image:
    alpha = src.getchannel("A")
    grey = Image.alpha_composite(Image.new("RGBA", src.size, "white"), src).convert("L")
    solid = alpha.point(lambda v: 255 if v > 128 else 0)
    grown = solid.filter(ImageFilter.MaxFilter(7))
    # The edge of the cut-out is always drawn, so every shape is closed even where the painting fades out.
    contour = ImageChops.subtract(grown, solid)
    ink = ImageChops.darker(lines(grey, 2, 5, 7), contour.point(lambda v: 255 - v))
    out = Image.merge("RGBA", (ink, ink, ink, grown))
    return out


def backdrop(src: Image.Image) -> Image.Image:
    # Coarser than the animals: a landscape full of small strokes is no fun to colour.
    return lines(src.convert("L"), 3, 8, 5).convert("RGB")


def main() -> int:
    OUT.mkdir(exist_ok=True)
    bad = 0
    for path in sorted(IMG.glob("*.webp")):
        src = Image.open(path)
        is_bg = path.stem.startswith("bg-")
        out = backdrop(src) if is_bg else animal(src.convert("RGBA"))
        out.save(OUT / path.name, lossless=True, method=6)
        # Share of the drawn area that is ink. A real drawing sits well inside these limits.
        ink = out.convert("L").point(lambda v: 255 if v < 128 else 0)
        area = out.getchannel("A").point(lambda v: 255 if v else 0) if out.mode == "RGBA" else Image.new("L", out.size, 255)
        share = sum(ImageChops.multiply(ink, area).histogram()[255:]) / max(1, area.histogram()[255])
        # The 33 drawings reviewed 2026-10-06 lie between 16 % and 46 %.
        ok = 0.08 < share < 0.6
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {path.stem}: {share:.0%} ink, {(OUT / path.name).stat().st_size // 1024} kB")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
