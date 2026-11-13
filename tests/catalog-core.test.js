const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../js/catalog-core.js");
const CATALOG = require("../js/data.js");

const close = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test("buildWhatsAppUrl encodes accents and keeps the exclamation mark", () => {
  assert.equal(
    core.buildWhatsAppUrl("5527999222048", "Guirlanda Laços de Amor"),
    "https://wa.me/5527999222048?text=Quero%20comprar%20a%20Guirlanda%20La%C3%A7os%20de%20Amor!"
  );
});

test("photoBlock solves the width for portrait details (lacos-de-amor)", () => {
  const b = core.photoBlock({ heightMm: 175, gapMm: 3, fullRatio: 1.25, detailRatios: [1088 / 1445, 1088 / 1446] });
  close(b.widthMm, 118.8, 0.1);
});

test("photoBlock solves the width for landscape details (encanto)", () => {
  const b = core.photoBlock({ heightMm: 175, gapMm: 3, fullRatio: 1.25, detailRatios: [1445 / 1088, 1445 / 1088] });
  close(b.widthMm, 147.2, 0.1);
});

test("photoBlock closes the fixed height for every catalog product", () => {
  for (const p of CATALOG.products) {
    const { full, detail1, detail2 } = p.photos;
    const b = core.photoBlock({
      heightMm: 175,
      gapMm: 3,
      fullRatio: full.w / full.h,
      detailRatios: [detail1.w / detail1.h, detail2.w / detail2.h],
    });
    close(b.fullHeightMm + 3 + b.detailsHeightMm, 175, 0.01);
    assert.ok(b.widthMm > 110 && b.widthMm < 155, `${p.title}: ${b.widthMm}`);
  }
});

test("isRenderable is false when a photo is missing and true for the catalog", () => {
  const photo = { src: "assets/img/x.jpg", w: 10, h: 10 };
  assert.equal(core.isRenderable({ photos: { full: photo, detail1: photo } }), false);
  assert.equal(core.isRenderable({ photos: { full: photo, detail1: photo, detail2: { src: "", w: 10, h: 10 } } }), false);
  assert.equal(core.isRenderable({}), false);
  for (const p of CATALOG.products) assert.equal(core.isRenderable(p), true, p.title);
});

test("formatPrice uses the Brazilian format", () => {
  assert.equal(core.formatPrice(80), "R$ 80,00");
  assert.equal(core.formatPrice(140), "R$ 140,00");
});

test("catalog data keeps the agreed order, values and no banned words", () => {
  assert.deepEqual(
    CATALOG.products.map((p) => [p.title, p.line, p.size, p.price]),
    [
      ["Guirlanda Laços de Amor", "vime", "40 cm", 140],
      ["Guirlanda Resplendor", "palha", "40 cm", 120],
      ["Guirlanda Encanto", "palha", "30 cm", 100],
      ["Guirlanda Luz", "palha", "25 cm", 80],
    ]
  );
  assert.equal(CATALOG.whatsapp, "5527999222048");
  assert.deepEqual(CATALOG.lines.map((l) => l.key), ["vime", "palha"]);
  const text = JSON.stringify(CATALOG).toLowerCase();
  assert.ok(!text.includes("premium"));
  assert.ok(!text.includes("primeira qualidade"));
});
