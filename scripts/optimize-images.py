"""Gera JPEGs leves a partir das fotos originais do catálogo.

Uso: python3 -I scripts/optimize-images.py [PASTA_ORIGINAIS] [PASTA_DESTINO]

Processa todo arquivo `<id>-<nome>-(full|detail1|detail2).png`, então produtos
novos entram sem mexer no script. Os originais nunca são alterados.
"""
import re
import shutil
import sys
from pathlib import Path

from PIL import Image

MAX_SIDE = {"full": 1200, "detail": 1000}  # px no maior lado; o PDF fica abaixo de 10 MB
QUALITY = 80
PHOTO = re.compile(r"^\d+-.+-(full|detail1|detail2)\.png$")


def main(src_dir: str, dst_dir: str) -> None:
    src, dst = Path(src_dir), Path(dst_dir)
    dst.mkdir(parents=True, exist_ok=True)
    for png in sorted(src.glob("*.png")):
        if not PHOTO.match(png.name):
            continue
        with Image.open(png) as im:
            im = im.convert("RGB")
            side = MAX_SIDE["full" if png.stem.endswith("-full") else "detail"]
            im.thumbnail((side, side), Image.LANCZOS)
            im.save(dst / f"{png.stem}.jpg", "JPEG", quality=QUALITY, optimize=True)
    logo = src / "Logo-guirlandas.png"
    if logo.exists():
        shutil.copyfile(logo, dst / "logo-guirlandas.png")


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    main(
        sys.argv[1] if len(sys.argv) > 1 else "/mnt/user-data/uploads",
        sys.argv[2] if len(sys.argv) > 2 else str(root / "assets" / "img"),
    )
