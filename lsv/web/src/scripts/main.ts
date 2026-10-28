// Script commun à toutes les pages : menu mobile, apparition au défilement, onde de l'accueil.

// Menu mobile
const btn = document.querySelector<HTMLButtonElement>('[data-menu]');
const nav = document.getElementById('nav');
if (btn && nav) {
  const close = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => btn.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target as Node) && !btn.contains(e.target as Node)) close();
  });
}

// Apparition au défilement
const items = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((x) => {
    if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('in'));
}

// Onde décorative de l'accueil (styles posés via CSSOM : autorisé par la CSP)
const wave = document.querySelector<HTMLElement>('[data-wave]');
if (wave) {
  for (let i = 0; i < 41; i++) {
    const b = document.createElement('i');
    b.style.setProperty('--h', `${18 + Math.abs(Math.sin(i * 0.45) * Math.cos(i * 0.17)) * 82}%`);
    b.style.setProperty('--i', String(i));
    wave.appendChild(b);
  }
}
