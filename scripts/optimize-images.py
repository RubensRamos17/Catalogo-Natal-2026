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

MAX_SIDE = 1600
QUALITY = 85
PHOTO = re.compile(r"^\d+-.+-(full|detail1|detail2)\.png$")


def main(src_dir: str, dst_dir: str) -> None:
    src, dst = Path(src_dir), Path(dst_dir)
    dst.mkdir(parents=True, exist_ok=True)
    for png in sorted(src.glob("*.png")):
        if not PHOTO.match(png.name):
            continue
        with Image.open(png) as im:
            im = im.convert("RGB")
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
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
