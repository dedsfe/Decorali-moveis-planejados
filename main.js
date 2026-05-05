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
