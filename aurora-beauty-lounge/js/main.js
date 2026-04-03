'use strict';

// ===== HEADER SCROLL =====
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');

function openMenu() {
  burger.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  burger.classList.add('open');
}

function closeMenu() {
  burger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  burger.classList.remove('open');
}

burger.addEventListener('click', () => {
  burger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
});

// Close on nav link click
mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') closeMenu();
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerHeight = header.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
    closeMenu();
  });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== FORM HANDLING =====
const form = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

function validateField(field) {
  const error = field.parentElement.querySelector('.field-error');
  let message = '';

  if (field.required && !field.value.trim()) {
    message = 'This field is required.';
  } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    message = 'Please enter a valid email address.';
  }

  if (error) error.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  return !message;
}

if (form) {
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulated form submission (replace with actual Formspree endpoint)
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.focus();
    } catch {
      formError.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request Appointment';
    }
  });
}
