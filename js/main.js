'use strict';
/* ═══════════════════════════════════════════════════════════════════════════
   AVISHI TYAGI — PORTFOLIO  ·  main.js
   Animations:
     01  Nav scroll shrink + active link tracker
     02  Hamburger menu
     03  Reveal on scroll (staggered)
     04  Hero canvas — amber dot grid with mouse ripple
     05  Typewriter — hero label
     06  Glitch flicker — hero name on load + hover
     07  Stat counters — count up when stats bar enters view
     08  Text scramble — section headings when they enter view
     09  Magnetic buttons — subtle cursor pull
     10  Cursor glow trail
     11  Data stream — floating hex/binary column on hero right edge
     12  Timeline dot pulse + scan-line sweep
     13  Smooth scroll with offset
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── 01  NAV ─────────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── 02  HAMBURGER ───────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── 03  REVEAL ON SCROLL ────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.children)
                          .filter(c => c.classList.contains('reveal'));
    const delay = siblings.indexOf(entry.target) * 90;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

/* ── 04  HERO CANVAS — AMBER DOT GRID ───────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CELL = 48, RADIUS = 1.2, COLOR = '200,130,10';
  let W, H, cols, rows, frame = 0;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * CELL, y = r * CELL;
        const dx = x - mouse.x, dy = y - mouse.y;
        const prox = Math.max(0, 1 - Math.sqrt(dx*dx + dy*dy) / 230);
        const pulse = 0.25 + 0.1 * Math.sin(frame * 0.016 + c * 0.38 + r * 0.55);
        const alpha = pulse + prox * 0.75;
        ctx.beginPath();
        ctx.arc(x, y, RADIUS + prox * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},${Math.min(alpha, 0.9)})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 05  TYPEWRITER — hero label ─────────────────────────────────────────── */
(function typewriter() {
  const el = document.querySelector('.hero-label');
  if (!el) return;
  const full = el.textContent.trim();
  el.textContent = '';
  el.style.opacity = '1';           // override fade-up for this element
  el.style.animation = 'none';
  el.style.transform = 'none';

  let i = 0;
  // blinking cursor via a span
  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  el.appendChild(cursor);

  const interval = setInterval(() => {
    el.insertBefore(document.createTextNode(full[i]), cursor);
    i++;
    if (i >= full.length) {
      clearInterval(interval);
      // cursor blinks for 2 s then disappears
      setTimeout(() => cursor.classList.add('tw-cursor-done'), 2000);
    }
  }, 38);
})();

/* ── 06  GLITCH FLICKER — hero name ─────────────────────────────────────── */
(function glitch() {
  const el = document.querySelector('.hero-name');
  if (!el) return;

  function runGlitch(durationMs = 400) {
    let t = 0;
    const step = () => {
      if (t > durationMs) { el.style.textShadow = ''; el.style.transform = ''; return; }
      const intensity = Math.random();
      const dx = (Math.random() - 0.5) * 6 * intensity;
      const dy = (Math.random() - 0.5) * 3 * intensity;
      el.style.transform = `translate(${dx}px,${dy}px)`;
      el.style.textShadow = intensity > 0.5
        ? `${-dx*2}px 0 rgba(200,130,10,0.8), ${dx*2}px 0 rgba(240,200,80,0.5)`
        : '';
      t += 40 + Math.random() * 30;
      setTimeout(step, 40);
    };
    step();
  }

  // fire once after load animation
  setTimeout(() => runGlitch(350), 1000);
  // fire on hover
  el.addEventListener('mouseenter', () => runGlitch(300));
})();

/* ── 07  STAT COUNTERS ───────────────────────────────────────────────────── */
(function statCounters() {
  const statsBar = document.querySelector('.hero-stats');
  if (!statsBar) return;

  const targets = [
    { el: null, end: 3,   suffix: '',    decimals: 0 },
    { el: null, end: 200, suffix: 'K+',  decimals: 0 },
    { el: null, end: 9,   suffix: '+',   decimals: 0 },
    { el: null, end: 8,   suffix: '',    decimals: 0 },
  ];
  const nums = statsBar.querySelectorAll('.stat-num');
  nums.forEach((el, i) => { if (targets[i]) targets[i].el = el; });

  function animateCount(target) {
    const { el, end, suffix, decimals } = target;
    if (!el) return;
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - p, 3);
      const val = ease * end;
      el.textContent = (decimals > 0 ? val.toFixed(decimals) : Math.floor(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = end + suffix;
    }
    requestAnimationFrame(tick);
  }

  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      targets.forEach((t, i) => setTimeout(() => animateCount(t), i * 100));
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(statsBar);
})();

/* ── 09  MAGNETIC BUTTONS ────────────────────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── 10  CURSOR GLOW TRAIL ───────────────────────────────────────────────── */
(function cursorTrail() {
  // skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const DOT_COUNT = 8;
  const dots = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    const d = document.createElement('div');
    d.className = 'cursor-dot';
    d.style.cssText = `
      position:fixed;pointer-events:none;z-index:9999;
      width:6px;height:6px;border-radius:50%;
      background:rgba(200,130,10,${0.7 - i * 0.07});
      transform:translate(-50%,-50%);
      transition:opacity 0.2s;
      will-change:transform;
    `;
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function animateDots() {
    let px = mx, py = my;
    dots.forEach((dot, i) => {
      dot.x += (px - dot.x) * (0.35 - i * 0.03);
      dot.y += (py - dot.y) * (0.35 - i * 0.03);
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top  = dot.y + 'px';
      dot.el.style.width  = (6 - i * 0.5) + 'px';
      dot.el.style.height = (6 - i * 0.5) + 'px';
      px = dot.x; py = dot.y;
    });
    requestAnimationFrame(animateDots);
  }
  animateDots();

  // hide trail when mouse leaves window
  document.addEventListener('mouseleave', () => dots.forEach(d => d.el.style.opacity = '0'));
  document.addEventListener('mouseenter', () => dots.forEach(d => d.el.style.opacity = '1'));
})();

/* ── 11  DATA STREAM COLUMN ──────────────────────────────────────────────── */
(function dataStream() {
  const hero = document.getElementById('hero');
  if (!hero || window.innerWidth < 900) return;

  const stream = document.createElement('div');
  stream.className = 'data-stream';
  hero.appendChild(stream);

  const lines = 22;
  const pool  = '01001011 0xFF A3D9 SELECT * NULL JOIN WHERE COUNT AVG 200K 0x1F4A 3.14 NaN ∑ μ σ 0b1010 INT FLOAT VARCHAR BOOL ∂ÆΔ 0xCAFE SQL ETL KPI 9.2'.split(' ');

  for (let i = 0; i < lines; i++) {
    const span = document.createElement('div');
    span.className = 'ds-line';
    span.style.animationDelay = (i * 0.3) + 's';
    span.style.top = (i / lines * 100) + '%';
    stream.appendChild(span);

    // randomise text every 1.2s
    function refresh() {
      span.textContent = pool[Math.floor(Math.random() * pool.length)];
      setTimeout(refresh, 1000 + Math.random() * 1200);
    }
    setTimeout(refresh, i * 180);
  }
})();

/* ── 12  TIMELINE DOT PULSE + SCAN LINE ─────────────────────────────────── */
(function timelineEffects() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    const dot = item.querySelector('.tl-dot');
    if (!dot) return;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // brief scan sweep on the card
        item.classList.add('tl-scan');
        setTimeout(() => item.classList.remove('tl-scan'), 900);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(item);
  });
})();

/* ── 13  ACTIVE NAV LINK ─────────────────────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

/* ── 14  SMOOTH SCROLL ───────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});
