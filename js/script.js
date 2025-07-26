// --- FUNGSI GLOBAL (bisa dipanggil dari HTML onclick) ---
async function loadLangSimple(langCode) {
  try {
    const response = await fetch(`lang_${langCode}.txt`);
    if (!response.ok) throw new Error(`Gagal memuat file bahasa: ${langCode}`);
    const text = await response.text();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    document.querySelectorAll('[data-id]').forEach((el, i) => {
      if (lines[i]) el.textContent = lines[i];
    });
    document.querySelectorAll('.language-switch button').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick').includes(langCode));
    });
  } catch {
    console.error('Gagal memuat bahasa:', langCode);
  }
}

function setLang(langCode) {
  loadLangSimple(langCode);
}

// --- KODE DI DALAM DOMContentLoaded ---
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

  // Scroll listener
  window.addEventListener('scroll', () => {
    if (isManualScroll) return;

    const scrollPosition = window.scrollY;
    const bannerHeight = bannerSection.offsetHeight;
    const btn = document.getElementById('backToTop');

    // Parallax
    bannerImage.style.transform = `translateY(${scrollPosition * 0.4}px)`;

    // Fade banner
    if (scrollPosition > bannerHeight * 0.3) {
      const opacity = 1 - scrollPosition / (bannerHeight * 0.7);
      bannerContent.style.opacity = opacity < 0 ? '0' : opacity;
      scrollIndicator.style.opacity = opacity < 0 ? '0' : opacity;
    }

    // Nav & back-to-top
    if (scrollPosition > lastScrollTop && scrollPosition > 100) {
      mainNav.classList.add('visible');
      if (scrollPosition > 200) mainNav.classList.add('scrolled');
    }
    lastScrollTop = scrollPosition;
    btn.style.display = scrollPosition > 300 ? 'block' : 'none';

    // Show main content
    mainContent.classList.toggle('visible', scrollPosition > bannerHeight * 0.4);
    if (scrollPosition < 100) {
      mainNav.classList.remove('visible', 'scrolled');
    }

    // Auto highlight nav
    let currentSection = '';
    document.querySelectorAll('section').forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= innerHeight / 2 && rect.bottom >= innerHeight / 2) {
        currentSection = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
      link.toggleAttribute('aria-current', link.classList.contains('active'));
    });
  });

  // Animasi awal
  setTimeout(() => bannerContent.style.opacity = '1', 500);

  // Smooth scroll
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id.startsWith('#')) return;
      e.preventDefault();
      isManualScroll = true;
      navLinks.forEach(l => l.classList.remove('active'));
      a.classList.add('active');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => (isManualScroll = false), 1500);
    });
  });

  // Bahasa default
  setLang('id');
});
