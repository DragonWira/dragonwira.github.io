/* ========= FUNGSI GLOBAL ========= */
async function loadLangSimple(langCode) {
  const els = document.querySelectorAll('[data-id]');
  // fade-out
  els.forEach(el => el.style.opacity = 0);

  try {
    const res = await fetch(`lang_${langCode}.txt`);
    if (!res.ok) throw new Error();
    const lines = (await res.text()).split('\n').map(l => l.trim()).filter(Boolean);

    // ganti teks saat tersembunyi
    // FIX: Menambahkan pengecekan 'el' untuk menghindari TypeError jika elemen menjadi null/dihapus secara tak terduga
    els.forEach((el, i) => el && lines[i] && (el.textContent = lines[i]));

    // fade-in
    els.forEach(el => el.style.opacity = 1);
  } catch {
    console.error('Gagal memuat bahasa');
    els.forEach(el => el.style.opacity = 1); // kembalikan
  }
}

function setLang(langCode) {
  loadLangSimple(langCode);
}

/* ========= DOMContentLoaded ========= */
document.addEventListener('DOMContentLoaded', () => {
  const bannerSection = document.querySelector('.banner-section');
  const bannerImage = document.querySelector('.banner-image');
  const bannerContent = document.querySelector('.banner-content');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const mainNav = document.getElementById('mainNav');
  const mainContent = document.getElementById('mainContent');
  const navLinks = document.querySelectorAll('nav a');

  let lastScrollTop = 0;
  let isManualScroll = false;

  window.addEventListener('scroll', () => {
    if (isManualScroll) return;
    const s = window.scrollY;
    const bannerH = bannerSection.offsetHeight;
    const btn = document.getElementById('backToTop');

    bannerImage.style.transform = `translateY(${s * 0.4}px)`;

    if (s > bannerH * 0.3) {
      const op = 1 - s / (bannerH * 0.7);
      bannerContent.style.opacity = op < 0 ? '0' : op;
      scrollIndicator.style.opacity = op < 0 ? '0' : op;
    }

    if (s > lastScrollTop && s > 100) mainNav.classList.add('visible');
    if (s > 200) mainNav.classList.add('scrolled');
    lastScrollTop = s;
    btn.style.display = s > 300 ? 'block' : 'none';

    mainContent.classList.toggle('visible', s > bannerH * 0.4);
    if (s < 100) mainNav.classList.remove('visible', 'scrolled');

    let cur = '';
    document.querySelectorAll('section').forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top <= innerHeight / 2 && r.bottom >= innerHeight / 2) cur = sec.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.hash === `#${cur}`));
  });

  setTimeout(() => bannerContent.style.opacity = 1, 500);

  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      const id = a.hash;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        isManualScroll = true;
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
        setTimeout(() => isManualScroll = false, 1000); // Reset after animation
      }
    });
  });

  // Load default language on startup (Indonesia)
  setLang('id');

  // Load scroll position if available
  if (sessionStorage.getItem('scrollPos')) {
    window.scrollTo(0, sessionStorage.getItem('scrollPos'));
  }

  // Save scroll position on beforeunload
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPos', window.scrollY);
  });
});
