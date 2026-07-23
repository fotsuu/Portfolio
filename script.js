/* ===== script.js ===== */

// ──────────────────────────────
// 1. GLOBAL WINDOW EXPORTS (For HTML onclick attributes)
// ──────────────────────────────
window.copyEmailToClipboard = function copyEmailToClipboard() {
  const email = 'diamanteeric0501@gmail.com';
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      showToast('📋 Email copied to clipboard: diamanteeric0501@gmail.com');
    }).catch(() => {
      fallbackCopyEmail(email);
    });
  } else {
    fallbackCopyEmail(email);
  }
};

function fallbackCopyEmail(email) {
  const textArea = document.createElement('textarea');
  textArea.value = email;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('📋 Email copied to clipboard: diamanteeric0501@gmail.com');
  } catch (err) {
    showToast('📧 Email: diamanteeric0501@gmail.com');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

window.handleFormSubmit = function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('formSuccess');
  const form = document.getElementById('contactForm');

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;

  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Direct AJAX Submission via FormSubmit (No Outlook required)
  fetch('https://formsubmit.co/ajax/diamanteeric0501@gmail.com', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      message: message,
      _subject: `New Portfolio Inquiry from ${name} (${email})`,
      _captcha: 'false'
    })
  })
  .then(res => res.json())
  .then(data => {
    success.style.display = 'block';
    success.innerHTML = '✅ <strong>Message Sent Successfully!</strong><br><span style="font-size:0.85rem;opacity:0.9;">Your message has been delivered directly to diamanteeric0501@gmail.com. I will reply within 24 hours.</span>';
    success.classList.add('show');
    showToast('✉️ Message delivered directly to Eric!');
    form.reset();
  })
  .catch(err => {
    // Graceful web-only fallback (No Outlook opening)
    const textToCopy = `To: diamanteeric0501@gmail.com\nFrom: ${name} (${email})\n\n${message}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy);
    }
    success.style.display = 'block';
    success.innerHTML = `✅ <strong>Inquiry Saved & Copied!</strong><br><span style="font-size:0.85rem;opacity:0.9;">Message copied to clipboard. You can paste and send directly to <strong>diamanteeric0501@gmail.com</strong>.</span>`;
    success.classList.add('show');
    showToast('📋 Message copied to clipboard!');
    form.reset();
  })
  .finally(() => restoreBtn());

  function restoreBtn() {
    btn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>';
    btn.disabled = false;
    btn.style.opacity = '1';
    setTimeout(() => {
      success.classList.remove('show');
    }, 10000);
  }
};

// ──────────────────────────────
// 2. DOM INITIALIZATION
// ──────────────────────────────
function initApp() {
  // Navbar Scroll & ScrollSpy
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      navbar.style.backgroundColor = 'rgba(7, 10, 18, 0.95)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.backgroundColor = 'rgba(7, 10, 18, 0.85)';
    }

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

  // Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksEl.classList.toggle('open');
    });

    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksEl.classList.remove('open');
      });
    });
  }

  // Project Category Filtering
  const filterContainer = document.getElementById('projectFilters');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');

  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  }

  // Skills Category Filtering
  const skillFilterContainer = document.getElementById('skillCategoryFilters');
  const skillGroups = document.querySelectorAll('#skillsWrapper .skills-group');

  if (skillFilterContainer) {
    skillFilterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.skill-cat-btn');
      if (!btn) return;

      skillFilterContainer.querySelectorAll('.skill-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const catValue = btn.getAttribute('data-skillcat');

      skillGroups.forEach(group => {
        const groupCat = group.getAttribute('data-skillgroup');
        if (catValue === 'all' || groupCat === catValue) {
          group.style.display = 'block';
          group.style.opacity = '1';
        } else {
          group.style.display = 'none';
          group.style.opacity = '0';
        }
      });
    });
  }

  // Interactive 3D Tilt
  const tiltCards = document.querySelectorAll('.interactive-tilt');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
