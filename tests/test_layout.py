"""Robustez do layout: títulos longos e fotos que não carregam (achados da revisão final)."""
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT / "index.html").as_uri()
DATA_JS = (ROOT / "js" / "data.js").read_text(encoding="utf-8")

TITLES = {
    "two_lines": "Guirlanda Natalina Especial Luz Dourada & Amor",
    "very_long": "Guirlanda Natalina Especial Luz Dourada & Amor Eterno com Laços de Veludo e Pinhas Prateadas <b>#1</b>",
}


class Layout(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def open(self, title=None, block=None, width=1280):
        page = self.browser.new_page(viewport={"width": width, "height": 900})
        if title:
            page.route("**/js/data.js", lambda r: r.fulfill(
                body=DATA_JS.replace("Guirlanda Luz", title), content_type="application/javascript"))
        if block:
            page.route(block, lambda r: r.abort())
        page.goto(URL)
        page.wait_for_selector("html.ready", state="attached", timeout=20000)
        return page

    def cta_geometry(self, page, title):
        return page.evaluate(
            """(t) => {
              const pg = [...document.querySelectorAll('.page--product')].find(p => p.querySelector('.head__title').textContent === t);
              const cta = pg.querySelector('.cta').getBoundingClientRect();
              const frame = pg.querySelector('.page__frame').getBoundingClientRect();
              const link = pg.querySelector('.cta');
              return {ctaBottom: cta.bottom, frameBottom: frame.bottom, textFits: link.scrollHeight <= link.clientHeight + 1,
                      overflow: document.documentElement.getAttribute('data-overflow')};
            }""", title)

    def test_long_titles_keep_the_button_inside_the_frame(self):
        for name, title in TITLES.items():
            with self.subTest(title=name):
                page = self.open(title=title)
                g = self.cta_geometry(page, title)
                self.assertLessEqual(g["ctaBottom"], g["frameBottom"] - 2, g)
                self.assertTrue(g["textFits"], g)
                self.assertEqual(g["overflow"], "", g)

    def test_long_title_is_not_injected_as_html(self):
        title = TITLES["very_long"]
        page = self.open(title=title)
        self.assertEqual(page.locator("b").count(), 0)

    def test_product_with_a_missing_photo_file_is_omitted(self):
        page = self.open(block="**/2-encanto-detail2.jpg")
        self.assertEqual(page.locator(".page").count(), 11)  # capa + 10 produtos
        self.assertEqual(page.locator('[id="2-encanto"]').count(), 0)
        labels = page.eval_on_selector_all(".toolbar a", "els => els.map(e => e.textContent.trim())")
        self.assertEqual(labels, ["Capa", "Enfeites", "Linha Vime", "Linha Palha"])
        broken = page.evaluate("[...document.images].filter(i => !i.naturalWidth).length")
        self.assertEqual(broken, 0)

    def product(self, page, title):
        return page.locator(".page--product", has=page.locator(".head__title", has_text=title)).first

    def test_enfeites_come_first_after_the_cover_in_the_agreed_order(self):
        page = self.open()
        titles = page.eval_on_selector_all(".page--product .head__title", "els => els.map(e => e.textContent)")
        self.assertEqual(titles[:7], [
            "Enfeite Poesia", "Enfeite Encanto Silvestre", "Enfeite Aconchego", "Enfeite Doce Magia",
            "Enfeite Memórias", "Escapulário Bosque Encantado", "Escapulário Jardim de Natal"])
        self.assertEqual(titles[7:], ["Guirlanda Laços de Amor", "Guirlanda Resplendor", "Guirlanda Encanto", "Guirlanda Luz"])

    def test_enfeite_page_shows_burgundy_theme_price_and_button_but_no_size(self):
        page = self.open()
        pg = self.product(page, "Enfeite Doce Magia")
        self.assertIn("theme-bordo", pg.get_attribute("class"))
        self.assertEqual(pg.locator(".head__line").inner_text(), "ESCAPULÁRIOS E OUTROS ENFEITES")
        self.assertEqual(pg.locator(".info__size").count(), 0)
        self.assertEqual(pg.locator(".info__value--price").inner_text(), "R$ 58,00")
        self.assertEqual(pg.locator(".cta").inner_text().strip(), "Pedir Doce Magia")
        self.assertIn("Quero%20comprar%20o%20Enfeite%20Doce%20Magia!", pg.locator(".cta").get_attribute("href"))
        bg = page.evaluate("getComputedStyle(document.querySelector('.theme-bordo')).getPropertyValue('--bg').trim()")
        self.assertEqual(bg, "#4a1823")

    def test_every_page_fits_and_no_photo_is_distorted(self):
        page = self.open()
        self.assertEqual(page.evaluate("document.documentElement.getAttribute('data-overflow')"), "")
        bad = page.evaluate("""[...document.querySelectorAll('.page--product .photo')].filter(i => {
            const r = i.getBoundingClientRect();
            return Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) > 0.01 * (i.naturalWidth / i.naturalHeight);
        }).map(i => i.getAttribute('src'))""")
        self.assertEqual(bad, [])

    def test_poesia_has_the_full_photo_and_a_single_detail(self):
        page = self.open()
        pg = self.product(page, "Enfeite Poesia")
        self.assertEqual(pg.locator("img.photo").count(), 2)
        full = pg.locator(".photo--full").bounding_box()
        detail = pg.locator(".photo--detail").bounding_box()
        self.assertAlmostEqual(full["width"], detail["width"], delta=1)  # sem lacunas laterais

    def test_overflow_check_flags_a_button_pushed_onto_the_frame(self):
        page = self.open()
        page.add_style_tag(content=".page--product .head { padding-bottom: 25mm; }")
        flagged = page.evaluate("globalThis.overflowingPages().length")
        self.assertGreater(flagged, 0)


if __name__ == "__main__":
    unittest.main()
