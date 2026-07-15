/* ===== script.js ===== */

// ──────────────────────────────
// 1. TYPEWRITER EFFECT
// ──────────────────────────────
const roles = [
  'Full-Stack Developer using AI 🤖',
  'Student of Information Technology 🎓',
  'System Developer using AI 🛠️',
  'Cloud Enthusiast ☁️',
  'Mobile App Developer 📱',
  'Problem Solver 🧠',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeWrite() {
  const current = roles[roleIdx];
  if (!deleting) {
    tw.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWrite, 1800);
      return;
    }
  } else {
    tw.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeWrite, deleting ? 60 : 90);
}
typeWrite();

// ──────────────────────────────
// 2. NAVBAR SCROLL + ACTIVE
// ──────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Scrolled style
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  // Active nav link
  let currentSection = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) currentSection = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

// ──────────────────────────────
// 3. HAMBURGER MENU
// ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

// ──────────────────────────────
// 4. INTERSECTION OBSERVER – REVEAL
// ──────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger within same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ──────────────────────────────
// 5. SKILL BAR ANIMATION
// ──────────────────────────────
const skillBars = document.querySelectorAll('.pill-fill');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('animated'), 200);
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => barObserver.observe(bar));

// ──────────────────────────────
// 6. FLOATING PARTICLES (BG)
// ──────────────────────────────
(function createParticles() {
  const canvas = document.getElementById('bgCanvas');
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = Math.random() * 12 + 8;
    const delay = Math.random() * 10;
    const color = Math.random() > 0.5 ? 'rgba(108,99,255,0.6)' : 'rgba(0,212,170,0.5)';
    p.style.cssText = `
      position:absolute;
      left:${x}%; top:${y}%;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:${color};
      animation: floatParticle ${dur}s ${delay}s ease-in-out infinite alternate;
      pointer-events:none;
    `;
    canvas.appendChild(p);
  }
})();

// Particle float keyframes via style tag
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes floatParticle {
  0%   { transform: translateY(0px) translateX(0px); opacity: 0.4; }
  25%  { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
  50%  { transform: translateY(-10px) translateX(-15px); opacity: 0.6; }
  75%  { transform: translateY(-30px) translateX(5px); opacity: 0.9; }
  100% { transform: translateY(-5px) translateX(-10px); opacity: 0.3; }
}`;
document.head.appendChild(styleSheet);

// ──────────────────────────────
// 7. CONTACT FORM HANDLER
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

  // Change button to sending state
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  if (hasAccessKey && navigator.onLine) {
    // If Web3Forms Access Key is set and online, submit via API
    const formData = new FormData(form);
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        success.textContent = "✅ Message sent successfully! Eric will get back to you soon.";
        success.classList.add('show');
        form.reset();
      } else {
        // Fallback to mailto if API reports error
        triggerMailto(name, email, message);
      }
    })
    .catch(() => {
      // Fallback to mailto if network error
      triggerMailto(name, email, message);
    })
    .finally(() => {
      restoreButton();
    });
  } else {
    // Fallback: mailto link
    triggerMailto(name, email, message);
    restoreButton();
  }

  function triggerMailto(n, e, m) {
    const subject = encodeURIComponent(`Portfolio Contact from ${n}`);
    const body = encodeURIComponent(`Name: ${n}\nEmail: ${e}\n\nMessage:\n${m}`);
    window.location.href = `mailto:diamanteeric0501@gmail.com?subject=${subject}&body=${body}`;
    success.innerHTML = `📬 Email draft opened! Click 'Send' in your mail app.<br><small style="font-size:0.75rem;opacity:0.8;">To send directly from the webpage, see the instructions in index.html.</small>`;
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

// ──────────────────────────────
// 8. SMOOTH AVATAR IMAGE LOAD
// ──────────────────────────────
const profilePhoto = document.getElementById('profile-photo');
if (profilePhoto) {
  profilePhoto.addEventListener('error', function () {
    // Fallback: initials avatar
    const wrap = profilePhoto.parentElement;
    profilePhoto.style.display = 'none';
    const initials = document.createElement('div');
    initials.style.cssText = `
      width:100%; height:100%;
      display:flex; align-items:center; justify-content:center;
      font-size:4rem; font-weight:900;
      background: linear-gradient(135deg, #6c63ff, #00d4aa);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
      font-family:'Outfit',sans-serif;
    `;
    initials.textContent = 'EED';
    wrap.appendChild(initials);
  });
}

// ──────────────────────────────
// 9. CURSOR GLOW (desktop only)
// ──────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;
    width:300px; height:300px;
    border-radius:50%;
    background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%);
    pointer-events:none;
    z-index:0;
    transform:translate(-50%,-50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ──────────────────────────────
// 10. STAT COUNTER ANIMATION
// ──────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = null;
  const isText = isNaN(parseInt(target));
  if (isText) return;
  const num = parseInt(target);
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const val = Math.floor(progress * num);
    el.textContent = val + '+';
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const original = entry.target.textContent;
      animateCounter(entry.target, original);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));
