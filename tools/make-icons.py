"""App icons and favicon from the T. rex card picture.

    uv run --with pillow tools/make-icons.py

public/img/tyrannosaurus-rex.webp
  -> public/icons/icon-192.png, icon-512.png   (home screen)
  -> public/icons/maskable-512.png             (Android crops this to its own shape)
  -> public/icons/apple-touch-icon.png         (180 px, iOS)
  -> public/favicon.png                        (48 px, browser tab)

A portrait: head and shoulders on the app's green, the body runs off the edge.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "img" / "tyrannosaurus-rex.webp"
BG = (44, 90, 62)  # --bg-2 in src/style.css
HEAD = (0, 0, 330, 330)  # crop box in the 900 px picture: head, neck, shoulder


def icon(size: int, inset: float) -> Image.Image:
    """`inset` is the empty margin left and above the head, as a share of the icon."""
    head = Image.open(SRC).convert("RGBA").crop(HEAD)
    scale = round(size * (1 - inset))
    head = head.resize((scale, scale), Image.LANCZOS)
    out = Image.new("RGBA", (size, size), BG + (255,))
    out.alpha_composite(head, (round(size * inset), round(size * inset * 1.6)))
    return out.convert("RGB")


def main() -> None:
    icons = ROOT / "public" / "icons"
    icons.mkdir(exist_ok=True)
    jobs = [
        (icons / "icon-192.png", 192, 0.10),
        (icons / "icon-512.png", 512, 0.10),
        # Android may cut a maskable icon down to the middle 80 %: the head has to sit inside that.
        (icons / "maskable-512.png", 512, 0.22),
        (icons / "apple-touch-icon.png", 180, 0.10),
        (ROOT / "public" / "favicon.png", 48, 0.06),
    ]
    for path, size, inset in jobs:
        icon(size, inset).save(path, optimize=True)
        print(f"{path.relative_to(ROOT).as_posix()}: {size} px, {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
