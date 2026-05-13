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

// ── Parallax on hero bg ───────────────────────
const heroBgImg = document.querySelector('.hero__bg-img');

window.addEventListener('scroll', () => {
  if (!heroBgImg) return;
  heroBgImg.style.transform = `scale(1) translateY(${window.scrollY * 0.2}px)`;
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
