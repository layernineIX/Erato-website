/* ERATO bag + PayPal checkout (cards via PayPal guest checkout). Codes checked by /api/code. */
(function () {
  'use strict';
  var PAYPAL_CLIENT_ID = 'BAAXztDRMc1eYSxfBqXuVCAG414Js_lYKV0lxeTc-Pk0PkMAmkOo6TAlgrQcdASTV0jELPP2nPqqYyeF3A';
  var CURRENCY = 'USD';
  /* Discount codes are checked on our server (src/codes.js). */
  /* Shipping per order, by destination. Edit the numbers here. */
  var FREE_OVER = 100; /* Standard shipping is free when the subtotal reaches this (USD) */
  var REGIONS = {
    my:   { label: 'Malaysia', std: 0, exp: 6 },
    id:   { label: 'Indonesia', std: 0, exp: 14 },
    sea:  { label: 'Southeast Asia (Singapore, Thailand, Vietnam...)', std: 5, exp: 14 },
    asia: { label: 'Rest of Asia', std: 8, exp: 20 },
    eu:   { label: 'United Kingdom and Europe', std: 12, exp: 28 },
    na:   { label: 'United States and Canada', std: 12, exp: 28 },
    row:  { label: 'Rest of the world', std: 15, exp: 32 }
  };
  var SEA = 'SG TH VN PH BN KH LA MM TL'.split(' ');
  var ASIA = 'HK MO JP KR TW CN IN LK BD PK NP MV'.split(' ');
  var EU = 'GB IE AT BE BG HR CY CZ DK EE FI FR DE GR HU IT LV LT LU MT NL PL PT RO SK SI ES SE NO CH IS LI'.split(' ');
  function regionOf(cc) {
    if (cc === 'MY') return 'my';
    if (cc === 'ID') return 'id';
    if (SEA.indexOf(cc) > -1) return 'sea';
    if (ASIA.indexOf(cc) > -1) return 'asia';
    if (EU.indexOf(cc) > -1) return 'eu';
    if (cc === 'US' || cc === 'CA') return 'na';
    return 'row';
  }

  var KEY = 'erato_cart', RKEY = 'erato_region', MKEY = 'erato_method', CKEY = 'erato_code';
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var cart = load(KEY, []);
  var region = load(RKEY, '');
  if (!Array.isArray(cart)) cart = [];
  if (!REGIONS[region]) region = '';
  var method = load(MKEY, 'std'); if (method !== 'exp') method = 'std';
  var code = load(CKEY, ''); if (typeof code !== 'string') code = '';
  var applied = null, codeMsg = '', codeEmail = '', needEmail = false; /* applied = server-confirmed code {code,type,value,label,min} */

  function money(n) { return 'USD ' + n.toFixed(2).replace(/\.00$/, ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function subtotal() { return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0); }
  function count() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }
  function codeStatus() {
    if (!applied) return { ok: false, msg: codeMsg };
    if (applied.min && subtotal() < applied.min) return { ok: false, msg: 'This code needs a bag of at least USD ' + applied.min + '.' };
    return { ok: true, code: applied.code, d: applied };
  }
  function discount() {
    var s = codeStatus(); if (!s.ok) return 0;
    var v = s.d.type === 'percent' ? subtotal() * s.d.value / 100 : s.d.value;
    return Math.min(subtotal(), Math.round(v * 100) / 100);
  }
  function rateFor(m) { return region ? (m === 'std' && subtotal() - discount() >= FREE_OVER ? 0 : REGIONS[region][m]) : 0; }
  function shipping() { return cart.length && region ? rateFor(method) : 0; }
  function moneyFree(n) { return n === 0 ? 'Free' : money(n); }

  /* ---------- UI ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var bagBtn = document.createElement('button');
  bagBtn.className = 'bag-btn'; bagBtn.type = 'button'; bagBtn.setAttribute('aria-label', 'Open bag');
  bagBtn.innerHTML = '<svg class="bag-ico" viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 11h19l-1.4 15.2a1.6 1.6 0 0 1-1.6 1.4h-13a1.6 1.6 0 0 1-1.6-1.4L6.5 11z"/><path d="M11.5 14V9.5a4.5 4.5 0 0 1 9 0V14"/><path class="bag-fold" d="M6.8 15.6c6.2 2 12.2 2 18.4 0" opacity=".55"/></svg><span class="bag-count" aria-hidden="true">0</span>';
  if (nav) nav.insertBefore(bagBtn, toggle || null);

  var overlay = document.createElement('div'); overlay.className = 'bag-overlay'; overlay.hidden = true;
  var panel = document.createElement('aside'); panel.className = 'bag'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Your bag');
  var regionOpts = '<option value="">Choose where we ship to</option>' + Object.keys(REGIONS).map(function (k) {
    return '<option value="' + k + '">' + REGIONS[k].label + '</option>';
  }).join('');
  panel.innerHTML =
    '<div class="bag-head"><h2>Your bag</h2><button type="button" class="bag-close" aria-label="Close bag">&times;</button></div>' +
    '<div class="bag-body">' +
      '<div class="bag-empty">Your bag is empty.<br><a href="/collections">Browse the collection</a></div>' +
      '<ul class="bag-items"></ul>' +
      '<div class="bag-foot">' +
        '<label class="bag-label" for="bagRegion">Shipping to</label>' +
        '<select id="bagRegion" class="bag-select">' + regionOpts + '</select>' +
        '<fieldset class="bag-methods" id="bagMethods"><legend class="bag-label">Delivery</legend>' +
          '<label><input type="radio" name="bagMethod" value="std"><span>Standard, tracked</span><b id="mStd"></b></label>' +
          '<label><input type="radio" name="bagMethod" value="exp"><span>Express, faster courier</span><b id="mExp"></b></label>' +
        '</fieldset>' +
        '<label class="bag-label" for="bagCode">Discount code</label>' +
        '<div class="bag-code"><input id="bagCode" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Enter code"><button type="button" id="bagApply">Apply</button></div>' +
        '<div class="bag-code" id="bagEmailRow" hidden><input id="bagCodeEmail" type="email" autocomplete="email" placeholder="Your email (one use per email)"></div>' +
        '<p class="bag-codemsg" id="bagCodeMsg" hidden></p>' +
        '<dl class="bag-sum"><div><dt>Subtotal</dt><dd id="bagSub"></dd></div><div id="bagDiscRow" hidden><dt id="bagDiscLbl">Discount</dt><dd id="bagDisc"></dd></div><div><dt>Shipping</dt><dd id="bagShip"></dd></div><div class="tot"><dt>Total</dt><dd id="bagTot"></dd></div></dl>' +
        '<p class="bag-hint" id="bagHint">Choose where we ship to, then pay by card or PayPal. Free standard shipping on orders over USD ' + FREE_OVER + '.</p>' +
        '<div id="paypalBtns"></div>' +
        '<p class="bag-err" id="bagErr" role="alert" hidden></p>' +
        '<p class="bag-note">Secure payment by PayPal. You do not need a PayPal account to pay by card: at the PayPal step, leave "Save info &amp; create your PayPal account" switched off. Import duties and taxes, if any, are paid by the buyer. <a href="/shipping-returns">Shipping and returns</a></p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay); document.body.appendChild(panel);
  var $ = function (s) { return panel.querySelector(s); };
  var itemsEl = $('.bag-items'), emptyEl = $('.bag-empty'), footEl = $('.bag-foot'), sel = $('#bagRegion');
  var errEl = $('#bagErr'), hintEl = $('#bagHint'), ppEl = $('#paypalBtns');
  sel.value = region;

  function showErr(m) { errEl.textContent = m || ''; errEl.hidden = !m; }

  var lastN = count();
  function render() {
    var n = count();
    var badge = bagBtn.querySelector('.bag-count'); badge.textContent = n; bagBtn.classList.toggle('has', n > 0); bagBtn.setAttribute('aria-label', 'Open bag, ' + n + (n === 1 ? ' item' : ' items'));
    if (n > lastN) { bagBtn.classList.remove('bump'); void bagBtn.offsetWidth; bagBtn.classList.add('bump'); } lastN = n;
    itemsEl.innerHTML = cart.map(function (i, idx) {
      return '<li class="bag-item">' + (i.img ? '<img src="' + esc(i.img) + '" alt="">' : '<span class="bag-ph"></span>') +
        '<div class="bag-info"><strong>' + esc(i.name) + '</strong><span>' + esc(i.opts) + '</span>' +
        '<div class="bag-qty"><button type="button" data-a="dec" data-i="' + idx + '" aria-label="Fewer">&minus;</button><b>' + i.qty + '</b><button type="button" data-a="inc" data-i="' + idx + '" aria-label="More">+</button>' +
        '<button type="button" class="bag-rm" data-a="rm" data-i="' + idx + '">Remove</button></div></div>' +
        '<div class="bag-price">' + money(i.price * i.qty) + '</div></li>';
    }).join('');
    emptyEl.hidden = cart.length > 0; itemsEl.hidden = cart.length === 0; footEl.hidden = cart.length === 0;
    $('#bagSub').textContent = money(subtotal());
    $('#bagShip').textContent = region ? moneyFree(shipping()) : 'Choose destination';
    var ms = $('#bagMethods'); ms.hidden = !region;
    if (region) { $('#mStd').textContent = moneyFree(rateFor('std')); $('#mExp').textContent = moneyFree(rateFor('exp')); }
    panel.querySelectorAll('input[name=bagMethod]').forEach(function (r) { r.checked = r.value === method; });
    var dsc = discount(), st = codeStatus();
    $('#bagDiscRow').hidden = !(dsc > 0);
    if (dsc > 0) { $('#bagDisc').textContent = '-' + money(dsc); $('#bagDiscLbl').textContent = 'Discount (' + st.code + ')'; }
    var cm = $('#bagCodeMsg');
    $('#bagEmailRow').hidden = !needEmail;
    if (applied && st.ok) { cm.hidden = false; cm.className = 'bag-codemsg ok'; cm.textContent = 'Code applied: ' + st.d.label + '.'; }
    else if (st.msg) { cm.hidden = false; cm.className = 'bag-codemsg bad'; cm.textContent = st.msg; }
    else { cm.hidden = true; }
    $('#bagTot').textContent = money(subtotal() - dsc + shipping());
    hintEl.hidden = !!region; ppEl.hidden = !region;
    if (cart.length && region) loadPayPal();
  }
  function persist() { save(KEY, cart); render(); }

  function open() { overlay.hidden = false; panel.hidden = false; document.body.classList.add('bag-open'); showErr(''); render(); panel.querySelector('.bag-close').focus(); }
  function close() { overlay.hidden = true; panel.hidden = true; document.body.classList.remove('bag-open'); bagBtn.focus(); }
  bagBtn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  panel.querySelector('.bag-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  sel.addEventListener('change', function () { region = sel.value; save(RKEY, region); showErr(''); render(); });
  var codeIn = $('#bagCode');
  codeIn.value = code;
  var emailIn = $('#bagCodeEmail');
  function api(body) {
    return fetch('/api/code', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), keepalive: true })
      .then(function (r) { return r.json(); });
  }
  function applyCode() {
    var v = codeIn.value.trim().toUpperCase(); codeIn.value = v;
    code = v; save(CKEY, code); showErr(''); applied = null; codeMsg = ''; needEmail = false;
    if (!v) { render(); return; }
    codeEmail = emailIn.value.trim();
    codeMsg = 'Checking code...'; render();
    api({ action: 'check', code: v, email: codeEmail, sub: subtotal() }).then(function (r) {
      if (r.ok) { applied = r; codeMsg = ''; }
      else { needEmail = !!r.needEmail; codeMsg = r.error || 'That code is not valid.'; }
      render();
    }).catch(function () { codeMsg = 'Could not check the code. Try again.'; render(); });
  }
  $('#bagApply').addEventListener('click', applyCode);
  codeIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); applyCode(); } });
  panel.querySelectorAll('input[name=bagMethod]').forEach(function (r) {
    r.addEventListener('change', function () { method = r.value; save(MKEY, method); showErr(''); render(); });
  });
  itemsEl.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-a]'); if (!b) return;
    var i = +b.dataset.i, a = b.dataset.a, it = cart[i]; if (!it) return;
    if (a === 'inc') it.qty = Math.min(10, it.qty + 1);
    if (a === 'dec') it.qty = Math.max(1, it.qty - 1);
    if (a === 'rm') cart.splice(i, 1);
    persist();
  });

  /* ---------- Add to bag (product pages) ---------- */
  function cleanName(t) { return t.replace(/\s+/g, ' ').trim(); }
  function readProduct(btn) {
    var root = btn.closest('.plaque') || btn.parentElement;
    var h = root.querySelector('.plaque-title'); if (!h) return null;
    var priceEl = root.querySelector('.plaque-price');
    var price = priceEl ? parseFloat((priceEl.textContent.match(/[\d.]+/) || [''])[0]) : NaN;
    if (!(price > 0)) return null;
    var parts = [];
    root.querySelectorAll('.plaque-label').forEach(function (l) {
      var t = cleanName(l.textContent);
      if (/^Colour\s*[—-]/i.test(t)) parts.push(t.replace(/^Colour\s*[—-]\s*/i, ''));
    });
    root.querySelectorAll('.plaque-sizes').forEach(function (g) {
      var a = g.querySelector('.size-btn.active');
      if (!a) return;
      var lab = g.previousElementSibling && g.previousElementSibling.classList.contains('plaque-label') ? cleanName(g.previousElementSibling.textContent) : '';
      var v = cleanName(a.textContent);
      parts.push(/^size/i.test(lab) || !lab ? (/^(One Size|A\d)$/i.test(v) ? v : (lab ? lab.replace(/\s*\(.*\)/, '') + ' ' + v : v)) : lab + ' ' + v);
    });
    var frame = (btn.closest('.piece, .product-detail, body')).querySelector('#mainShot, .piece-frame img');
    return { name: cleanName(h.textContent), opts: parts.join(' / ') || 'Standard', price: price, qty: 1, img: frame ? frame.getAttribute('src') : '' };
  }
  function addItem(p) {
    var f = cart.filter(function (i) { return i.name === p.name && i.opts === p.opts; })[0];
    if (f) f.qty = Math.min(10, f.qty + 1); else cart.push(p);
    persist();
  }
  document.querySelectorAll('button.add-to-bag').forEach(function (btn) {
    if (btn.disabled) return;
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var p = readProduct(btn); if (!p) return;
      addItem(p);
      btn.textContent = 'Added to bag';
      setTimeout(function () { btn.textContent = label; }, 1600);
      open();
    });
  });

  /* ---------- PayPal ---------- */
  var ppState = 0; // 0 none, 1 loading, 2 rendered
  function loadPayPal() {
    if (ppState) return; ppState = 1;
    var s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(PAYPAL_CLIENT_ID) + '&currency=' + CURRENCY + '&intent=capture&components=buttons&enable-funding=card&disable-funding=paylater,venmo';
    s.onload = renderButtons;
    s.onerror = function () { ppState = 0; showErr('Payment could not load. Check your connection and try again.'); };
    document.head.appendChild(s);
  }
  function orderPayload() {
    var sub = subtotal(), ship = shipping(), dsc = discount(), st = codeStatus();
    return {
      intent: 'CAPTURE',
      purchase_units: [{
        description: 'ERATO order. ' + (method === 'exp' ? 'Express' : 'Standard') + ' shipping to ' + REGIONS[region].label + (dsc > 0 ? '. Code ' + st.code + ' (-USD ' + dsc.toFixed(2) + ')' : ''),
        amount: {
          currency_code: CURRENCY, value: (sub - dsc + ship).toFixed(2),
          breakdown: { item_total: { currency_code: CURRENCY, value: sub.toFixed(2) }, shipping: { currency_code: CURRENCY, value: ship.toFixed(2) }, discount: { currency_code: CURRENCY, value: dsc.toFixed(2) } }
        },
        items: cart.map(function (i) {
          return { name: (i.name + ' (' + i.opts + ')').slice(0, 127), quantity: String(i.qty), unit_amount: { currency_code: CURRENCY, value: i.price.toFixed(2) }, category: 'PHYSICAL_GOODS' };
        })
      }],
      application_context: { shipping_preference: 'GET_FROM_FILE', brand_name: 'ERATO' }
    };
  }
  function renderButtons() {
    if (!window.paypal || !paypal.Buttons) { ppState = 0; return; }
    ppState = 2;
    paypal.Buttons({
      style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 46 },
      onClick: function (data, actions) {
        showErr('');
        if (!cart.length) return actions.reject();
        if (!region) { showErr('Choose where we ship to first.'); return actions.reject(); }
        return actions.resolve();
      },
      createOrder: function (data, actions) {
        if (!applied) return actions.order.create(orderPayload());
        return api({ action: 'check', code: applied.code, email: codeEmail, sub: subtotal() }).then(function (r) {
          if (!r.ok) { applied = null; codeMsg = r.error || 'That code can no longer be used.'; render(); throw new Error('code'); }
          return actions.order.create(orderPayload());
        });
      },
      onShippingAddressChange: function (data, actions) {
        try {
          var cc = data.shippingAddress && data.shippingAddress.countryCode;
          if (cc && regionOf(cc) !== region) { return actions.reject(); }
        } catch (e) {}
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (d) {
          if (applied) { try { api({ action: 'redeem', code: applied.code, email: codeEmail, orderId: d.id, payerEmail: d.payer && d.payer.email_address }); } catch (e) {} }
          try { sessionStorage.setItem('erato_last_order', JSON.stringify({ method: method, id: d.id, items: cart, sub: subtotal(), disc: discount(), code: codeStatus().ok ? codeStatus().code : '', ship: shipping(), total: subtotal() - discount() + shipping() })); } catch (e) {}
          cart = []; save(KEY, cart);
          window.location.href = '/thank-you';
        });
      },
      onCancel: function () { showErr('Payment cancelled. Your bag is saved.'); },
      onError: function () { showErr('Something went wrong with the payment. You have not been charged unless PayPal emailed you a receipt. Please try again, or message us on Instagram.'); }
    }).render('#paypalBtns');
  }

  render();
  if (code) applyCode();
})();
