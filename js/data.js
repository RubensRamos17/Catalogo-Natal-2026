/* Dados do catálogo. Para incluir um produto, acrescente um item em `products`
   (as 3 fotos precisam existir em assets/img; sem elas o produto é ignorado).
   Para trocar preços ou textos, edite aqui; o layout não muda. */
(function () {
  "use strict";

  function photos(base, dims) {
    function p(kind, d) {
      return { src: "assets/img/" + base + "-" + kind + ".jpg", w: d[0], h: d[1] };
    }
    var out = { full: p("full", dims[0]), detail1: p("detail1", dims[1]) };
    if (dims[2]) out.detail2 = p("detail2", dims[2]); // peças com um detalhe só
    return out;
  }

  var CATALOG = {
    whatsapp: "5527999222048",
    lines: [
      { key: "enfeites", label: "ESCAPULÁRIOS E OUTROS ENFEITES", theme: "bordo", nav: "Enfeites" },
      { key: "vime", label: "LINHA VIME", theme: "vime" },
      { key: "palha", label: "LINHA PALHA", theme: "palha" },
    ],
    products: [
      {
        id: "11-poesia",
        title: "Enfeite Poesia",
        line: "enfeites",
        article: "o",
        price: 30,
        ctaLabel: "Pedir Enfeite Poesia",
        photos: photos("11-poesia", [[1200, 960], [750, 1000]]),
      },
      {
        id: "10-encanto-silvestre",
        title: "Enfeite Encanto Silvestre",
        line: "enfeites",
        article: "o",
        price: 30,
        ctaLabel: "Pedir Enfeite Encanto Silvestre",
        photos: photos("10-encanto-silvestre", [[1200, 960], [750, 1000], [750, 1000]]),
      },
      {
        id: "13-aconchego",
        title: "Enfeite Aconchego",
        line: "enfeites",
        article: "o",
        price: 55,
        ctaLabel: "Pedir Enfeite Aconchego",
        photos: photos("13-aconchego", [[1200, 960], [750, 1000], [750, 1000]]),
      },
      {
        id: "7-doce-magia",
        title: "Enfeite Doce Magia",
        line: "enfeites",
        article: "o",
        price: 58,
        ctaLabel: "Pedir Doce Magia",
        photos: photos("7-doce-magia", [[1200, 960], [1000, 750], [750, 1000]]),
      },
      {
        id: "8-memorias",
        title: "Enfeite Memórias",
        line: "enfeites",
        article: "o",
        price: 70,
        ctaLabel: "Pedir Enfeite Memórias",
        photos: photos("8-memorias", [[1200, 960], [750, 1000], [750, 1000]]),
      },
      {
        id: "9-bosque-encantado",
        title: "Escapulário Bosque Encantado",
        line: "enfeites",
        article: "o",
        price: 70,
        ctaLabel: "Pedir Escapulário Bosque Encantado",
        photos: photos("9-bosque-encantado", [[1200, 960], [750, 1000], [750, 1000]]),
      },
      {
        id: "12-jardim-de-natal",
        title: "Escapulário Jardim de Natal",
        line: "enfeites",
        article: "o",
        price: 90,
        ctaLabel: "Pedir Escapulário Jardim de Natal",
        photos: photos("12-jardim-de-natal", [[1200, 960], [750, 1000], [750, 1000]]),
      },
      {
        id: "4-lacos-de-amor",
        title: "Guirlanda Laços de Amor",
        line: "vime",
        size: "40 cm",
        price: 140,
        photos: photos("4-lacos-de-amor", [[1200, 960], [752, 1000], [753, 1000]]),
      },
      {
        id: "1-resplendor",
        title: "Guirlanda Resplendor",
        line: "palha",
        size: "40 cm",
        price: 120,
        photos: photos("1-resplendor", [[1200, 960], [914, 1000], [914, 1000]]),
      },
      {
        id: "2-encanto",
        title: "Guirlanda Encanto",
        line: "palha",
        size: "30 cm",
        price: 100,
        photos: photos("2-encanto", [[1200, 960], [1000, 753], [1000, 753]]),
      },
      {
        id: "3-luz",
        title: "Guirlanda Luz",
        line: "palha",
        size: "25 cm",
        price: 80,
        photos: photos("3-luz", [[1200, 960], [753, 1000], [1000, 753]]),
      },
    ],
  };

  if (typeof module !== "undefined" && module.exports) module.exports = CATALOG;
  globalThis.CATALOG = CATALOG;
})();
