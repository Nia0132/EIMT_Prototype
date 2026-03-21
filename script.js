// ============ TYPEWRITER ANIMATION ============
const phrases = [
  "Selamat datang di EIMT.",
  "Satu portal.",
  "Satu kepercayaan.",
  "Ekosistem Informasi Moneter Terpadu."
];
const delays = [800, 600, 600, 2000];
const typeSpeed = 55;
const deleteSpeed = 30;

async function typewriterAnimation() {
  const textElement = document.getElementById('typewriterText');

  for (let phraseIndex = 0; phraseIndex < phrases.length; phraseIndex++) {
    const phrase = phrases[phraseIndex];

    // Type
    for (let i = 0; i < phrase.length; i++) {
      textElement.textContent = phrase.substring(0, i + 1);
      await new Promise(resolve => setTimeout(resolve, typeSpeed));
    }

    // Wait
    await new Promise(resolve => setTimeout(resolve, delays[phraseIndex]));

    // Delete (but not for last phrase)
    if (phraseIndex < phrases.length - 1) {
      for (let i = phrase.length; i > 0; i--) {
        textElement.textContent = phrase.substring(0, i - 1);
        await new Promise(resolve => setTimeout(resolve, deleteSpeed));
      }
    }
  }
}

// ============ INTERSECTION OBSERVER FOR FADE-IN ============
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Stagger animation for child cards
      const cards = entry.target.querySelectorAll('[data-delay]');
      cards.forEach(card => {
        const delay = parseInt(card.dataset.delay) || 0;
        setTimeout(() => {
          card.style.animation = `fadeIn 0.6s ease forwards`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, delay);
      });
    }
  });
}, observerOptions);

document.querySelectorAll('.section-header, .data-card, .status-card, .module-card, .news-card, .calculator-box').forEach(el => {
  observer.observe(el);
});

// ============ NAVBAR SCROLL BEHAVIOR ============
let lastScroll = 0;
const progressBar = document.querySelector('.scroll-progress-bar');
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  progressBar.style.width = scrollPercent + '%';

  if (scrollTop > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  updateActiveNav();
  updateBackToTopButton();
});

// ============ ACTIVE NAV LINK ============
function updateActiveNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
}

// ============ BACK TO TOP BUTTON ============
function updateBackToTopButton() {
  const btn = document.getElementById('backToTopBtn');
  if (window.scrollY > 500) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ============ SMOOTH SCROLL FUNCTION ============
function smoothScrollTo(selector) {
  const target = document.querySelector(selector);
  if (target) {
    const offsetTop = target.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// ============ HAMBURGER MENU ============
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

hamburgerBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ============ ACCORDION ============
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    item.classList.toggle('open');

    // Close other items
    document.querySelectorAll('.accordion-item').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('open');
      }
    });
  });
});

// ============ INFLATION CALCULATOR ============
function calculateInflation() {
  const currentValue = parseFloat(document.getElementById('currentValue').value) || 0;
  const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 0;

  const futureValue = currentValue / Math.pow(1 + inflationRate / 100, years);
  const powerLoss = currentValue - futureValue;

  document.getElementById('futureValue').textContent = 'Rp ' + Math.round(futureValue).toLocaleString('id-ID');
  document.getElementById('powerLoss').textContent = 'Rp ' + Math.round(powerLoss).toLocaleString('id-ID');
}

// Listen to calculator inputs for real-time calculation
['currentValue', 'inflationRate', 'years'].forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener('input', calculateInflation);
  }
});

// ============ FILTER NEWS ============
function filterNews(category) {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  document.querySelectorAll('.news-card').forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
      setTimeout(() => {
        card.classList.add('visible');
      }, 10);
    } else {
      card.style.display = 'none';
      card.classList.remove('visible');
    }
  });
}

// ============ MODAL: PORTAL INTERNAL ============
const portalBtn = document.getElementById('portalBtn');
const portalModal = document.getElementById('portalModal');

portalBtn.addEventListener('click', () => {
  portalModal.classList.add('active');
});

function closePortalModal() {
  portalModal.classList.remove('active');
}

portalModal.addEventListener('click', (e) => {
  if (e.target === portalModal) {
    closePortalModal();
  }
});

function submitPortalLogin(event) {
  event.preventDefault();
  alert('Ini adalah prototype. Akses portal internal tidak tersedia pada versi demonstrasi ini.');
  closePortalModal();
}

// ============ REPORT FORM ============
function submitReport(event) {
  event.preventDefault();

  const form = document.getElementById('reportForm');
  let isValid = true;

  // Simple validation
  const name = document.getElementById('reportName').value.trim();
  const email = document.getElementById('reportEmail').value.trim();
  const message = document.getElementById('reportMessage').value.trim();

  if (!name || !email || !message) {
    alert('Harap isi semua field');
    return;
  }

  alert('✓ Pesan berhasil dikirim. (Ini adalah simulasi)');
  form.reset();
}

// ============ ACCESSIBILITY: FONT SIZE ADJUSTMENT ============
let fontSizeOffset = 0;

function adjustFontSize(delta) {
  fontSizeOffset += delta * 2;
  document.body.style.fontSize = (16 + fontSizeOffset) + 'px';
}

// ============ ACCESSIBILITY: HIGH CONTRAST MODE ============
function toggleContrast() {
  document.body.classList.toggle('high-contrast');
  if (document.body.classList.contains('high-contrast')) {
    // Store preference
    localStorage.setItem('eimt-contrast', 'on');
    // Apply high contrast styles
    document.body.style.filter = 'contrast(1.2)';
  } else {
    localStorage.setItem('eimt-contrast', 'off');
    document.body.style.filter = 'contrast(1)';
  }
}

// Load accessibility preferences
if (localStorage.getItem('eimt-contrast') === 'on') {
  document.body.style.filter = 'contrast(1.2)';
  document.body.classList.add('high-contrast');
}

// ============ INITIALIZE ============
window.addEventListener('DOMContentLoaded', () => {
  typewriterAnimation();
  calculateInflation();
});

// Smooth scroll offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});
