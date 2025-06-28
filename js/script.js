
    // Inisialisasi scroll dan transisi
    document.addEventListener('DOMContentLoaded', function() {
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
        bannerImage.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        
        // Efek fade out pada konten banner
        if (scrollPosition > bannerHeight * 0.3) {
          const opacity = 1 - (scrollPosition / (bannerHeight * 0.7));
          bannerContent.style.opacity = opacity < 0 ? '0' : opacity;
          scrollIndicator.style.opacity = opacity < 0 ? '0' : opacity;
        }
        
        // Tampilkan navigasi ketika scroll ke bawah
        if (scrollPosition > lastScrollTop && scrollPosition > 100) {
          mainNav.classList.add('visible');
          if (scrollPosition > 200) {
            mainNav.classList.add('scrolled');
          }
        } 
        lastScrollTop = scrollPosition;
        
        // Tampilkan konten utama
        if (scrollPosition > bannerHeight * 0.4) {
          mainContent.classList.add('visible');
        }
        
        // Sembunyikan navigasi ketika scroll ke atas dan di atas banner
        if (scrollPosition < 100) {
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
      
      window.addEventListener('scroll', function () {
        const btn = document.getElementById('backToTop');
        if (window.scrollY > 300) {
          btn.style.display = 'block';
        } else {
          btn.style.display = 'none';
        }
      });
      
      // Animasi awal
      setTimeout(() => {
        bannerContent.style.opacity = '1';
      }, 500);
      
      // Smooth scrolling for navigation links
      navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          // Update active nav link
          navLinks.forEach(link => link.classList.remove('active'));
          this.classList.add('active');
          
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        });
      });
    });

    async function loadLangSimple(langCode) {
      const response = await fetch(`lang_${langCode}.txt`);
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
    }
    
    function setLang(langCode) {
      loadLangSimple(langCode);
    }
    
    window.addEventListener('DOMContentLoaded', () => setLang('id'));
  
