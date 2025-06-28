document.addEventListener('DOMContentLoaded', function() {
  // Inisialisasi scroll dan transisi
  const bannerSection = document.getElementById('banner');
  const bannerImage = document.getElementById('bannerImage');
  const bannerContent = document.querySelector('.banner-content');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const mainNav = document.getElementById('mainNav');
  const mainContent = document.getElementById('mainContent');
  const navLinks = document.querySelectorAll('nav a');
  
  let lastScrollTop = 0;
  
  // Handle scroll event
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const bannerHeight = bannerSection.offsetHeight;
    
    // Efek parallax pada banner image
    if (bannerImage) {
      bannerImage.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    }
    
    // Efek fade out pada konten banner
    if (scrollPosition > bannerHeight * 0.3) {
      const opacity = 1 - (scrollPosition / (bannerHeight * 0.7));
      if (bannerContent) bannerContent.style.opacity = opacity < 0 ? '0' : opacity;
      if (scrollIndicator) scrollIndicator.style.opacity = opacity < 0 ? '0' : opacity;
    }
    
    // Tampilkan navigasi ketika scroll ke bawah
    if (scrollPosition > lastScrollTop && scrollPosition > 100) {
      if (mainNav) mainNav.classList.add('visible');
      if (scrollPosition > 200 && mainNav) {
        mainNav.classList.add('scrolled');
      }
    } 
    lastScrollTop = scrollPosition;
    
    // Tampilkan konten utama
    if (scrollPosition > bannerHeight * 0.4 && mainContent) {
      mainContent.classList.add('visible');
    }
    
    // Sembunyikan navigasi ketika scroll ke atas dan di atas banner
    if (scrollPosition < 100 && mainNav) {
      mainNav.classList.remove('visible');
      mainNav.classList.remove('scrolled');
    }
    
    // Active nav link berdasarkan posisi scroll
    const sections = document.querySelectorAll('section');
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= (sectionTop - 100)) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Back to Top Button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'backToTop';
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.title = 'Kembali ke Atas';
  document.body.appendChild(backToTopBtn);
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Animasi awal
  setTimeout(() => {
    if (bannerContent) bannerContent.style.opacity = '1';
  }, 500);
  
  // Smooth scrolling for navigation links
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Deteksi perangkat mobile untuk banner
  const isMobile = window.innerWidth <= 480;
  
  // Fungsi untuk menyesuaikan banner di mobile
  function adjustMobileBanner() {
    if (!isMobile || !bannerImage) return;
    
    // Sesuaikan posisi crop untuk menghilangkan bagian putih
    const cropTopPercentage = Math.min(window.innerHeight * 0.15, 100);
    bannerImage.style.backgroundPosition = `center ${cropTopPercentage}px`;
    
    // Optimasi ukuran teks
    if (window.innerHeight < 600 && bannerContent) {
      const h1 = bannerContent.querySelector('h1');
      const p = bannerContent.querySelector('p');
      if (h1) h1.style.fontSize = '1.8rem';
      if (p) p.style.fontSize = '0.95rem';
    }
  }
  
  // Panggil saat load dan resize
  adjustMobileBanner();
  window.addEventListener('resize', adjustMobileBanner);
  
  // Preload gambar banner mobile
  function preloadMobileBanner() {
    if (!isMobile || !bannerImage) return;
    
    const img = new Image();
    img.src = 'images/banner_mobile.jpg';
    img.onload = function() {
      bannerImage.style.backgroundImage = `url('${img.src}')`;
    };
  }
  preloadMobileBanner();
  
  // Initialize language
  const preferredLang = localStorage.getItem('preferredLang') || 'id';
  setLang(preferredLang);
  
  // Tambahkan indikator loading bahasa
  const langSwitch = document.querySelector('.language-switch');
  if (langSwitch) {
    const loadingSpan = document.createElement('span');
    loadingSpan.id = 'lang-loading';
    loadingSpan.textContent = ' loading...';
    loadingSpan.style.display = 'none';
    langSwitch.appendChild(loadingSpan);
  }
});

async function loadLangSimple(langCode) {
  try {
    // Tampilkan indikator loading
    const loadingIndicator = document.getElementById('lang-loading');
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    
    const response = await fetch(`lang_${langCode}.txt`);
    
    if (!response.ok) {
      throw new Error(`File bahasa tidak ditemukan: ${response.status}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== "");
    
    const elements = document.querySelectorAll('[data-id]');
    elements.forEach((el, index) => {
      if (lines[index]) {
        el.textContent = lines[index];
      } else {
        console.warn(`Terjemahan tidak ditemukan untuk elemen: ${el.dataset.id}`);
      }
    });
    
    // Update tombol bahasa aktif
    document.querySelectorAll('.language-switch button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === langCode) {
        btn.classList.add('active');
      }
    });
    
    // Simpan preferensi bahasa
    localStorage.setItem('preferredLang', langCode);
    
  } catch (error) {
    console.error('Gagal memuat bahasa:', error);
    alert(`Gagal memuat bahasa: ${error.message}`);
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }
}

function setLang(langCode) {
  loadLangSimple(langCode);
}
