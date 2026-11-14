"""Gera o PDF do catálogo com o Chrome sem interface e confere o resultado.

Uso: python3 -I scripts/verify-pdf.py
Saída: dist/catalogo-guirlandas-natal-2026.pdf; imprime OK (exit 0) ou a lista de falhas (exit 1).
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist" / "catalogo-guirlandas-natal-2026.pdf"
A4_PT = (595.276, 841.89)
BANNED = ("premium", "primeira qualidade")
MAX_BYTES = 10 * 1024 * 1024


def run(cmd, timeout=120):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def find_chrome():
    for name in ("chromium", "chromium-browser", "google-chrome", "chrome"):
        path = shutil.which(name)
        if path:
            return path
    sys.exit("Nenhum Chrome/Chromium encontrado no PATH.")


def expected_products():
    """Produtos renderizáveis, na ordem em que as páginas saem (linha, depois lista)."""
    js = (
        "const c=require('./js/catalog-core.js'),d=require('./js/data.js');"
        "const out=[];d.lines.forEach(l=>d.products.filter(p=>p.line===l.key&&c.isRenderable(p))"
        ".forEach(p=>out.push({title:p.title,price:c.formatPrice(p.price),cta:c.ctaLabel(p),"
        "photos:Object.keys(p.photos).length,hasSize:!!p.size,"
        "url:c.buildWhatsAppUrl(d.whatsapp,p.title,p.article)})));console.log(JSON.stringify(out))"
    )
    res = run(["node", "-e", js])
    if res.returncode != 0:
        sys.exit("Falha ao ler os dados com node: " + res.stderr)
    return json.loads(res.stdout)


def chrome_base(chrome):
    return [chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
            "--virtual-time-budget=10000"]


def make_pdf(chrome):
    OUT.parent.mkdir(exist_ok=True)
    if OUT.exists():
        OUT.unlink()
    run(chrome_base(chrome) + ["--no-pdf-header-footer", f"--print-to-pdf={OUT}",
                               (ROOT / "index.html").as_uri()], timeout=180)


def dom_state():
    """Abre a página de verdade (Playwright), espera <html class="ready"> e devolve a tag <html>.
    --dump-dom do Chrome não serve: no tempo virtual, fontes e decode de imagens não terminam."""
    from playwright.sync_api import sync_playwright

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        page.goto((ROOT / "index.html").as_uri())
        try:
            page.wait_for_selector("html.ready", timeout=20000, state="attached")
        except Exception:
            pass
        tag = page.evaluate("document.documentElement.outerHTML.match(/<html[^>]*>/)[0]")
        browser.close()
    return tag


def pdf_text(page_no):
    return run(["pdftotext", "-f", str(page_no), "-l", str(page_no), "-layout", str(OUT), "-"]).stdout


def images_per_page():
    counts = {}
    for line in run(["pdfimages", "-list", str(OUT)]).stdout.splitlines()[2:]:
        cols = line.split()
        if len(cols) > 4 and cols[2] == "image" and int(cols[3]) >= 300:
            counts[int(cols[0])] = counts.get(int(cols[0]), 0) + 1
    return counts


def main():
    chrome = find_chrome()
    products = expected_products()
    failures = []
    make_pdf(chrome)
    if not OUT.exists():
        print("FALHA: o Chrome não gerou o PDF.")
        sys.exit(1)

    reader = PdfReader(str(OUT))
    pages = reader.pages
    expected_pages = 1 + len(products)
    if len(pages) != expected_pages:
        failures.append(f"páginas: {len(pages)} (esperado {expected_pages})")

    for i, page in enumerate(pages, 1):
        w, h = float(page.mediabox.width), float(page.mediabox.height)
        if abs(w - A4_PT[0]) > 1 or abs(h - A4_PT[1]) > 1:
            failures.append(f"página {i}: tamanho {w:.0f}x{h:.0f} pt (esperado A4 595x842)")

    images = images_per_page()
    for n, product in enumerate(products, 2):
        if n > len(pages):
            break
        uris = []
        for annot in pages[n - 1].get("/Annots", []) or []:
            action = annot.get_object().get("/A")
            if action and action.get("/URI"):
                uris.append(str(action["/URI"]))
        if uris != [product["url"]]:
            failures.append(f"{product['title']}: links {uris} (esperado [{product['url']}])")
        if images.get(n, 0) < product["photos"]:
            failures.append(f"{product['title']}: {images.get(n, 0)} imagens no PDF (esperado >= {product['photos']})")
        text = pdf_text(n)
        for needle in (product["title"], product["price"], product["cta"]):
            if needle not in text:
                failures.append(f"{product['title']}: texto '{needle}' ausente na página {n}")
        if ("de diâmetro" in text) != product["hasSize"]:
            failures.append(f"{product['title']}: bloco de tamanho {'ausente' if product['hasSize'] else 'inesperado'} na página {n}")

    everything = pdf_text(1) + "".join(pdf_text(i) for i in range(2, len(pages) + 1))
    for word in BANNED:
        if word in everything.lower():
            failures.append(f"texto proibido no PDF: '{word}'")

    if OUT.stat().st_size >= MAX_BYTES:
        failures.append(f"PDF pesado: {OUT.stat().st_size / 1e6:.1f} MB (limite 10 MB)")

    state = dom_state()
    if 'class="ready"' not in state:
        failures.append("a página não ficou pronta (classe 'ready' ausente)")
    match = re.search(r'data-overflow="([^"]*)"', state)
    if match is None:
        failures.append("medição de estouro ausente (data-overflow)")
    elif match.group(1):
        failures.append("conteúdo estoura a página: " + match.group(1))

    if failures:
        print("FALHAS:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print(f"OK — {len(pages)} páginas, {OUT.stat().st_size / 1e6:.1f} MB, {OUT}")


if __name__ == "__main__":
    main()
