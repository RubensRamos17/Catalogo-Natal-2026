/* Funções puras do catálogo. Script clássico: funciona por file:// no navegador
   (globalThis.CatalogCore) e em testes Node (module.exports). */
(function () {
  "use strict";

  function buildWhatsAppUrl(number, title) {
    var message = "Quero comprar a " + title + "!";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }

  /* Bloco de fotos: foto principal em cima (proporção real), abaixo uma linha com
     os dois detalhes na mesma altura, cada um com largura proporcional à sua
     proporção. A altura total é fixa; a largura W é o que sobra para resolver:
       H = W/fullRatio + gap + (W - gap)/(r1 + r2)                                */
  function photoBlock(o) {
    var rsum = o.detailRatios[0] + o.detailRatios[1];
    var widthMm = (o.heightMm - o.gapMm + o.gapMm / rsum) / (1 / o.fullRatio + 1 / rsum);
    return {
      widthMm: widthMm,
      fullHeightMm: widthMm / o.fullRatio,
      detailsHeightMm: (widthMm - o.gapMm) / rsum,
    };
  }

  function hasPhoto(photo) {
    return !!(photo && photo.src && photo.w > 0 && photo.h > 0);
  }

  function isRenderable(product) {
    var photos = product && product.photos;
    return !!photos && hasPhoto(photos.full) && hasPhoto(photos.detail1) && hasPhoto(photos.detail2);
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
    formatPrice: formatPrice,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalThis.CatalogCore = api;
})();
