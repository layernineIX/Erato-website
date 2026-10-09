(() => {
  const $ = id => document.getElementById(id);
  const stage = $('wrStage'), world = $('wrWorld'), layersEl = $('wrLayers'), rack = $('wrRack');
  if (!stage || !world) return;
  const tag = $('wrTag'), back = $('wrBack'), idx = $('wrIndex'), openHit = $('wrOpenHit');
  const pull = $('wrPull'), pullTee = $('wrPullTee'), pullImg = $('wrPullImg');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ASPECT = 16 / 9;

  const TEES = [
    { k:'horse',      slug:'caparison',     name:'Caparison',       col:'Bone', tone:'dark' },
    { k:'mughal',     slug:'illuminated',   name:'Illuminated',     col:'Washed Charcoal', tone:'light' },
    { k:'roses',      slug:'bloom',         name:'Bloom',           col:'Bone', tone:'dark' },
    { k:'budapest',   slug:'concierge',     name:'Concierge',       col:'Washed Charcoal', tone:'light' },
    { k:'nighthawks', slug:'last-call',     name:'Last Call',       col:'Bone', tone:'dark' },
    { k:'vertigo',    slug:'jade-room',     name:'Jade Room',       col:'Washed Charcoal', tone:'light' },
    { k:'wave',       slug:'kanagawa',      name:'Kanagawa',        col:'Washed Charcoal', tone:'light' }
  ].map(t => Object.assign(t, { group:'tees', meta: t.col + ' \u00b7 USD 44', ar: 0.711, alt: t.name + ' t-shirt, back' }));
  const ITEMS = TEES.concat([
    { k:'shoes', slug:'loom',         name:'Loom',         col:'Mule', tone:'light', group:'shelf', meta:'Woven leather mule \u00b7 USD 89', ar:1.32, alt:'Loom woven leather mules' },
    { k:'tote',  slug:'marble-study', name:'Marble Study', col:'Tote', tone:'dark',  group:'shelf', meta:'Canvas tote \u00b7 USD 24', ar:0.64, alt:'Marble Study tote bag' }
  ]);
  const href = t => 'product-' + t.slug + '.html';
  const RACK = { x: 0.38542, y: 0.17593, w: 0.19792, h: 0.61574 };
  // zoom frames: centre (fraction of world) and region size (fraction of world width / height)
  const GROUPS = {
    tees:  { cx: 0.4784, cy: 0.3658, rw: 0.174, rh: 0.287 },
    shelf: { cx: 0.4850, cy: 0.5800, rw: 0.200, rh: 0.300 },
    floor: { cx: 0.4850, cy: 0.7150, rw: 0.200, rh: 0.300 }
  };

  const WARDROBE_CX = 0.49;
  let state = 'room';       // room -> open -> zoom
  let group = 'tees';
  let hot = -1, W = 0, H = 0, vw = 0, vh = 0, hasClosed = false;
  const mobile = () => matchMedia('(max-width:900px)').matches;

  const closedImg = $('wrClosed');
  hasClosed = true;

  // layers
  const layerEls = ITEMS.map((t, i) => {
    const m = window.WR_META[t.k];
    const d = document.createElement('div');
    d.className = 'wr-layer';
    d.style.cssText = `left:${m.x*100}%;top:${m.y*100}%;width:${m.w*100}%;height:${m.h*100}%;z-index:${20 - i}`;
    d.innerHTML = `<img src="assets/hero/layer-${t.k}.webp" alt="" draggable="false">`;
    layersEl.appendChild(d);
    return d;
  });
  ITEMS.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" data-i="${i}">${t.name}</button>`;
    idx.appendChild(li);
  });

  // label map for pixel-accurate hover
  const lab = new Image(), cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
  let labOK = false;
  lab.onload = () => { cv.width = lab.width; cv.height = lab.height; cx.drawImage(lab, 0, 0); labOK = true; };
  lab.src = 'assets/hero/label.png';
  const pick = (clientX, clientY) => {
    if (!labOK) return -1;
    const r = rack.getBoundingClientRect();
    const u = (clientX - r.left) / r.width, v = (clientY - r.top) / r.height;
    if (u < 0 || v < 0 || u > 1 || v > 1) return -1;
    const px = cx.getImageData(Math.min(cv.width-1, Math.floor(u*cv.width)), Math.min(cv.height-1, Math.floor(v*cv.height)), 1, 1).data[0];
    return Math.round(px / 25) - 1;
  };

  // geometry
  const layout = () => {
    vw = stage.clientWidth; vh = stage.clientHeight;
    H = vh; W = vh * ASPECT;
    world.style.width = W + 'px'; world.style.height = H + 'px';
    apply();
  };
  const apply = () => {
    let s, tx, ty;
    if (state === 'zoom') {
      const g = GROUPS[group];
      const rw = g.rw * W, rh = g.rh * H;
      s = Math.min(vw / rw * 0.94, vh / rh * 0.88);
      tx = vw / 2 - g.cx * W * s; ty = vh * 0.5 - g.cy * H * s + vh * 0.02;
    } else {
      s = 1; ty = 0;
      tx = vw / 2 - WARDROBE_CX * W * s;
      if (W <= vw) tx = (vw - W) / 2;
      else tx = Math.min(0, Math.max(vw - W, tx));
      if (mobile()) { s = 1.0; tx = vw / 2 - WARDROBE_CX * W * s; }
    }
    world.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
  };

  // open the doors (no zoom)
  const goOpen = () => {
    if (state !== 'room') return;
    const run = () => {
      state = 'open';
      world.classList.add('opened');
      stage.classList.add('inside');
      back.hidden = false; back.textContent = 'Close the wardrobe'; idx.hidden = false;
      tag.classList.remove('on');
      apply();
    };
    world.classList.add('opened');
    if (reduce) { closedImg.classList.add('gone'); run(); return; }
    closedImg.classList.add('opening'); void closedImg.offsetWidth;
    closedImg.classList.add('gone');
    setTimeout(run, 1500);
  };
  const zoomTo = g => {
    if (state === 'room') return;
    group = g; state = 'zoom';
    world.classList.add('zoomed');
    back.hidden = false; back.textContent = '\u2190 The wardrobe';
    apply();
  };
  const unzoom = () => {
    state = 'open'; world.classList.remove('zoomed');
    back.textContent = 'Close the wardrobe';
    apply();
  };
  const goRoom = () => {
    closePull(true);
    state = 'room';
    world.classList.remove('zoomed', 'opened', 'picking');
    stage.classList.remove('inside');
    back.hidden = true; idx.hidden = true; setHot(-1); tag.classList.remove('on');
    closedImg.classList.remove('gone'); setTimeout(() => closedImg.classList.remove('opening'), 700);
    apply();
  };

  // hover / tag
  const inDoors = (x, y) => {
    const r = world.getBoundingClientRect();
    const u = (x - r.left) / r.width, v = (y - r.top) / r.height;
    return u > 0.34 && u < 0.65 && v > 0.12 && v < 0.88;
  };
  const setHot = i => {
    if (i === hot) return; hot = i;
    layerEls.forEach((l, j) => l.classList.toggle('hot', j === i));
    world.classList.toggle('picking', i >= 0);
    idx.querySelectorAll('button').forEach((b, j) => b.classList.toggle('on', j === i));
    stage.style.cursor = i >= 0 ? 'pointer' : '';
  };
  stage.addEventListener('pointermove', e => {
    if (pull && !pull.hidden) return;
    if (e.pointerType === 'touch') return;
    if (state === 'room') {
      const on = inDoors(e.clientX, e.clientY);
      stage.style.cursor = on ? 'pointer' : '';
      tag.textContent = 'open me';
      tag.style.left = e.clientX + 'px'; tag.style.top = e.clientY + 'px';
      tag.classList.toggle('on', on);
    } else {
      const i = pick(e.clientX, e.clientY);
      setHot(i);
      if (i >= 0) { tag.textContent = ITEMS[i].name; tag.style.left = e.clientX + 'px'; tag.style.top = e.clientY + 'px'; tag.classList.add('on'); }
      else tag.classList.remove('on');
    }
  });
  stage.addEventListener('pointerleave', () => { tag.classList.remove('on'); if (state !== 'room') setHot(-1); });

  let openedAt = 0;
  openHit.addEventListener('click', e => { e.stopPropagation(); openedAt = Date.now(); goOpen(); });
  stage.addEventListener('click', e => {
    if (e.target.closest('a,button.wr-back,.wr-index,.wr-pull')) return;
    if (Date.now() - openedAt < 600) return;
    if (state === 'room') { if (inDoors(e.clientX, e.clientY)) { openedAt = Date.now(); goOpen(); } return; }
    const i = pick(e.clientX, e.clientY);
    if (i < 0) return;
    if (state === 'open') { setHot(-1); tag.classList.remove('on'); zoomTo(ITEMS[i].group); }
    else openPull(i, layerEls[i]);
  });
  back.addEventListener('click', () => { if (state === 'zoom') unzoom(); else goRoom(); });
  idx.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const i = +b.dataset.i; if (state === 'open') zoomTo(ITEMS[i].group); openPull(i, layerEls[i]);
  });
  idx.addEventListener('pointerover', e => { const b = e.target.closest('button'); if (b && e.pointerType !== 'touch') setHot(+b.dataset.i); });
  idx.addEventListener('pointerleave', () => setHot(-1));

  // pull-out
  let cur = -1, lastFocus = null;
  const setPull = i => {
    cur = (i + ITEMS.length) % ITEMS.length;
    const t = ITEMS[cur];
    pull.classList.toggle('tone-light', t.tone === 'light');
    document.body.classList.toggle('wr-light', t.tone === 'light' && !pull.hidden);
    pullImg.src = `assets/hero/pull-${t.k}.webp`; pullImg.alt = t.alt; pullTee.style.setProperty('--ar', t.ar);
    $('wrPullName').textContent = t.name;
    $('wrPullMeta').textContent = t.meta;
    pullTee.href = $('wrBuy').href = $('wrKnow').href = href(t);
    pullTee.setAttribute('aria-label', t.name + ' — view product');
  };
  function openPull(i, fromEl) {
    lastFocus = document.activeElement;
    setPull(i);
    pull.hidden = false; pull.classList.remove('on', 'settled');
    document.body.classList.toggle('wr-light', ITEMS[cur].tone === 'light');
    pullTee.style.transition = 'none';
    // start where the tee hangs (FLIP)
    const pr = pullTee.getBoundingClientRect();
    const fr = (fromEl || layerEls[i]).getBoundingClientRect();
    const sx = fr.width / pr.width, sy = fr.height / pr.height;
    if (!reduce) pullTee.style.transform = `translate(${fr.left + fr.width/2 - (pr.left + pr.width/2)}px,${fr.top + fr.height/2 - (pr.top + pr.height/2)}px) scale(${sx},${sy})`;
    void pullTee.offsetWidth;
    pull.classList.add('on');
    pullTee.style.transition = reduce ? 'none' : 'transform .9s cubic-bezier(.22,1,.36,1)';
    pullTee.style.transform = 'none';
    setTimeout(() => pull.classList.add('settled'), reduce ? 0 : 350);
    $('wrBuy').focus({ preventScroll: true });
  }
  function closePull(instant) {
    if (pull.hidden) return;
    pull.classList.remove('on', 'settled');
    document.body.classList.remove('wr-light');
    setTimeout(() => { pull.hidden = true; }, instant || reduce ? 0 : 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $('wrPullClose').addEventListener('click', () => closePull());
  $('wrPrev').addEventListener('click', () => setPull(cur - 1));
  $('wrNext').addEventListener('click', () => setPull(cur + 1));
  pull.addEventListener('click', e => { if (e.target === pull) closePull(); });
  document.addEventListener('keydown', e => {
    if (pull.hidden) { if (e.key === 'Escape') { if (state === 'zoom') unzoom(); else if (state === 'open') goRoom(); } return; }
    if (e.key === 'Escape') closePull();
    if (e.key === 'ArrowLeft') setPull(cur - 1);
    if (e.key === 'ArrowRight') setPull(cur + 1);
  });

  addEventListener('resize', layout);
  layout();
  if (reduce) { /* no animation: still starts at the room, opens instantly */ }
})();
