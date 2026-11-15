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
        photos: photos("11-poesia", [[1100, 880], [675, 900]]),
      },
      {
        id: "10-encanto-silvestre",
        title: "Enfeite Encanto Silvestre",
        line: "enfeites",
        article: "o",
        price: 40,
        ctaLabel: "Pedir Enfeite Encanto Silvestre",
        photos: photos("10-encanto-silvestre", [[1100, 880], [675, 900], [675, 900]]),
      },
      {
        id: "14-sereno-encanto",
        title: "Enfeite Sereno Encanto",
        line: "enfeites",
        article: "o",
        price: 53,
        ctaLabel: "Pedir Sereno Encanto",
        photos: photos("14-sereno-encanto", [[1100, 880], [675, 900], [675, 900]]),
      },
      {
        id: "13-aconchego",
        title: "Enfeite Aconchego",
        line: "enfeites",
        article: "o",
        price: 55,
        ctaLabel: "Pedir Enfeite Aconchego",
        photos: photos("13-aconchego", [[1100, 880], [675, 900], [675, 900]]),
      },
      {
        id: "7-doce-magia",
        title: "Enfeite Doce Magia",
        line: "enfeites",
        article: "o",
        price: 58,
        ctaLabel: "Pedir Doce Magia",
        photos: photos("7-doce-magia", [[1100, 880], [900, 675], [675, 900]]),
      },
      {
        id: "8-memorias",
        title: "Enfeite Memórias",
        line: "enfeites",
        article: "o",
        price: 70,
        ctaLabel: "Pedir Enfeite Memórias",
        photos: photos("8-memorias", [[1100, 880], [675, 900], [675, 900]]),
      },
      {
        id: "9-bosque-encantado",
        title: "Escapulário Bosque Encantado",
        line: "enfeites",
        article: "o",
        price: 70,
        ctaLabel: "Pedir Escapulário Bosque Encantado",
        photos: photos("9-bosque-encantado", [[1100, 880], [675, 900], [675, 900]]),
      },
      {
        id: "12-jardim-de-natal",
        title: "Escapulário Jardim de Natal",
        line: "enfeites",
        article: "o",
        price: 90,
        ctaLabel: "Pedir Escapulário Jardim de Natal",
        photos: photos("12-jardim-de-natal", [[1100, 880], [675, 900], [675, 900]]),
      },
      {
        id: "4-lacos-de-amor",
        title: "Guirlanda Laços de Amor",
        line: "vime",
        size: "40 cm",
        price: 140,
        photos: photos("4-lacos-de-amor", [[1100, 880], [677, 900], [678, 900]]),
      },
      {
        id: "5-reluzir",
        title: "Guirlanda Reluzir",
        line: "vime",
        feature: "Com iluminação",
        size: "30 cm",
        price: 100,
        ctaLabel: "Pedir Guirlanda Reluzir",
        photos: photos("5-reluzir", [[1100, 880], [678, 900], [675, 900]]),
      },
      {
        id: "6-essencia",
        title: "Guirlanda Essência",
        line: "vime",
        size: "40 cm",
        price: 120,
        ctaLabel: "Pedir Guirlanda Essência",
        photos: photos("6-essencia", [[1100, 880], [678, 900], [678, 900]]),
      },
      {
        id: "1-resplendor",
        title: "Guirlanda Resplendor",
        line: "palha",
        size: "40 cm",
        price: 120,
        photos: photos("1-resplendor", [[1100, 880], [822, 900], [822, 900]]),
      },
      {
        id: "2-encanto",
        title: "Guirlanda Encanto",
        line: "palha",
        size: "30 cm",
        price: 100,
        photos: photos("2-encanto", [[1100, 880], [900, 678], [900, 678]]),
      },
      {
        id: "3-luz",
        title: "Guirlanda Luz",
        line: "palha",
        size: "25 cm",
        price: 80,
        photos: photos("3-luz", [[1100, 880], [678, 900], [900, 678]]),
      },
    ],
  };

  /* Página final: iluminação opcional com fio de fada (valor adicional por guirlanda). */
  CATALOG.lighting = {
    price: 10,
    photo: { src: "assets/img/fio-de-fada.jpg", w: 900, h: 900 },
  };

  if (typeof module !== "undefined" && module.exports) module.exports = CATALOG;
  globalThis.CATALOG = CATALOG;
})();
