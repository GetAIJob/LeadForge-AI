'use strict';

/* =============================================================
   Velvet Nail Bar — main.js
   LeadForge AI · GrowthSite Lab
   ============================================================= */

// =============================================================
// Header scroll: transparent → opaque (.scrolled)
// =============================================================
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// =============================================================
// Burger / Mobile Nav
// =============================================================
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta') : [];

function openMenu() {
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Close navigation menu');
  mobileNav.classList.add('open');
  mobileNav.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open navigation menu');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.classList.contains('open')) {
      closeMenu();
      burger.focus();
    }
  });
}

// =============================================================
// Smooth scroll with header offset
// =============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = header ? header.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});

// =============================================================
// Scroll Reveal via IntersectionObserver
// =============================================================
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: show all immediately
  revealEls.forEach(el => el.classList.add('visible'));
}

// =============================================================
// Form validation & simulated submission
// =============================================================
const bookingForm = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

function getField(name) {
  return bookingForm ? bookingForm.querySelector(`[name="${name}"]`) : null;
}

function getErrorEl(field) {
  return field ? field.parentElement.querySelector('.field-error') : null;
}

function showFieldError(field, message) {
  if (!field) return;
  field.classList.add('error');
  const errEl = getErrorEl(field);
  if (errEl) errEl.textContent = message;
}

function clearFieldError(field) {
  if (!field) return;
  field.classList.remove('error');
  const errEl = getErrorEl(field);
  if (errEl) errEl.textContent = '';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateForm() {
  let isValid = true;

  const nameField = getField('name');
  const emailField = getField('email');
  const phoneField = getField('phone');
  const serviceField = getField('service');

  // Clear previous errors
  [nameField, emailField, phoneField, serviceField].forEach(clearFieldError);

  // Name
  if (!nameField || nameField.value.trim() === '') {
    showFieldError(nameField, 'Please enter your name.');
    isValid = false;
  }

  // Email
  if (!emailField || emailField.value.trim() === '') {
    showFieldError(emailField, 'Please enter your email address.');
    isValid = false;
  } else if (!isValidEmail(emailField.value)) {
    showFieldError(emailField, 'Please enter a valid email address.');
    isValid = false;
  }

  // Phone
  if (!phoneField || phoneField.value.trim() === '') {
    showFieldError(phoneField, 'Please enter your phone number.');
    isValid = false;
  }

  // Service
  if (!serviceField || serviceField.value === '') {
    showFieldError(serviceField, 'Please select a service.');
    isValid = false;
  }

  return isValid;
}

// Clear error on input
['name', 'email', 'phone', 'service'].forEach(fieldName => {
  const field = getField(fieldName);
  if (field) {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  }
});

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Hide previous messages
    if (formSuccess) formSuccess.hidden = true;
    if (formError) formError.hidden = true;

    if (!validateForm()) return;

    // Simulate submission
    const submitBtn = bookingForm.querySelector('.form-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    setTimeout(() => {
      // Simulate 90% success rate for demo
      const succeeded = Math.random() > 0.1;

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Appointment';
      }

      if (succeeded) {
        bookingForm.reset();
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        if (formError) {
          formError.hidden = false;
          formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 900);
  });
}
