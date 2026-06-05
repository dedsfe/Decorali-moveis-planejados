// ── Menu overlay ──────────────────────────────
const menuBtn     = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose   = document.getElementById('menuClose');
const menuLinks   = document.querySelectorAll('[data-menu-link]');

function openMenu() {
  menuOverlay.classList.add('is-open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  menuClose.focus();
}

function closeMenu() {
  menuOverlay.classList.remove('is-open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  menuBtn.focus();
}

menuBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

// fecha ao clicar em qualquer link
menuLinks.forEach(link => link.addEventListener('click', closeMenu));

// fecha com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) closeMenu();
});

// ── Hero & Navbar entrance ────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 80);
});

// ── Navbar glassmorphism on scroll ────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.style.background = 'rgba(20, 15, 10, 0.6)';
    navbar.style.backdropFilter = 'blur(16px)';
    navbar.style.webkitBackdropFilter = 'blur(16px)';
  } else {
    navbar.style.background = 'transparent';
    navbar.style.backdropFilter = 'none';
    navbar.style.webkitBackdropFilter = 'none';
  }
}, { passive: true });

// ── Scroll reveal (IntersectionObserver) ──────
const revealEls = document.querySelectorAll('.reveal, .sobre__visual');

if (revealEls.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('is-visible'), delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
}

// ── Counter animation ──────────────────────────
function animateCount(el, target, duration) {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  requestAnimationFrame(update);
}

// ── Convite (orçamento) reveal ────────────────
const convite = document.querySelector('.convite');
if (convite) {
  const conviteObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      conviteObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  conviteObs.observe(convite);
}

// ── Ambientes — reveal por máscara ────────────
const ambItems = [...document.querySelectorAll('.amb__item')];

if (ambItems.length) {
  const ambRevealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.revealDelay) || 0;
      setTimeout(() => el.classList.add('is-revealed'), delay);
      ambRevealObs.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -50px 0px' });

  ambItems.forEach(el => ambRevealObs.observe(el));
}

// ── Ambiente lightbox ─────────────────────────
const ambLightbox      = document.getElementById('ambLightbox');
const ambLightboxImg   = document.getElementById('ambLightboxImg');
const ambLbIndex       = document.getElementById('ambLbIndex');
const ambLbName        = document.getElementById('ambLbName');
const ambLbDesc        = document.getElementById('ambLbDesc');
const ambLbCounter     = document.getElementById('ambLbCounter');
const ambLightboxClose = document.getElementById('ambLightboxClose');
const ambPrev          = document.getElementById('ambPrev');
const ambNext          = document.getElementById('ambNext');

const ambData = ambItems.map(it => {
  const img = it.querySelector('.amb__img');
  return {
    src: img.src,
    alt: img.alt,
    index: it.querySelector('.amb__index').textContent,
    name: it.querySelector('.amb__name').textContent,
    desc: it.dataset.desc || ''
  };
});

let ambCurrent = 0;
let ambLastFocus = null;

function paintLightbox(i) {
  ambCurrent = i;
  const d = ambData[i];
  ambLightboxImg.src = d.src;
  ambLightboxImg.alt = d.alt;
  ambLbIndex.textContent   = d.index;
  ambLbName.textContent    = d.name;
  ambLbDesc.textContent    = d.desc;
  ambLbCounter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(ambData.length).padStart(2, '0');
}

function openLightbox(i) {
  paintLightbox(i);
  ambLastFocus = ambItems[i];
  ambLightbox.classList.add('is-open');
  ambLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  ambLightboxClose.focus();
}

function closeLightbox() {
  ambLightbox.classList.remove('is-open');
  ambLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (ambLastFocus) ambLastFocus.focus();
}

function stepLightbox(dir) {
  const n = (ambCurrent + dir + ambData.length) % ambData.length;
  ambLightboxImg.style.opacity = '0';
  setTimeout(() => {
    const d = ambData[n];
    const pre = new Image();
    pre.onload = () => {
      paintLightbox(n);
      ambLightboxImg.style.opacity = '1';
    };
    pre.src = d.src;
  }, 220);
}

ambItems.forEach((it, i) => {
  it.addEventListener('click', () => openLightbox(i));
});

ambLightboxClose.addEventListener('click', closeLightbox);
ambPrev.addEventListener('click', () => stepLightbox(-1));
ambNext.addEventListener('click', () => stepLightbox(1));
ambLightbox.addEventListener('click', e => {
  if (e.target === ambLightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!ambLightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
});

const statsSection = document.querySelector('.sobre__stats');
if (statsSection) {
  let counted = false;
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || counted) return;
      counted = true;
      document.querySelectorAll('.count').forEach(el => {
        const target = parseInt(el.dataset.target);
        const duration = target >= 100 ? 1800 : 1400;
        animateCount(el, target, duration);
      });
      countObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  countObs.observe(statsSection);
}
// ── Footer year ───────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
