/* ========= FUNGSI TRANSLATE SEDERHANA (BARIS PER BARIS) ========= */

function getLangPath(langCode) {
  const isSubPage = window.location.pathname.includes('/main/');
  const prefix = isSubPage ? `../lang/${langCode}/` : `lang/${langCode}/`;

  let pageName = window.location.pathname.split('/').pop().replace('.html', '');
  if (!pageName || pageName === '') pageName = 'index';

  return `${prefix}lang_${langCode}_${pageName}.txt`;
}

async function loadLangSimple(langCode) {
  const els = document.querySelectorAll('[data-id]');
  els.forEach(el => el.style.opacity = 0.5);

  try {
    const res = await fetch(getLangPath(langCode));
    if (!res.ok) throw new Error(`Gagal memuat ${langCode}`);
    
    const text = await res.text();
    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(line => line.length > 0);

    els.forEach((el, i) => {
      if (lines[i]) el.textContent = lines[i];
    });

  } catch (err) {
    console.error('Error bahasa:', err);
  } finally {
    els.forEach(el => el.style.opacity = 1);
  }
}

function setLang(langCode) {
  loadLangSimple(langCode);
  localStorage.setItem('selectedLang', langCode);
}

/* ========= INISIALISASI ========= */
document.addEventListener('DOMContentLoaded', () => {

  /* === LOAD BAHASA === */
  const savedLang = localStorage.getItem('selectedLang') || 'id';
  setLang(savedLang);

  /* === BACK TO TOP === */
  const btn = document.getElementById('backToTop');
  if (btn) {
    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
  }

  /* === BANNER ANIMATION (TIDAK DIUBAH) === */
  const bannerContent = document.querySelector('.banner-content');
  if (bannerContent) {
    setTimeout(() => bannerContent.style.opacity = 1, 500);

    window.addEventListener('scroll', () => {
      const bannerImg = document.querySelector('.banner-image');
      if (bannerImg) {
        bannerImg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    });
  }

  /* =========================================================
     FLOATING MENU (HAMBURGER) – TAMBAHAN SAJA
     TIDAK MERUSAK KODE LAMA
  ========================================================= */

  const menuToggle = document.getElementById('menuToggle');
  const floatingMenu = document.getElementById('floatingMenu');

  if (menuToggle && floatingMenu) {

    /* toggle menu */
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingMenu.classList.toggle('active');
    });

    /* klik di luar → tutup menu */
    document.addEventListener('click', (e) => {
      if (
        !floatingMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        floatingMenu.classList.remove('active');
      }
    });

    /* optional: ESC untuk tutup */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        floatingMenu.classList.remove('active');
      }
    });
  }
  
});
/* ========= PAGE TRANSITION ========= */
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');

    if (href && !href.startsWith('#') && !href.startsWith('http')) {
      e.preventDefault();
      document.body.classList.add('page-exit');

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  });
});

