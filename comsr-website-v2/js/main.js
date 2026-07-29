/* =====================================================
   COM SR INFOTECH — MAIN SCRIPT
   Vanilla JS. No dependencies.
   ===================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('done'), 350);
  });

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    if (!progressBar) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });

  /* ---------- CURSOR GLOW ---------- */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ---------- NAV SCROLL STATE ---------- */
  const header = document.getElementById('siteHeader');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 30);
  }
  document.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 700);
  }
  document.addEventListener('scroll', updateBackToTop, { passive: true });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

  /* ---------- MOBILE DRAWER ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  function closeDrawer() {
    menuBtn.classList.remove('open');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }
  if (menuBtn && drawer && backdrop) {
    menuBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      backdrop.classList.toggle('open', isOpen);
    });
    backdrop.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  }

  /* ---------- THEME TOGGLE + WAVE TRANSITION ---------- */
  const toggle = document.getElementById('themeToggle');
  const knob = document.getElementById('themeKnob');
  const wave = document.getElementById('waveOverlay');
  let animating = false;

  function setLogos(theme) {
    document.querySelectorAll('[data-logo="dark"]').forEach(el => el.style.display = theme === 'dark' ? 'block' : 'none');
    document.querySelectorAll('[data-logo="light"]').forEach(el => el.style.display = theme === 'dark' ? 'none' : 'block');
    if (knob) knob.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
  setLogos(root.getAttribute('data-theme'));

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (animating) return;
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';

      if (prefersReduced) {
        root.setAttribute('data-theme', next);
        setLogos(next);
        return;
      }

      animating = true;
      wave.style.setProperty('--wave-color', next === 'dark' ? '#090909' : '#FFFFFF');
      wave.classList.add('run');

      setTimeout(() => {
        root.setAttribute('data-theme', next);
        setLogos(next);
      }, 900);

      setTimeout(() => {
        wave.classList.remove('run');
        animating = false;
      }, 2000);
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    if (prefersReduced) { el.textContent = target + suffix; return; }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      ans.style.maxHeight = !isOpen ? ans.scrollHeight + 'px' : null;
    });
  });

  /* ---------- WHATSAPP LINKS ---------- */
  const waMessage = "Hi Com SR Infotech, I'd like to discuss a project for my business.";
  const waHref = "https://wa.me/919344734423?text=" + encodeURIComponent(waMessage);
  document.querySelectorAll('[data-whatsapp]').forEach(a => a.href = waHref);

  /* ---------- CONTACT FORM (front-end only — no backend yet) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.getElementById('formNote');
      if (note) {
        note.textContent = "Thanks — this form isn't wired to a backend yet. Please reach us on WhatsApp or email for now.";
        note.style.color = 'var(--red)';
      }
    });
  }

  /* ---------- HERO CANVAS: CIRCUIT NODES + PARTICLES ---------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes;

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function makeNodes() {
      const count = Math.min(46, Math.floor((w * h) / 55000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      }));
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const maxD = 150 * devicePixelRatio;
          if (d < maxD) {
            ctx.strokeStyle = `rgba(225,6,0,${0.16 * (1 - d / maxD)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(225,6,0,.5)';
        ctx.fill();
      });
      requestAnimationFrame(step);
    }
    resize();
    makeNodes();
    requestAnimationFrame(step);
    window.addEventListener('resize', () => { resize(); makeNodes(); });
  }

  /* ---------- SMOOTH ANCHOR SCROLL OFFSET FOR STICKY HEADER ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
      history.pushState(null, '', id);
    });
  });

})();