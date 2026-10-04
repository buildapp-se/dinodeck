"""Extract licensed Andika webfont subsets embedded in the supplied design review.

Usage: uv run tools/extract-review-fonts.py "C:/Users/patri/Downloads/Dinodeck designgranskning.html"
"""
import base64
import json
import sys
from pathlib import Path

html = Path(sys.argv[1]).read_text(encoding="utf-8").splitlines()
asset_line = next(line for line in html if line.startswith('{"') and '"mime"' in line)
manifest = json.loads(asset_line)
output = Path(__file__).resolve().parent.parent / "public" / "fonts"
output.mkdir(exist_ok=True)
assets = {
    "andika-400-latin.woff2": "2614aff0-70ec-4ce4-af87-e6269528bb8f",
    "andika-400-ext.woff2": "9c68dfb1-85ff-4188-b890-c12fce127d1d",
    "andika-700-latin.woff2": "4550d0a1-4103-4582-9674-53535f1dfc93",
    "andika-700-ext.woff2": "904071d4-5e06-4b67-a088-5c1b89e95bf0",
}
for filename, asset_id in assets.items():
    (output / filename).write_bytes(base64.b64decode(manifest[asset_id]["data"]))
print(f"Extracted {len(assets)} Andika WOFF2 subsets")
