"""Experiência online: barra de atalhos, escala em telas estreitas, sem rolagem horizontal."""
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright

URL = (Path(__file__).resolve().parents[1] / "index.html").as_uri()


class ScreenExperience(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def open(self, width, height=844):
        page = self.browser.new_page(viewport={"width": width, "height": height})
        page.goto(URL)
        page.wait_for_selector("html.ready", state="attached", timeout=20000)
        return page

    def test_toolbar_has_shortcuts_and_save_button(self):
        page = self.open(1280)
        labels = page.eval_on_selector_all(".toolbar a", "els => els.map(e => e.textContent.trim())")
        self.assertEqual(labels, ["Capa", "Linha Vime", "Linha Palha"])
        self.assertEqual(page.locator(".toolbar button").inner_text().strip(), "Salvar PDF")
        hrefs = page.eval_on_selector_all(".toolbar a", "els => els.map(e => e.getAttribute('href'))")
        for href in hrefs:
            self.assertEqual(page.locator(f'[id="{href[1:]}"]').count(), 1, href)

    def test_no_horizontal_scroll_on_phone_width(self):
        for width in (360, 390, 768):
            with self.subTest(width=width):
                page = self.open(width)
                self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"), width)
                page_width = page.evaluate("document.querySelector('.page').getBoundingClientRect().width")
                self.assertLessEqual(page_width, width)

    def test_pages_keep_full_a4_width_on_wide_screens(self):
        page = self.open(1600)
        width = page.evaluate("document.querySelector('.page').getBoundingClientRect().width")
        self.assertAlmostEqual(width, 210 / 25.4 * 96, delta=1)

    def test_toolbar_is_hidden_when_printing(self):
        page = self.open(1280)
        page.emulate_media(media="print")
        self.assertEqual(page.evaluate("getComputedStyle(document.querySelector('.toolbar')).display"), "none")


if __name__ == "__main__":
    unittest.main()
