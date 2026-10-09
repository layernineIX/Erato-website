(() => {
  const $ = id => document.getElementById(id);
  const stage = $('wrStage'), world = $('wrWorld'), layersEl = $('wrLayers'), rack = $('wrRack');
  if (!stage || !world) return;
  const tag = $('wrTag'), back = $('wrBack'), idx = $('wrIndex'), openHit = $('wrOpenHit');
  const pull = $('wrPull'), pullTee = $('wrPullTee'), pullImg = $('wrPullImg');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ASPECT = 1856 / 2304;
  const RACK = { x: 0.29095, y: 0.16493, w: 0.42026, h: 0.48611 };

  const TEES = [
    { k:'horse',      slug:'carpet-horse',  name:'Carpet Horse',    col:'Bone', tone:'dark' },
    { k:'mughal',     slug:'mughal-letter', name:'Mughal Letter',   col:'Washed Charcoal', tone:'light' },
    { k:'roses',      slug:'rose-garden',   name:'Rose Garden',     col:'Bone', tone:'dark' },
    { k:'budapest',   slug:'budapest',      name:'Budapest',        col:'Washed Charcoal', tone:'light' },
    { k:'nighthawks', slug:'nighthawks',    name:'Nighthawks',      col:'Bone', tone:'dark' },
    { k:'vertigo',    slug:'vertigo',       name:'Vertigo',         col:'Washed Charcoal', tone:'light' },
    { k:'wave',       slug:'the-wave',      name:'The Wave',        col:'Washed Charcoal', tone:'light' }
  ];
  const href = t => 'product-' + t.slug + '.html';

  let state = 'room';       // room -> rack
  let hot = -1, W = 0, H = 0, vw = 0, vh = 0, hasClosed = false;
  const mobile = () => matchMedia('(max-width:900px)').matches;

  // closed-door frame is optional
  const closedImg = $('wrClosed');
  const probe = new Image();
  probe.onload = () => { hasClosed = true; closedImg.hidden = false; };
  probe.src = 'assets/hero/room-closed.jpg';

  // layers
  const layerEls = TEES.map((t, i) => {
    const m = window.WR_META[t.k];
    const d = document.createElement('div');
    d.className = 'wr-layer';
    d.style.cssText = `left:${m.x*100}%;top:${m.y*100}%;width:${m.w*100}%;height:${m.h*100}%;z-index:${10 - i}`;
    d.innerHTML = `<img src="assets/hero/layer-${t.k}.webp" alt="" draggable="false">`;
    layersEl.appendChild(d);
    return d;
  });
  TEES.forEach((t, i) => {
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
    return Math.round(px / 30) - 1;
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
    if (state === 'rack') {
      // frame the rail of t-shirts (rack fractions x .04-.96, y .08-.70)
      const rw = RACK.w * W * 0.92, rh = RACK.h * H * 0.62;
      s = Math.min(vw / rw * 0.94, vh / rh * 0.88);
      const cxp = (RACK.x + RACK.w * 0.5) * W, cyp = (RACK.y + RACK.h * 0.40) * H;
      tx = vw / 2 - cxp * s; ty = vh * 0.5 - cyp * s + vh * 0.02;
    } else {
      s = 1; tx = (vw - W) / 2; ty = 0;
      if (mobile()) { s = 1; tx = (vw - W) / 2; }
    }
    world.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
  };

  const goRack = () => {
    if (state === 'rack') return;
    const run = () => {
      state = 'rack';
      world.classList.add('opened', 'zoomed');
      stage.classList.add('inside');
      back.hidden = false; idx.hidden = false;
      tag.classList.remove('on');
      apply();
    };
    if (hasClosed && !closedImg.classList.contains('gone')) {
      closedImg.classList.add('gone'); world.classList.add('opened');
      setTimeout(run, reduce ? 0 : 1100);
    } else run();
  };
  const goRoom = () => {
    closePull(true);
    state = 'room';
    world.classList.remove('zoomed', 'opened', 'picking');
    stage.classList.remove('inside');
    back.hidden = true; idx.hidden = true; setHot(-1);
    if (hasClosed) closedImg.classList.remove('gone');
    apply();
  };

  // hover / tag
  const inDoors = (x, y) => {
    const r = world.getBoundingClientRect();
    const u = (x - r.left) / r.width, v = (y - r.top) / r.height;
    return u > 0.17 && u < 0.73 && v > 0.09 && v < 0.75;
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
      if (i >= 0) { tag.textContent = TEES[i].name; tag.style.left = e.clientX + 'px'; tag.style.top = e.clientY + 'px'; tag.classList.add('on'); }
      else tag.classList.remove('on');
    }
  });
  stage.addEventListener('pointerleave', () => { tag.classList.remove('on'); if (state === 'rack') setHot(-1); });

  let openedAt = 0;
  openHit.addEventListener('click', e => { e.stopPropagation(); openedAt = Date.now(); goRack(); });
  stage.addEventListener('click', e => {
    if (e.target.closest('a,button.wr-back,.wr-index,.wr-pull')) return;
    if (Date.now() - openedAt < 600) return;
    if (state === 'room') { if (inDoors(e.clientX, e.clientY)) { openedAt = Date.now(); goRack(); } return; }
    const i = pick(e.clientX, e.clientY);
    if (i >= 0) openPull(i, layerEls[i]);
  });
  back.addEventListener('click', goRoom);
  idx.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const i = +b.dataset.i; openPull(i, layerEls[i]);
  });
  idx.addEventListener('pointerover', e => { const b = e.target.closest('button'); if (b && e.pointerType !== 'touch') setHot(+b.dataset.i); });
  idx.addEventListener('pointerleave', () => setHot(-1));

  // pull-out
  let cur = -1, lastFocus = null;
  const setPull = i => {
    cur = (i + TEES.length) % TEES.length;
    const t = TEES[cur];
    pull.classList.toggle('tone-light', t.tone === 'light');
    document.body.classList.toggle('wr-light', t.tone === 'light' && !pull.hidden);
    pullImg.src = `assets/hero/pull-${t.k}.webp`; pullImg.alt = t.name + ' t-shirt, back';
    $('wrPullName').textContent = t.name;
    $('wrPullMeta').textContent = t.col + ' · RM 169';
    pullTee.href = $('wrBuy').href = $('wrKnow').href = href(t);
    pullTee.setAttribute('aria-label', t.name + ' — view product');
  };
  function openPull(i, fromEl) {
    lastFocus = document.activeElement;
    setPull(i);
    pull.hidden = false; pull.classList.remove('on', 'settled');
    document.body.classList.toggle('wr-light', TEES[cur].tone === 'light');
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
    if (pull.hidden) { if (e.key === 'Escape' && state === 'rack') goRoom(); return; }
    if (e.key === 'Escape') closePull();
    if (e.key === 'ArrowLeft') setPull(cur - 1);
    if (e.key === 'ArrowRight') setPull(cur + 1);
  });

  addEventListener('resize', layout);
  layout();
  if (reduce) { /* no animation: still starts at the room, opens instantly */ }
})();
