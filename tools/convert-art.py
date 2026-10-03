"""Turn approved source art into card images.

    uv run --with pillow tools/convert-art.py            # every img-src/<id>.png
    uv run --with pillow tools/convert-art.py triceratops spinosaurus

img-src/<id>.png (white or transparent background, any size)
  -> public/img/<id>.webp (transparent, trimmed, longest side 900 px)

Prints one line per image and exits non-zero if any output looks wrong.
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "img-src", ROOT / "public" / "img"
LONGEST, MAX_BYTES = 900, 150_000
KEY = (255, 0, 255)  # a colour the paintings never use


def cut_out(im: Image.Image) -> Image.Image:
    """Returns RGBA with the background transparent."""
    rgba = im.convert("RGBA")
    if rgba.getchannel("A").getextrema()[0] < 255:
        return rgba  # the generator already delivered transparency
    # ponytail: only white that touches the border is removed, so a white gap fully
    # enclosed by the body (between two legs, say) stays white. Fix by hand if one shows up.
    rgb = rgba.convert("RGB")
    w, h = rgb.size
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if rgb.getpixel(xy) != KEY:
            ImageDraw.floodfill(rgb, xy, KEY, thresh=40)
    # Zero difference from KEY in every channel means the flood reached that pixel.
    mask = ImageChops.difference(rgb, Image.new("RGB", rgb.size, KEY)).convert("L").point(lambda v: 255 if v else 0)
    # Pull the edge in one pixel and soften it, so no white fringe shows on dark backgrounds.
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    rgba.putalpha(mask)
    return rgba


def convert(name: str) -> str | None:
    """Writes the WebP. Returns a problem description, or None when it looks right."""
    src = SRC / f"{name}.png"
    if not src.exists():
        return "source missing"
    im = cut_out(Image.open(src))
    box = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if box is None:
        return "nothing left after cut-out"
    im = im.crop(box)
    covered = sum(im.getchannel("A").histogram()[129:]) / (im.width * im.height)
    scale = LONGEST / max(im.size)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    out = OUT / f"{name}.webp"
    im.save(out, "WEBP", quality=82, method=6)
    size = out.stat().st_size
    print(f"{name}: {im.width}x{im.height}, {size // 1000} kB, {covered:.0%} of box covered")
    if size > MAX_BYTES:
        return f"{size} bytes is over {MAX_BYTES}"
    if not 0.15 < covered < 0.9:
        return f"coverage {covered:.0%}: background probably not removed, or the animal was eaten"
    return None


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    names = sys.argv[1:] or sorted(p.stem for p in SRC.glob("*.png"))
    problems = {n: p for n in names if (p := convert(n))}
    for n, p in problems.items():
        print(f"FAIL {n}: {p}")
    print(f"{len(names) - len(problems)} of {len(names)} ok")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
