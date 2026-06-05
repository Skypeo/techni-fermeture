/* ============================================================
   Techni Fermetures — JS partagé (toutes pages)
   Tous les sélecteurs sont protégés : une page peut n'avoir
   qu'une partie de ces éléments.
   ============================================================ */
(function () {
  'use strict';

  // --- Header transparent → opaque on scroll (+ sticky CTA) ---
  const nav = document.getElementById('nav');
  const stickyCta = document.getElementById('stickyCta');
  const navIsOverlay = nav && nav.dataset.navStyle !== 'solid';
  function onScroll() {
    const y = window.scrollY;
    if (nav && navIsOverlay) {
      nav.classList.toggle('nav-scrolled', y > 40);
    }
    if (stickyCta) {
      const show = y > 600;
      stickyCta.classList.toggle('translate-y-24', !show);
      stickyCta.classList.toggle('opacity-0', !show);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Menu off-canvas (mobile / tablette) ---
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    // Fermé = display:none (`hidden`) ; l'animation est déclenchée en rajoutant
    // `is-open` une frame après l'affichage (sinon la transition ne joue pas).
    const openMenu = () => {
      mobileMenu.classList.remove('hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => mobileMenu.classList.add('is-open')));
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { if (!mobileMenu.classList.contains('is-open')) mobileMenu.classList.add('hidden'); }, 480);
    };
    menuBtn.addEventListener('click', () =>
      mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu()
    );
    mobileMenu.querySelector('.offcanvas-backdrop')?.addEventListener('click', closeMenu);
    mobileMenu.querySelector('.offcanvas-close')?.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // --- Reveal on scroll ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // --- Counter animation ---
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.counter, 10);
        const duration = 1400;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  // --- Gallery filters ---
  const pills = document.querySelectorAll('#filterBar .pill');
  const tiles = document.querySelectorAll('#gallery .g-tile');
  if (pills.length && tiles.length) {
    pills.forEach(p => {
      p.addEventListener('click', () => {
        pills.forEach(x => x.classList.remove('is-active'));
        p.classList.add('is-active');
        const f = p.dataset.filter;
        tiles.forEach(t => {
          t.style.display = (f === 'all' || t.dataset.cat === f) ? '' : 'none';
        });
      });
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox && tiles.length) {
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCap');
    window.openLightbox = function (src, cap) {
      if (lbImg) lbImg.src = src;
      if (lbCap) lbCap.textContent = cap || '';
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };
    window.closeLightbox = function () {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    };
    tiles.forEach(t => {
      t.addEventListener('click', () => window.openLightbox(t.dataset.src, t.dataset.cap));
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closeLightbox(); });
  }
})();
