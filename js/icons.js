/* Ícones e ornamentos em SVG inline (sem arquivos externos, nítidos em qualquer zoom). */
(function () {
  "use strict";

  var S = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

  var cash =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2" ' + S + '/>' +
    '<circle cx="12" cy="12" r="2.8" ' + S + '/><path d="M6 9.6v.01M18 14.4v.01" ' + S + '/></svg>';

  var pix =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.4" y="5.4" width="13.2" height="13.2" rx="2.4" ' +
    'transform="rotate(45 12 12)" ' + S + '/><path d="M12 9l3 3-3 3-3-3z" fill="currentColor"/></svg>';

  var card =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.2" ' + S + '/>' +
    '<path d="M2.5 9.6h19M6 15h4" ' + S + '/></svg>';

  var star =
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0l2.1 7.9L20 10l-7.9 2.1L10 20l-2.1-7.9L0 10l7.9-2.1z" fill="currentColor"/></svg>';

  /* Ramo vertical de folhagem: haste central com pares de folhas que diminuem para o topo. */
  function sprig() {
    var leaf = "M0 0C5 -3.6 12 -3.6 17 0C12 3.6 5 3.6 0 0Z";
    var out = '<svg viewBox="0 0 40 160" aria-hidden="true"><path d="M20 158C17 118 24 74 20 10" fill="none" stroke="currentColor" stroke-width="1.1"/>';
    for (var i = 0; i < 7; i++) {
      var y = 146 - i * 19;
      var k = 1 - i * 0.075;
      out += '<path d="' + leaf + '" fill="currentColor" transform="translate(20 ' + y + ') rotate(-35) scale(' + k + ')"/>';
      out += '<path d="' + leaf + '" fill="currentColor" transform="translate(20 ' + (y - 6) + ') rotate(-145) scale(' + k + ')"/>';
    }
    out += '<path d="' + leaf + '" fill="currentColor" transform="translate(20 12) rotate(-90) scale(.8)"/></svg>';
    return out;
  }

  globalThis.ICONS = { cash: cash, pix: pix, card: card, star: star, sprig: sprig() };
})();
