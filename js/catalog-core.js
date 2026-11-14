/* Funções puras do catálogo. Script clássico: funciona por file:// no navegador
   (globalThis.CatalogCore) e em testes Node (module.exports). */
(function () {
  "use strict";

  /* article: "a" (padrão, guirlandas) ou "o" (enfeites e escapulários). */
  function buildWhatsAppUrl(number, title, article) {
    var message = "Quero comprar " + (article || "a") + " " + title + "!";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }

  /* Bloco de fotos: foto principal em cima (proporção real), abaixo uma linha com
     um ou dois detalhes na mesma altura, cada um com largura proporcional à sua
     proporção. A altura total é fixa; a largura W é o que sobra para resolver:
       H = W/fullRatio + gap + (W - (n-1)*gap)/(soma das proporções dos detalhes) */
  function photoBlock(o) {
    var rsum = o.detailRatios.reduce(function (a, b) { return a + b; }, 0);
    var inner = (o.detailRatios.length - 1) * o.gapMm; // espaço entre detalhes
    var widthMm = (o.heightMm - o.gapMm + inner / rsum) / (1 / o.fullRatio + 1 / rsum);
    return {
      widthMm: widthMm,
      fullHeightMm: widthMm / o.fullRatio,
      detailsHeightMm: (widthMm - inner) / rsum,
    };
  }

  function hasPhoto(photo) {
    return !!(photo && photo.src && photo.w > 0 && photo.h > 0);
  }

  /* Exige a foto principal e o detalhe 1; o detalhe 2 é opcional, mas se existir tem de ser válido. */
  function isRenderable(product) {
    var photos = product && product.photos;
    if (!photos || !hasPhoto(photos.full) || !hasPhoto(photos.detail1)) return false;
    return photos.detail2 === undefined || hasPhoto(photos.detail2);
  }

  /* Texto do botão: o do produto, se houver; senão "Pedir a <título>". */
  function ctaLabel(product) {
    return product.ctaLabel || "Pedir a " + product.title;
  }

  function formatPrice(value) {
    var parts = value.toFixed(2).split(".");
    var int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "R$ " + int + "," + parts[1];
  }

  var api = {
    buildWhatsAppUrl: buildWhatsAppUrl,
    photoBlock: photoBlock,
    isRenderable: isRenderable,
    ctaLabel: ctaLabel,
    formatPrice: formatPrice,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalThis.CatalogCore = api;
})();
