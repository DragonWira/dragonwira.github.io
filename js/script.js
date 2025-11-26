/* ========= FUNGSI TRANSLATE SEDERHANA (BARIS PER BARIS) ========= */

function getLangPath(langCode) {
  // 1. Cek posisi kita (di root atau di main)
  const isSubPage = window.location.pathname.includes('/main/');
  
  // 2. Tentukan awalan folder (../lang/id/ atau lang/id/)
  const prefix = isSubPage ? `../lang/${langCode}/` : `lang/${langCode}/`;

  // 3. Ambil nama file halaman (misal: 'galeri')
  let pageName = window.location.pathname.split('/').pop().replace('.html', '');
  if (!pageName || pageName === '') pageName = 'index';

  // 4. Return alamat lengkap: ../lang/id/lang_id_galeri.txt
  return `${prefix}lang_${langCode}_${pageName}.txt`;
}

async function loadLangSimple(langCode) {
  // Ambil SEMUA elemen yang punya atribut data-id
  const els = document.querySelectorAll('[data-id]');
  
  // Fade-out efek
  els.forEach(el => el.style.opacity = 0.5);

  try {
    const res = await fetch(getLangPath(langCode));
    if (!res.ok) throw new Error(`Gagal memuat ${langCode}`);
    
    const text = await res.text();
    
    // --- LOGIKA BARIS PER BARIS ---
    // Pisahkan teks berdasarkan Enter (Baris baru) & Hapus baris kosong
    const lines = text.split('\n').map(l => l.trim()).filter(line => line.length > 0);

    // Tempelkan urut: Baris 1 ke Elemen 1, Baris 2 ke Elemen 2...
    els.forEach((el, i) => {
      if (lines[i]) {
        el.textContent = lines[i];
      }
    });
    // -----------------------------

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
  const savedLang = localStorage.getItem('selectedLang') || 'id';
  setLang(savedLang);

  // Animasi Banner & Back to Top
  const btn = document.getElementById('backToTop');
  if(btn) {
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
  }
  
  const bannerContent = document.querySelector('.banner-content');
  if (bannerContent) {
    setTimeout(() => bannerContent.style.opacity = 1, 500);
    window.addEventListener('scroll', () => {
      const bannerImg = document.querySelector('.banner-image');
      if(bannerImg) bannerImg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
    });
  }
});