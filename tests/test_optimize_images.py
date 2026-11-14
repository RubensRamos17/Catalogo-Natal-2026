import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path("/mnt/user-data/uploads")
DST = ROOT / "assets" / "img"
KINDS = ["full", "detail1", "detail2"]
PHOTOS = {name: KINDS for name in [
    "4-lacos-de-amor", "1-resplendor", "2-encanto", "3-luz",
    "7-doce-magia", "8-memorias", "9-bosque-encantado", "10-encanto-silvestre",
    "12-jardim-de-natal", "13-aconchego",
]}
PHOTOS["11-poesia"] = ["full", "detail1"]  # só um detalhe


class OptimizedImages(unittest.TestCase):
    def test_every_photo_is_downsized_and_keeps_its_aspect_ratio(self):
        for name, kinds in PHOTOS.items():
            for kind in kinds:
                with self.subTest(photo=f"{name}-{kind}"):
                    out = DST / f"{name}-{kind}.jpg"
                    self.assertTrue(out.exists(), f"missing {out.name}")
                    w, h = Image.open(out).size
                    w0, h0 = Image.open(SRC / f"{name}-{kind}.png").size
                    self.assertLessEqual(max(w, h), 1200 if kind == "full" else 1000)
                    self.assertLess(abs(w / h - w0 / h0), 0.005)

    def test_logo_keeps_transparency(self):
        logo = DST / "logo-guirlandas.png"
        self.assertTrue(logo.exists(), "missing logo-guirlandas.png")
        self.assertEqual(Image.open(logo).mode, "RGBA")

    def test_total_weight_is_light_enough_for_whatsapp(self):
        total = sum(p.stat().st_size for p in DST.glob("*") if p.is_file())
        self.assertGreater(total, 0)
        self.assertLess(total, 7 * 1024 * 1024)  # PDF final < 10 MB, com folga para novas peças


if __name__ == "__main__":
    unittest.main()
