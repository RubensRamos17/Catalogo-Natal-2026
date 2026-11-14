/* Monta as páginas do catálogo a partir de window.CATALOG. Script clássico (file://). */
(function () {
  "use strict";

  var PHOTOS_HEIGHT_MM = 175;
  var PHOTOS_GAP_MM = 3;
  var STARS = [
    [9, 12, 1.6], [86, 9, 1.2], [93, 24, 1.8], [18, 31, 1.2], [78, 46, 1.4], [6, 52, 1.2],
    [92, 63, 1.4], [14, 74, 1.8], [84, 84, 1.2], [30, 90, 1.2], [70, 93, 1.6], [50, 5, 1.2],
  ];

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function text(tag, className, value) {
    var node = el(tag, className);
    node.textContent = value;
    return node;
  }

  function frame() {
    return el("div", "page__frame");
  }

  function renderCover() {
    var page = el("section", "page page--cover");
    page.id = "capa";
    STARS.forEach(function (s) {
      var star = el("span", "cover__star", ICONS.star);
      star.style.cssText = "left:" + s[0] + "%;top:" + s[1] + "%;width:" + s[2] + "mm;height:" + s[2] + "mm";
      page.appendChild(star);
    });
    ["a", "b", "c"].forEach(function (k) { page.appendChild(el("div", "cover__orb cover__orb--" + k)); });
    page.appendChild(el("div", "cover__ring cover__ring--outer"));
    page.appendChild(el("div", "cover__ring cover__ring--inner"));
    page.appendChild(frame());

    var panel = el("div", "cover__panel");
    var logo = el("img", "cover__logo");
    logo.src = "assets/img/logo-guirlandas.png";
    logo.alt = "Coleção Guirlandas Artesanais";
    panel.appendChild(logo);
    page.appendChild(panel);

    var copy = el("div", "cover__copy");
    copy.appendChild(text("p", "cover__year", "NATAL 2026"));
    copy.appendChild(text("p", "cover__tagline", "Peças que acolhem. Detalhes que encantam."));
    copy.appendChild(el("span", "cover__dot"));
    copy.appendChild(text("p", "cover__brand", "GUIRLANDAS ARTESANAIS"));
    page.appendChild(copy);

    page.appendChild(text("p", "cover__foot", "Coleção especial de Natal"));
    return page;
  }

  function renderProduct(data, product, line) {
    var core = globalThis.CatalogCore;
    var ph = product.photos;
    var ratio = function (p) { return p.w / p.h; };
    var block = core.photoBlock({
      heightMm: PHOTOS_HEIGHT_MM,
      gapMm: PHOTOS_GAP_MM,
      fullRatio: ratio(ph.full),
      detailRatios: [ratio(ph.detail1), ratio(ph.detail2)],
    });

    var page = el("section", "page page--product theme-" + line.theme);
    page.id = product.id;
    page.appendChild(frame());
    var inner = el("div", "page__inner");
    page.appendChild(inner);

    var head = el("header", "head");
    head.appendChild(text("p", "head__eyebrow", "COLEÇÃO NATALINA"));
    head.appendChild(el("div", "head__rule"));
    head.appendChild(text("p", "head__line", line.label));
    head.appendChild(text("h2", "head__title", product.title));
    var sub = el("p", "head__sub");
    sub.appendChild(text("span", "head__model", "Modelo Exclusivo"));
    sub.appendChild(text("span", "seal", "Pronta entrega"));
    head.appendChild(sub);
    inner.appendChild(head);

    var stage = el("div", "stage");
    stage.style.setProperty("--photos-w", block.widthMm.toFixed(2) + "mm");
    stage.style.setProperty("--photos-h", PHOTOS_HEIGHT_MM + "mm");
    stage.appendChild(el("div", "stage__orn stage__orn--left", ICONS.sprig));
    var photos = el("div", "photos");
    var photo = function (p, cls, alt) {
      var img = el("img", "photo " + cls);
      img.src = p.src;
      img.width = p.w;
      img.height = p.h;
      img.alt = alt;
      img.style.flex = ratio(p).toFixed(4) + " 1 0";
      return img;
    };
    var full = photo(ph.full, "photo--full", product.title);
    full.style.flex = "none";
    photos.appendChild(full);
    var row = el("div", "photos__row");
    row.appendChild(photo(ph.detail1, "photo--detail", "Detalhe 1 — " + product.title));
    row.appendChild(photo(ph.detail2, "photo--detail", "Detalhe 2 — " + product.title));
    photos.appendChild(row);
    stage.appendChild(photos);
    stage.appendChild(el("div", "stage__orn stage__orn--right", ICONS.sprig));
    inner.appendChild(stage);

    var info = el("div", "info");
    var size = el("div", "info__size");
    size.appendChild(text("span", "info__label", "TAMANHO"));
    var sizeValue = text("strong", "info__value", product.size);
    sizeValue.appendChild(text("small", "", " de diâmetro"));
    size.appendChild(sizeValue);
    var price = el("div", "info__price");
    price.appendChild(text("span", "info__label", "VALOR"));
    price.appendChild(text("strong", "info__value info__value--price", core.formatPrice(product.price)));
    info.appendChild(size);
    info.appendChild(price);
    inner.appendChild(info);

    var pay = el("div", "pay");
    [["cash", "Dinheiro"], ["pix", "Pix"], ["card", "Cartão até 6x (+ taxa)"]].forEach(function (m) {
      var item = el("span", "pay__item", '<span class="pay__icon">' + ICONS[m[0]] + "</span>");
      item.appendChild(text("span", "", m[1]));
      pay.appendChild(item);
    });
    inner.appendChild(pay);

    var cta = text("a", "cta", "Pedir a " + product.title);
    cta.href = core.buildWhatsAppUrl(data.whatsapp, product.title);
    cta.target = "_blank";
    cta.rel = "noopener";
    inner.appendChild(cta);
    return page;
  }

  function renderCatalog(root, data) {
    var core = globalThis.CatalogCore;
    root.textContent = "";
    root.appendChild(renderCover());
    data.lines.forEach(function (line) {
      data.products.forEach(function (product) {
        if (product.line !== line.key) return;
        if (!core.isRenderable(product)) {
          console.warn("Produto ignorado (faltam fotos):", product.id);
          return;
        }
        root.appendChild(renderProduct(data, product, line));
      });
    });
  }

  /* Marca <html class="ready"> quando fontes e imagens terminaram de carregar,
     para a impressão/verificação não pegar a página pela metade. */
  function markReadyWhenLoaded() {
    var decodes = Array.prototype.map.call(document.images, function (img) {
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    });
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return Promise.all([fonts].concat(decodes)).then(function () {
      fitTitles();
      document.documentElement.setAttribute("data-overflow", overflowingPages().join(","));
      document.documentElement.classList.add("ready");
    });
  }

  /* Título longo: reduz a fonte (até 16pt) até caber em uma linha; se ainda assim
     passar, ficam duas linhas pequenas. Evita empurrar o botão para fora da página. */
  function fitTitles() {
    Array.prototype.forEach.call(document.querySelectorAll(".head__title"), function (title) {
      var size = parseFloat(getComputedStyle(title).fontSize) * 0.75; // px -> pt
      var oneLine = function () { return title.scrollHeight <= parseFloat(getComputedStyle(title).lineHeight) + 1; };
      while (!oneLine() && size > 16) {
        size -= 1;
        title.style.fontSize = size + "pt";
      }
    });
  }

  /* ids das páginas de produto cujo conteúdo estoura o A4 ou cujo botão passa da moldura
     (usado por scripts/verify-pdf.py e pelos testes). */
  function overflowingPages() {
    return Array.prototype.filter
      .call(document.querySelectorAll(".page"), function (page) {
        var inner = page.querySelector(".page__inner");
        var cta = page.querySelector(".cta");
        var frame = page.querySelector(".page__frame");
        var pushedOut = cta && frame && cta.getBoundingClientRect().bottom > frame.getBoundingClientRect().bottom - 2;
        return page.scrollHeight > page.clientHeight || (inner && inner.scrollHeight > inner.clientHeight) || pushedOut;
      })
      .map(function (page) { return page.id; });
  }

  /* Só entram no catálogo produtos cujas 3 fotos realmente carregam (arquivo ausente = omitido). */
  function loadableProducts(data) {
    var loads = function (src) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { resolve(true); };
        img.onerror = function () { resolve(false); };
        img.src = src;
      });
    };
    return Promise.all(
      data.products.map(function (p) {
        if (!globalThis.CatalogCore.isRenderable(p)) return false;
        return Promise.all([p.photos.full, p.photos.detail1, p.photos.detail2].map(function (f) { return loads(f.src); }))
          .then(function (r) { return r.every(Boolean); });
      })
    ).then(function (ok) {
      var kept = data.products.filter(function (p, i) {
        if (!ok[i]) console.warn("Produto ignorado (faltam fotos):", p.id);
        return ok[i];
      });
      return Object.assign({}, data, { products: kept });
    });
  }

  /* Barra só de tela: atalhos (capa e primeira página de cada linha) e "Salvar PDF". */
  function renderToolbar(root, data) {
    var bar = el("nav", "toolbar no-print");
    bar.setAttribute("aria-label", "Atalhos do catálogo");
    var add = function (label, id) {
      var a = text("a", "", label);
      a.href = "#" + id;
      bar.appendChild(a);
    };
    add("Capa", "capa");
    data.lines.forEach(function (line) {
      var first = root.querySelector(".theme-" + line.theme);
      if (first) {
        var label = line.label.toLowerCase().replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
        add(label, first.id);
      }
    });
    var save = text("button", "", "Salvar PDF");
    save.type = "button";
    save.addEventListener("click", function () { window.print(); });
    bar.appendChild(save);
    document.body.insertBefore(bar, root);
  }

  /* Reduz as páginas (210 mm) para caber em telas estreitas; nunca amplia. */
  function updateScale() {
    var pageWidthPx = (210 / 25.4) * 96;
    var available = document.documentElement.clientWidth - 16;
    var scale = Math.min(1, available / pageWidthPx);
    document.documentElement.style.setProperty("--scale", scale.toFixed(4));
  }

  globalThis.renderCatalog = renderCatalog;
  globalThis.overflowingPages = overflowingPages;

  function start() {
    var root = document.getElementById("catalog");
    if (!root || !globalThis.CATALOG) return;
    loadableProducts(globalThis.CATALOG).then(function (data) {
      renderCatalog(root, data);
      renderToolbar(root, data);
      updateScale();
      window.addEventListener("resize", updateScale);
      return markReadyWhenLoaded();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
