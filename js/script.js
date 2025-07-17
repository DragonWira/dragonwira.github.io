document.addEventListener('DOMContentLoaded', function() {
  const bannerSection = document.querySelector('.banner-section');
  const bannerImage = document.querySelector('.banner-image');
  const bannerContent = document.querySelector('.banner-content');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const mainNav = document.getElementById('mainNav');
  const mainContent = document.getElementById('mainContent');
  const navLinks = document.querySelectorAll('nav a');
  
  let lastScrollTop = 0;
  
  // Gabungkan semua logika scroll
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const bannerHeight = bannerSection.offsetHeight;
    const btn = document.getElementById('backToTop');
    
    // Efek parallax
    bannerImage.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    
    // Fade out banner
    if (scrollPosition > bannerHeight * 0.3) {
      const opacity = 1 - (scrollPosition / (bannerHeight * 0.7));
      bannerContent.style.opacity = opacity < 0 ? '0' : opacity;
      scrollIndicator.style.opacity = opacity < 0 ? '0' : opacity;
    }
    
    // Navigasi dan back-to-top
    if (scrollPosition > lastScrollTop && scrollPosition > 100) {
      mainNav.classList.add('visible');
      if (scrollPosition > 200) {
        mainNav.classList.add('scrolled');
      }
    } 
    lastScrollTop = scrollPosition;
    
    if (scrollPosition > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
    
    // Konten utama
    if (scrollPosition > bannerHeight * 0.4) {
      mainContent.classList.add('visible');
    }
    
    if (scrollPosition < 100) {
      mainNav.classList.remove('visible');
      mainNav.classList.remove('scrolled');
    }
    
    // Navigasi aktif
    const sections = document.querySelectorAll('section');
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= (sectionTop - 100)) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  });
  
  // Animasi awal
  setTimeout(() => {
    bannerContent.style.opacity = '1';
  }, 500);
  
  // Smooth scrolling untuk navigasi
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
      this.classList.add('active');
      this.setAttribute('aria-current', 'page');
      
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });
});

async function loadLangSimple(langCode) {
  try {
    const response = await fetch(`lang_${langCode}.txt`);
    if (!response.ok) throw new Error(`Gagal memuat file bahasa: ${langCode}`);
    const text = await response.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== "");
    
    const elements = document.querySelectorAll('[data-id]');
    elements.forEach((el, index) => {
      if (lines[index]) {
        el.textContent = lines[index];
      }
    });
    
    document.querySelectorAll('.language-switch button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('onclick').includes(langCode)) {
        btn.classList.add('active');
      }
    });
  } catch (error) {
    console.error('Error memuat bahasa:', error);
    alert('Gagal memuat bahasa. Menggunakan teks default.');
  }
}

function setLang(langCode) {
  loadLangSimple(langCode);
}

window.addEventListener('DOMContentLoaded', () => setLang('id'));
