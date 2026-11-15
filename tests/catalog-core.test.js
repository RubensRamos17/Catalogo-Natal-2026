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

test("photoBlock solves the width for a single portrait detail (poesia)", () => {
  const b = core.photoBlock({ heightMm: 175, gapMm: 3, fullRatio: 1.25, detailRatios: [0.75] });
  close(b.widthMm, 80.6, 0.1);
  close(b.fullHeightMm + 3 + b.detailsHeightMm, 175, 0.01);
});

test("photoBlock closes the fixed height for every catalog product", () => {
  for (const p of CATALOG.products) {
    const { full, detail1, detail2 } = p.photos;
    const details = [detail1, detail2].filter(Boolean);
    const b = core.photoBlock({
      heightMm: 175,
      gapMm: 3,
      fullRatio: full.w / full.h,
      detailRatios: details.map((d) => d.w / d.h),
    });
    close(b.fullHeightMm + 3 + b.detailsHeightMm, 175, 0.01);
    const min = details.length === 1 ? 70 : 110;
    assert.ok(b.widthMm > min && b.widthMm < 155, `${p.title}: ${b.widthMm}`);
  }
});

test("buildWhatsAppUrl uses the masculine article when the product asks for it", () => {
  assert.equal(
    core.buildWhatsAppUrl("5527999222048", "Enfeite Poesia", "o"),
    "https://wa.me/5527999222048?text=Quero%20comprar%20o%20Enfeite%20Poesia!"
  );
});

test("ctaLabel uses the product's own text and falls back to 'Pedir a <título>'", () => {
  assert.equal(core.ctaLabel({ title: "Guirlanda Luz" }), "Pedir a Guirlanda Luz");
  assert.equal(core.ctaLabel({ title: "Enfeite Doce Magia", ctaLabel: "Pedir Doce Magia" }), "Pedir Doce Magia");
});

test("isRenderable accepts one detail but never a broken second detail", () => {
  const photo = { src: "assets/img/x.jpg", w: 10, h: 10 };
  assert.equal(core.isRenderable({ photos: { full: photo, detail1: photo } }), true);
  assert.equal(core.isRenderable({ photos: { full: photo, detail1: photo, detail2: { src: "", w: 10, h: 10 } } }), false);
  assert.equal(core.isRenderable({ photos: { full: photo } }), false);
});

test("isRenderable is false when a photo is missing and true for the catalog", () => {
  const photo = { src: "assets/img/x.jpg", w: 10, h: 10 };
  assert.equal(core.isRenderable({ photos: { detail1: photo, detail2: photo } }), false);
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
      ["Enfeite Poesia", "enfeites", undefined, 30],
      ["Enfeite Encanto Silvestre", "enfeites", undefined, 40],
      ["Enfeite Sereno Encanto", "enfeites", undefined, 53],
      ["Enfeite Aconchego", "enfeites", undefined, 55],
      ["Enfeite Doce Magia", "enfeites", undefined, 58],
      ["Enfeite Memórias", "enfeites", undefined, 70],
      ["Escapulário Bosque Encantado", "enfeites", undefined, 70],
      ["Escapulário Jardim de Natal", "enfeites", undefined, 90],
      ["Guirlanda Laços de Amor", "vime", "40 cm", 140],
      ["Guirlanda Reluzir", "vime", "30 cm", 100],
      ["Guirlanda Essência", "vime", "40 cm", 120],
      ["Guirlanda Resplendor", "palha", "40 cm", 120],
      ["Guirlanda Encanto", "palha", "30 cm", 100],
      ["Guirlanda Luz", "palha", "25 cm", 80],
    ]
  );
  assert.equal(CATALOG.whatsapp, "5527999222048");
  assert.deepEqual(CATALOG.lines.map((l) => l.key), ["enfeites", "vime", "palha"]);
  const text = JSON.stringify(CATALOG).toLowerCase();
  assert.ok(!text.includes("premium"));
  assert.ok(!text.includes("primeira qualidade"));
});

test("enfeites use the user's button texts and the masculine article; poesia has one detail", () => {
  const by = (t) => CATALOG.products.find((p) => p.title === t);
  const labels = {
    "Enfeite Poesia": "Pedir Enfeite Poesia",
    "Enfeite Encanto Silvestre": "Pedir Enfeite Encanto Silvestre",
    "Enfeite Sereno Encanto": "Pedir Sereno Encanto",
    "Enfeite Aconchego": "Pedir Enfeite Aconchego",
    "Enfeite Doce Magia": "Pedir Doce Magia",
    "Enfeite Memórias": "Pedir Enfeite Memórias",
    "Escapulário Bosque Encantado": "Pedir Escapulário Bosque Encantado",
    "Escapulário Jardim de Natal": "Pedir Escapulário Jardim de Natal",
  };
  for (const [title, label] of Object.entries(labels)) {
    assert.equal(core.ctaLabel(by(title)), label, title);
    assert.equal(by(title).article, "o", title);
  }
  assert.equal(by("Enfeite Poesia").photos.detail2, undefined);
  assert.ok(by("Enfeite Aconchego").photos.detail2);
  assert.equal(core.ctaLabel(by("Guirlanda Luz")), "Pedir a Guirlanda Luz");
});

test("reluzir announces its lighting, essencia does not; both use the 'Pedir Guirlanda' buttons", () => {
  const by = (t) => CATALOG.products.find((p) => p.title === t);
  assert.equal(by("Guirlanda Reluzir").feature, "Com iluminação");
  assert.equal(by("Guirlanda Essência").feature, undefined);
  assert.equal(core.ctaLabel(by("Guirlanda Reluzir")), "Pedir Guirlanda Reluzir");
  assert.equal(core.ctaLabel(by("Guirlanda Essência")), "Pedir Guirlanda Essência");
  assert.equal(by("Guirlanda Reluzir").article, undefined); // "Quero comprar a Guirlanda Reluzir!"
});

test("closing page data: lighting costs R$ 10 and the contact number is formatted", () => {
  assert.equal(CATALOG.lighting.price, 10);
  assert.equal(core.formatPrice(CATALOG.lighting.price), "R$ 10,00");
  assert.ok(core.isRenderable({ photos: { full: CATALOG.lighting.photo, detail1: CATALOG.lighting.photo } }));
  assert.equal(core.formatPhone(CATALOG.whatsapp), "(27) 99922-2048");
});
