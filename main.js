/* ============================================================
   main.js — Nina Zurawski Website (optimised)
   ============================================================ */

'use strict';

window.addEventListener('load', initApp);

function initApp() {
  initLenis();
  initNavigation();
  initHeroEntrance();
  initTextAnimations();
  initScrollAnimations();
  initFAQ();
  initMobileMenu();
  initCookieConsent();
}

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });

  gsap.registerPlugin(ScrollTrigger);

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
  const nav = document.getElementById('siteNav');

  lenis.on('scroll', ({ scroll }) => {
    nav.classList.toggle('is-scrolled', scroll > 60);
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      }
    });
  });

  gsap.from('#siteNav', {
    y: -20, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2,
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  const links = menu.querySelectorAll('.mobile-link, .mobile-cta');

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    menu.classList.toggle('is-open', isOpen);
    lenis[isOpen ? 'stop' : 'start']();

    if (isOpen) {
      gsap.from(links, {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.08,
        ease: 'power3.out', delay: 0.15,
      });
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      lenis.start();
    });
  });
}

/* ============================================================
   HERO ENTRANCE
   ============================================================ */
function initHeroEntrance() {
  gsap.to(['.hero-eyebrow', '.hero-sub', '.hero-ctas', '.hero-availability', '.hero-social-proof'], {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.25,
  });

  gsap.to('.scroll-indicator', {
    opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.2,
  });
}

/* ============================================================
   HEADING ANIMATIONS (kein SplitType erforderlich)
   ============================================================ */
function initTextAnimations() {
  document.querySelectorAll('[data-split-heading]').forEach(el => {
    const isHero = el.closest('#hero');

    if (isHero) {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 1, ease: 'power4.out', delay: 0.5,
      });
      return;
    }

    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* ============================================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  // Generic reveal
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0) / 1000;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, delay,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // About section entrance (desktop only)
  if (!window.matchMedia('(max-width: 768px)').matches) {
    gsap.from('.about-image-placeholder', {
      opacity: 0, x: -60, scale: 0.95, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-about', start: 'top 75%' },
    });
    gsap.from('.about-badge', {
      opacity: 0, x: 30, duration: 0.8, ease: 'power3.out', delay: 0.4,
      scrollTrigger: { trigger: '.section-about', start: 'top 75%' },
    });
  }

  // Process node pop-in
  gsap.utils.toArray('.pt-node').forEach((node, i) => {
    gsap.from(node, {
      scale: 0.5, duration: 0.45, ease: 'back.out(2)',
      scrollTrigger: { trigger: node.closest('.pt-step') || node, start: 'top 85%', once: true },
      delay: 0.35 + i * 0.08,
    });
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item.is-open').forEach(open => {
        open.classList.remove('is-open');
        open.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================
   COOKIE CONSENT
   ============================================================ */
function initCookieConsent() {
  const banner  = document.getElementById('cookieBanner');
  const overlay = document.getElementById('cookieOverlay');
  if (!banner || !overlay) return;

  const stored = getConsentData();
  if (stored) { applyConsent(stored); return; }

  setTimeout(() => {
    banner.classList.add('is-visible');
    overlay.classList.add('is-visible');
  }, 900);

  const viewMain     = document.getElementById('cookieViewMain');
  const viewSettings = document.getElementById('cookieViewSettings');

  function hideBanner() {
    banner.classList.remove('is-visible');
    overlay.classList.remove('is-visible');
  }

  function showSettings() {
    viewMain.classList.add('cookie-view--hidden');
    viewSettings.classList.remove('cookie-view--hidden');
    banner.scrollTop = 0;
  }

  function showMain() {
    viewSettings.classList.add('cookie-view--hidden');
    viewMain.classList.remove('cookie-view--hidden');
    banner.scrollTop = 0;
  }

  function getSelection() {
    return {
      essential:  true,
      functional: document.getElementById('functionalToggle')?.checked || false,
      statistik:  document.getElementById('statistikToggle')?.checked  || false,
      marketing:  document.getElementById('marketingToggle')?.checked  || false,
    };
  }

  function acceptAll() {
    const c = { essential: true, functional: true, statistik: true, marketing: true };
    saveConsent(c); applyConsent(c); hideBanner();
  }

  function rejectAll() {
    const c = { essential: true, functional: false, statistik: false, marketing: false };
    saveConsent(c); applyConsent(c); hideBanner();
  }

  document.getElementById('cookieAcceptAll')   ?.addEventListener('click', acceptAll);
  document.getElementById('cookieRejectAll')   ?.addEventListener('click', rejectAll);
  document.getElementById('cookieShowSettings')?.addEventListener('click', showSettings);
  document.getElementById('cookieAcceptAll2')  ?.addEventListener('click', acceptAll);
  document.getElementById('cookieRejectAll2')  ?.addEventListener('click', rejectAll);
  document.getElementById('cookieAcceptSelection')?.addEventListener('click', () => {
    const c = getSelection(); saveConsent(c); applyConsent(c); hideBanner();
  });
  document.getElementById('cookieBack')?.addEventListener('click', showMain);
}

function saveConsent(consent) {
  localStorage.setItem('cookie_consent', JSON.stringify({
    ...consent, timestamp: new Date().toISOString(),
  }));
}

function getConsentData() {
  try {
    const raw = localStorage.getItem('cookie_consent');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function applyConsent(consent) {
  if (consent.marketing)  loadMarketingScripts();
  if (consent.statistik)  loadStatistikScripts();
  if (consent.functional) loadFunctionalScripts();
}

function loadMarketingScripts()  { /* Google Ads Conversion-Tracking hier einbinden */ }
function loadStatistikScripts()  { /* z.B. Matomo */ }
function loadFunctionalScripts() { /* z.B. erweiterte Einbettungen */ }

/* ============================================================
   RESIZE — ScrollTrigger refresh
   ============================================================ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});

/* ============================================================
   GSAP FALLBACK (kein GSAP geladen)
   ============================================================ */
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-reveal], [data-split-heading]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
