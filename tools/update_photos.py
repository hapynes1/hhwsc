from pathlib import Path
from PIL import Image, ImageOps
import json


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "\u56fe\u7247"
OUTPUT_DIR = ROOT / "assets" / "photos"
PHOTO_DATA = ROOT / "photo-data.js"
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    items = []
    sources = sorted(
        path
        for path in SOURCE_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in EXTENSIONS
    )

    for index, source in enumerate(sources, 1):
        output = OUTPUT_DIR / f"photo-{index:03d}.webp"
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            image.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
            image.save(output, "WEBP", quality=82, method=6)

        items.append(
            {
                "src": f"assets/photos/{output.name}",
                "original": f"\u56fe\u7247/{source.name}",
                "name": source.stem,
            }
        )

    PHOTO_DATA.write_text(
        "window.PHOTO_LIST = "
        + json.dumps(items, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Updated {len(items)} photos")


if __name__ == "__main__":
    main()
