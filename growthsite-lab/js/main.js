// =====================================================
// GROWTHSITE LAB — MAIN SCRIPT
// risesitelab.com | Powered by LeadForge AI
// v2.0 — Formspree integration + EU consent checkbox
// =====================================================

// ─── FORMSPREE SETUP ────────────────────────────────
// 1. Go to https://formspree.io and create a free account
// 2. Create a new form → set email to: hello@risesitelab.com
// 3. Copy your form ID and replace 'YOUR_FORMSPREE_ID' below
// 4. Free tier: 50 submissions/month (upgrade for more)
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

// ─── STRIPE SETUP ───────────────────────────────────
// After Formspree sends the notification email, redirect to Stripe Payment Link:
// 1. Go to https://dashboard.stripe.com → Payment Links → Create
// 2. Replace the URL below with your Stripe Payment Link
// 3. On form success, redirect user there (or open in new tab)
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/YOUR_PAYMENT_LINK';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Header scroll behavior ─────────────────────────
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ─── Mobile burger menu ──────────────────────────────
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  const closeMenu = () => {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      burger.classList.add('is-open');
      nav.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  // ─── Smooth scroll ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id     = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ─── Scroll reveal ───────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    );
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  // ─── Contact form ────────────────────────────────────
  const form         = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');
  const formErrGlob  = document.getElementById('formErrorGlobal');

  if (!form) return;

  // Clear errors on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('is-error');
      const errEl = document.getElementById(field.id + 'Error');
      if (errEl) errEl.textContent = '';
    });
  });

  const setError = (id, msg) => {
    const field = document.getElementById(id);
    const errEl = document.getElementById(id + 'Error');
    if (field) field.classList.add('is-error');
    if (errEl) errEl.textContent = msg;
  };

  const validate = () => {
    let ok = true;

    const name = document.getElementById('name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      setError('name', 'Please enter your full name.');
      ok = false;
    }

    const email = document.getElementById('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      setError('email', 'Please enter a valid email address.');
      ok = false;
    }

    const phone = document.getElementById('phone');
    if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 7) {
      setError('phone', 'Please enter a valid phone number.');
      ok = false;
    }

    const message = document.getElementById('message');
    if (!message.value.trim() || message.value.trim().length < 10) {
      setError('message', 'Please write a message (at least 10 characters).');
      ok = false;
    }

    // EU consent checkbox — required
    const consent = document.getElementById('workConsent');
    if (consent && !consent.checked) {
      setError('workConsent', 'You must confirm work commencement to proceed.');
      ok = false;
    }

    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset state
    formSuccess.classList.remove('is-visible');
    formErrGlob.classList.remove('is-visible');
    form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');

    if (!validate()) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    try {
      if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
        // Development mode: simulate send
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.warn('[GrowthSite Lab] Formspree ID not configured. Replace YOUR_FORMSPREE_ID in main.js');
      } else {
        // Production: send to Formspree → email to hello@risesitelab.com
        const res = await fetch(FORMSPREE_URL, {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(form),
        });
        if (!res.ok) throw new Error('Server error');
      }

      form.reset();
      formSuccess.classList.add('is-visible');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Redirect to Stripe after 2s (when payment link is configured)
      if (STRIPE_PAYMENT_LINK !== 'https://buy.stripe.com/YOUR_PAYMENT_LINK') {
        setTimeout(() => {
          window.location.href = STRIPE_PAYMENT_LINK;
        }, 2000);
      }

    } catch {
      formErrGlob.classList.add('is-visible');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled    = false;
    }
  });

});
