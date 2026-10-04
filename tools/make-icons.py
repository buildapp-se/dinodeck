"""Render the reviewed card-stack icon and social preview from existing T. rex art.

Run with: uv run --with pillow tools/make-icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ART = Image.open(ROOT / "public/img/tyrannosaurus-rex.webp").convert("RGBA")
GREEN = "#2f5a3c"
PAPER = "#fffaf0"


def cutout(width: int) -> Image.Image:
    image = ART.copy()
    box = image.getbbox()
    if box:
        image = image.crop(box)
    return image.resize((width, round(width * image.height / image.width)), Image.Resampling.LANCZOS)


def icon(size: int, silhouette: bool = False) -> Image.Image:
    canvas = Image.new("RGBA", (512, 512), GREEN)
    for color, angle, shift in [("#e4d8bf", -8, (10, 14)), (PAPER, 5, (0, 0))]:
        card = Image.new("RGBA", (296, 226))
        ImageDraw.Draw(card).rounded_rectangle((0, 0, 295, 225), radius=26, fill=color)
        if color == PAPER:
            animal = cutout(256)
            if silhouette:
                alpha = animal.getchannel("A")
                animal = Image.new("RGBA", animal.size, "#2e2a20")
                animal.putalpha(alpha.point(lambda value: round(value * 0.85)))
            card.alpha_composite(animal, ((296 - animal.width) // 2, (226 - animal.height) // 2))
        card = card.rotate(angle, Image.Resampling.BICUBIC, expand=True)
        canvas.alpha_composite(card, ((512 - card.width) // 2 + shift[0], (512 - card.height) // 2 + shift[1]))
    return canvas.resize((size, size), Image.Resampling.LANCZOS).convert("RGB")


def social() -> Image.Image:
    canvas = Image.new("RGBA", (1200, 630), GREEN)
    stack = [("#c9bd9f", -9, (24, 18)), ("#e4d8bf", -3, (10, 8)), (PAPER, 4, (0, 0))]
    for index, (color, angle, shift) in enumerate(stack):
        card = Image.new("RGBA", (560, 400))
        ImageDraw.Draw(card).rounded_rectangle((0, 0, 559, 399), radius=40, fill=color)
        if index == 2:
            animal = cutout(480)
            card.alpha_composite(animal, ((560 - animal.width) // 2, (400 - animal.height) // 2))
        card = card.rotate(angle, Image.Resampling.BICUBIC, expand=True)
        canvas.alpha_composite(card, (520 + shift[0] - (card.width - 560) // 2, 115 + shift[1] - (card.height - 400) // 2))
    draw = ImageDraw.Draw(canvas)
    font_file = ROOT / "tools/fonts/Andika-Regular.ttf"
    bold_file = ROOT / "tools/fonts/Andika-Bold.ttf"
    draw.text((72, 195), "Dinodeck", font=ImageFont.truetype(str(bold_file), 72), fill=PAPER)
    draw.multiline_text((72, 292), "Dinosauriekort\nför barn", font=ImageFont.truetype(str(font_file), 36), fill=PAPER, spacing=6)
    return canvas.convert("RGB")


def main() -> None:
    folder = ROOT / "public/icons"
    folder.mkdir(exist_ok=True)
    for name, size in [("icon-192.png", 192), ("icon-512.png", 512), ("maskable-512.png", 512), ("apple-touch-icon.png", 180)]:
        icon(size).save(folder / name, optimize=True)
    icon(48).save(ROOT / "public/favicon.png", optimize=True)
    icon(32, True).save(ROOT / "public/favicon-32.png", optimize=True)
    social().save(ROOT / "public/og.png", optimize=True)
    large = icon(512)
    background = (47, 90, 60)
    outside = sum(
        1 for y in range(512) for x in range(512)
        if (x - 255.5) ** 2 + (y - 255.5) ** 2 > 204.8 ** 2 and large.getpixel((x, y)) != background
    )
    if outside:
        raise ValueError(f"{outside} icon pixels outside Android maskable safe circle")
    print("Rendered four app icons, two favicons and 1200x630 social preview")


if __name__ == "__main__":
    main()
