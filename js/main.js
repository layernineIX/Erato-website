// Nav scroll state
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Product piece — size / print-size selectors
document.querySelectorAll('.piece, .piece-solo, .product-detail').forEach(piece => {
  const buttons = piece.querySelectorAll('.size-btn');
  const priceEl = piece.querySelector('.plaque-price');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.price && priceEl) {
        priceEl.textContent = 'USD ' + btn.dataset.price;
      }
    });
  });
});


// Join the list: saved on our server (/api/join) and emailed to us via Web3Forms
(function () {
  var form = document.getElementById('joinForm'); if (!form) return;
  var JOIN_KEY = ''; /* Web3Forms access key (public, safe to keep here). Emails each signup to eratodesign@gmail.com */
  var sec = form.closest('.join'), msg = document.getElementById('joinMsg'), done = document.getElementById('joinDone');
  var input = form.querySelector('input'), btn = form.querySelector('.join-btn');
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm) {
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      sec.style.setProperty('--mx', (e.clientX - r.left) + 'px'); sec.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    form.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var d = Math.hypot(dx, dy);
      if (d < 120) { btn.style.setProperty('--bx', (dx * .18) + 'px'); btn.style.setProperty('--by', (dy * .25) + 'px'); }
      else { btn.style.setProperty('--bx', '0px'); btn.style.setProperty('--by', '0px'); }
    });
    form.addEventListener('pointerleave', function () { btn.style.setProperty('--bx', '0px'); btn.style.setProperty('--by', '0px'); });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); msg.textContent = '';
    var email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
    btn.disabled = true; btn.firstElementChild.textContent = 'Sealing...';
    var jobs = [fetch('/api/join', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: email }) })
      .then(function (r) { return r.json(); }).then(function (r) { return !!r.ok; }).catch(function () { return false; })];
    if (JOIN_KEY) jobs.push(fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ access_key: JOIN_KEY, subject: 'New ERATO list signup', from_name: 'ERATO website', email: email, message: 'New signup for the ERATO list: ' + email }) })
      .then(function (r) { return r.ok; }).catch(function () { return false; }));
    Promise.all(jobs).then(function (res) {
      if (!res.some(Boolean)) { btn.disabled = false; btn.firstElementChild.textContent = 'Seal & send'; msg.textContent = 'Could not send. Please try again, or message us on Instagram.'; return; }
      form.classList.add('is-sealing');
      setTimeout(function () { form.hidden = true; msg.textContent = ''; done.hidden = false; }, calm ? 0 : 850);
    });
  });
})();

// Product gallery thumbnails
document.querySelectorAll('.thumbs').forEach(group => {
  const main = document.getElementById('mainShot');
  group.querySelectorAll('.thumb').forEach(t => t.addEventListener('click', () => {
    group.querySelectorAll('.thumb').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    if (main) main.src = t.dataset.src;
  }));
});

/* collection rail arrows */
(function(){
  var rail=document.getElementById('teeRail');if(!rail)return;
  var prev=document.getElementById('railPrev'),next=document.getElementById('railNext');
  function step(){var c=rail.querySelector('.tee-card');return c?c.getBoundingClientRect().width+24:rail.clientWidth*0.8;}
  function upd(){prev.disabled=rail.scrollLeft<4;next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4;}
  prev.addEventListener('click',function(){rail.scrollBy({left:-step(),behavior:'smooth'});});
  next.addEventListener('click',function(){rail.scrollBy({left:step(),behavior:'smooth'});});
  rail.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
})();

/* colour swatches that switch product images (data-k → assets/products/<slug>-<k>.jpg) */
document.querySelectorAll('.swatches[data-switch]').forEach(group => {
  const main = document.getElementById('mainShot'); if (!main) return;
  const base = main.getAttribute('src').replace(/-(black|navy|redbrown)\.jpg$/, '');
  const label = document.getElementById('colourLabel');
  group.querySelectorAll('.swatch-dot').forEach(d => d.addEventListener('click', () => {
    group.querySelectorAll('.swatch-dot').forEach(x => x.classList.remove('active')); d.classList.add('active');
    const k = d.dataset.k, one = base + '-' + k + '.jpg', three = base + '-' + k + '-three.jpg';
    const th = document.querySelectorAll('.thumbs .thumb');
    if (th[0]) { th[0].dataset.src = one; th[0].querySelector('img').src = one; }
    if (th[1]) { th[1].dataset.src = three; th[1].querySelector('img').src = three; }
    th.forEach((x, i) => x.classList.toggle('active', i === 0));
    main.src = one; main.alt = 'Loom mule, ' + d.dataset.name.toLowerCase();
    if (label) label.textContent = 'Colour — ' + d.dataset.name;
  }));
});
