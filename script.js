/* ===== script.js ===== */

// ──────────────────────────────
// 1. NAVBAR SCROLL ACTIVE STATE + GLASSMOPHISM SCROLL EFFECTS
// ──────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleScroll() {
  // Scrolled shadow effect
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    navbar.style.backgroundColor = 'rgba(9, 13, 22, 0.9)';
  } else {
    navbar.style.boxShadow = 'none';
    navbar.style.backgroundColor = 'rgba(9, 13, 22, 0.8)';
  }

  // Active section tracking (ScrollSpy)
  let currentSection = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      currentSection = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
  });
}
window.addEventListener('scroll', handleScroll, { passive: true });

// ──────────────────────────────
// 2. MOBILE HAMBURGER NAVIGATION
// ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close menu when link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

// ──────────────────────────────
// 3. INTERSECTION OBSERVER FOR FADE-IN REVEAL
// ──────────────────────────────
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Subtle staggered delays for adjacent items
        const delay = idx * 60;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback if IntersectionObserver is not supported
  revealElements.forEach(el => el.classList.add('visible'));
}

// ──────────────────────────────
// 4. CONTACT FORM SUBMISSION (WITH WEB3FORMS & MAILTO FALLBACK)
// ──────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('formSuccess');
  const form = document.getElementById('contactForm');
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  
  const keyInput = form.querySelector('input[name="access_key"]');
  const hasAccessKey = keyInput && keyInput.value && !keyInput.value.includes('YOUR_ACCESS_KEY');

  // Set button sending state
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  if (hasAccessKey && navigator.onLine) {
    const formData = new FormData(form);
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        success.textContent = "✅ Message sent successfully! I will get back to you soon.";
        success.classList.add('show');
        form.reset();
      } else {
        triggerMailtoFallback(name, email, message);
      }
    })
    .catch(() => {
      triggerMailtoFallback(name, email, message);
    })
    .finally(() => {
      restoreButton();
    });
  } else {
    triggerMailtoFallback(name, email, message);
    restoreButton();
  }

  function triggerMailtoFallback(n, e, m) {
    const subject = encodeURIComponent(`Portfolio Contact from ${n}`);
    const body = encodeURIComponent(`Name: ${n}\nEmail: ${e}\n\nMessage:\n${m}`);
    window.location.href = `mailto:diamanteeric0501@gmail.com?subject=${subject}&body=${body}`;
    
    success.innerHTML = `📬 Email draft opened! Please click 'Send' in your mail application.<br><small style="font-size:0.75rem;opacity:0.8;">To send directly from this webpage, see the instructions in index.html.</small>`;
    success.classList.add('show');
    form.reset();
  }

  function restoreButton() {
    btn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>';
    btn.disabled = false;
    btn.style.opacity = '1';
    setTimeout(() => success.classList.remove('show'), 8000);
  }
}
