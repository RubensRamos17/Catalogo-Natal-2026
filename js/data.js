/* Dados do catálogo. Para incluir um produto, acrescente um item em `products`
   (as 3 fotos precisam existir em assets/img; sem elas o produto é ignorado).
   Para trocar preços ou textos, edite aqui; o layout não muda. */
(function () {
  "use strict";

  function photos(base, dims) {
    function p(kind, d) {
      return { src: "assets/img/" + base + "-" + kind + ".jpg", w: d[0], h: d[1] };
    }
    return { full: p("full", dims[0]), detail1: p("detail1", dims[1]), detail2: p("detail2", dims[2]) };
  }

  var CATALOG = {
    whatsapp: "5527999222048",
    lines: [
      { key: "vime", label: "LINHA VIME", theme: "vime" },
      { key: "palha", label: "LINHA PALHA", theme: "palha" },
    ],
    products: [
      {
        id: "4-lacos-de-amor",
        title: "Guirlanda Laços de Amor",
        line: "vime",
        size: "40 cm",
        price: 140,
        photos: photos("4-lacos-de-amor", [[1402, 1122], [1088, 1446], [1088, 1445]]),
      },
      {
        id: "1-resplendor",
        title: "Guirlanda Resplendor",
        line: "palha",
        size: "40 cm",
        price: 120,
        photos: photos("1-resplendor", [[1402, 1122], [1199, 1312], [1199, 1312]]),
      },
      {
        id: "2-encanto",
        title: "Guirlanda Encanto",
        line: "palha",
        size: "30 cm",
        price: 100,
        photos: photos("2-encanto", [[1402, 1122], [1445, 1088], [1445, 1088]]),
      },
      {
        id: "3-luz",
        title: "Guirlanda Luz",
        line: "palha",
        size: "25 cm",
        price: 80,
        photos: photos("3-luz", [[1402, 1122], [1088, 1445], [1445, 1088]]),
      },
    ],
  };

  if (typeof module !== "undefined" && module.exports) module.exports = CATALOG;
  globalThis.CATALOG = CATALOG;
})();
