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
  initQuiz();
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
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      toggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      lenis.start();

      // Anchor-Links: erst Lenis starten, dann scrollen
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            lenis.scrollTo(target, { offset: -80, duration: 1.4 });
          }, 50);
        }
      }
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
   QUIZ — branching questionnaire with 2 paths, 3 results
   ============================================================ */
function initQuiz() {
  const section = document.getElementById('quiz');
  if (!section) return;

  /* ─── Question graph ─────────────────────────────────── */
  const Q = {
    q1: {
      text: 'Schaltest du bereits Google Ads?',
      options: [
        { label: 'Ja, ich schalte bereits Ads',               next: 'q2a' },
        { label: 'Nein, aktuell nicht mehr',                  next: 'q2c' },
        { label: 'Nein, ich habe noch keine Ads geschaltet',  next: 'q2b' }
      ]
    },
    /* Path A — already running ads → always Result 2 */
    q2a: {
      text: 'Hast du Conversion-Tracking eingerichtet?',
      options: [
        { label: 'Ja, ich tracke Anfragen oder Käufe',        next: 'q3a' },
        { label: 'Ich bin nicht sicher / weiß nicht genau',   next: 'q3a' },
        { label: 'Nein',                                       next: 'q3a' }
      ]
    },
    q3a: {
      text: 'Weißt du, wie viel dich eine Kundenanfrage über Ads im Durchschnitt kostet?',
      options: [
        { label: 'Ja, das kenne ich',                         next: 'q4a' },
        { label: 'Ungefähr, aber nicht genau',                next: 'q4a' },
        { label: 'Nein, keine Ahnung',                        next: 'q4a' }
      ]
    },
    q4a: {
      text: 'Schickst du deinen Ads-Traffic auf eine dedizierte Landingpage?',
      options: [
        { label: 'Ja, auf eine eigene Seite für die Kampagne', next: 'q5a' },
        { label: 'Nein, auf meine Homepage',                   next: 'q5a' },
        { label: 'Ich bin nicht sicher',                       next: 'q5a' }
      ]
    },
    q5a: {
      text: 'Wie zufrieden bist du mit deinen aktuellen Ergebnissen?',
      options: [
        { label: 'Läuft gut, aber ich will mehr rausholen',   next: 'END', resultId: 2 },
        { label: 'Mittel – ich glaube, da ist mehr drin',     next: 'END', resultId: 2 },
        { label: 'Schlecht – die Ads bringen kaum etwas',     next: 'END', resultId: 2 }
      ]
    },
    /* Path B — new to ads → scored: 3+ pos = Result 1, 2+ neg = Result 3 */
    q2b: {
      text: 'Hast du ein klar definiertes Angebot mit einem festen Preis oder Preisrahmen?',
      options: [
        { label: 'Ja, mein Angebot steht',                         next: 'q3b', score:  1 },
        { label: 'Ich bin gerade dabei, es zu entwickeln',         next: 'q3b', score: -1 },
        { label: 'Nein, noch nicht klar',                          next: 'q3b', score: -1 }
      ]
    },
    q3b: {
      text: 'Hat deine Website eine klare Handlungsaufforderung – also einen konkreten nächsten Schritt, den Besucher*innen direkt sehen und anklicken können?',
      options: [
        { label: 'Ja, es gibt eine Seite mit einem klaren CTA (z.B. Kontaktformular, Buchungslink)', next: 'q4b', score:  1 },
        { label: 'Ich habe eine Website, aber keinen wirklich klaren nächsten Schritt',              next: 'q4b', score: -1 },
        { label: 'Nein, ich habe noch keine Seite',                                                  next: 'q4b', score: -1 }
      ]
    },
    q4b: {
      text: 'Weißt du, wen du genau ansprechen willst – also wer deine ideale Kundschaft ist?',
      options: [
        { label: 'Ja, das ist mir klar',                           next: 'q5b', score:  1 },
        { label: 'Ungefähr, aber noch nicht ganz konkret',         next: 'q5b', score: -1 },
        { label: 'Nein, das ist noch offen',                       next: 'q5b', score: -1 }
      ]
    },
    q5b: {
      text: 'Was ist dein Ziel mit Google Ads?',
      options: [
        { label: 'Ich will planbar neue Anfragen bekommen',                    next: 'END', score:  1 },
        { label: 'Ich will ausprobieren, ob Ads für mich funktionieren',       next: 'END', score:  0 },
        { label: 'Ich bin mir noch nicht sicher, was ich will',               next: 'END', score: -1 }
      ]
    },
    /* Path C — previously ran ads, now paused → always Result 2 (Ads-Analyse) */
    q2c: {
      text: 'Warum hast du die Google Ads pausiert oder gestoppt?',
      options: [
        { label: 'Ich hatte keine Zeit, mich selbst darum zu kümmern',        next: 'q3c' },
        { label: 'Die Ergebnisse waren nicht gut genug',                       next: 'q3c' },
        { label: 'Das Budget war zu hoch oder die Kosten unklar',             next: 'q3c' },
        { label: 'Aus einem anderen Grund',                                    next: 'q3c' }
      ]
    },
    q3c: {
      text: 'Hattest du damals Conversion-Tracking eingerichtet?',
      options: [
        { label: 'Ja, ich habe Anfragen oder Käufe getrackt',                 next: 'q4c' },
        { label: 'Ich bin nicht sicher / weiß es nicht mehr',                 next: 'q4c' },
        { label: 'Nein',                                                       next: 'q4c' }
      ]
    },
    q4c: {
      text: 'Hast du noch eine aktive Website oder Landingpage für dein Angebot?',
      options: [
        { label: 'Ja, sie ist aktuell und hat einen klaren CTA',              next: 'q5c' },
        { label: 'Ja, aber sie müsste überarbeitet werden',                   next: 'q5c' },
        { label: 'Nein, ich habe gerade keine aktive Seite',                  next: 'q5c' }
      ]
    },
    q5c: {
      text: 'Was möchtest du beim Neustart anders machen?',
      options: [
        { label: 'Klare Zahlen und messbaren Erfolg sehen',                   next: 'END', resultId: 2 },
        { label: 'Professionelle Betreuung, ohne alles selbst zu verwalten',  next: 'END', resultId: 2 },
        { label: 'Erst verstehen, was damals nicht funktioniert hat',         next: 'END', resultId: 2 },
        { label: 'Ich weiß es noch nicht genau',                              next: 'END', resultId: 2 }
      ]
    }
  };

  const STEP  = { q1:1, q2a:2, q2b:2, q2c:2, q3a:3, q3b:3, q3c:3, q4a:4, q4b:4, q4c:4, q5a:5, q5b:5, q5c:5 };
  const TOTAL = 5;

  const RESULTS = {
    1: {
      badge: '✅ Du bist bereit',
      title: 'Du bist bereit – lass uns deine Ads zum Laufen bringen',
      text:  'Du hast die Grundlagen, die es braucht, damit Google Ads funktionieren. Ein klares Angebot, eine Seite, eine Zielgruppe. Das ist die Basis, auf der sich eine Kampagne aufbauen lässt, die wirklich Anfragen bringt. Im kostenlosen Erstgespräch schauen wir gemeinsam, ob und wie Ads für dich konkret aussehen könnten.',
      cta:   { label: 'Kostenloses Kennenlerngespräch buchen', href: 'https://meet.brevo.com/nina-zurawski/kennenlerncall' },
      mod:   'green'
    },
    2: {
      badge: '📈 Mehr Potenzial möglich',
      title: 'Deine Ads haben mehr Potenzial – wir holen es raus',
      text:  'Du schaltest bereits Ads, aber irgendwo zwischen Klick und Anfrage geht Potenzial verloren. Das ist häufiger als du denkst, und meistens liegt es an ein paar konkreten Stellschrauben: Tracking, Landingpage, Kampagnenstruktur. In der kostenlosen Ads-Analyse schaue ich mir an, wo bei dir Geld verloren geht und was sich ändern müsste.',
      cta:   { label: 'Kostenlose Ads-Analyse buchen', href: 'https://calendly.com/ninazurawski/ads-analyse' },
      mod:   'green'
    },
    3: {
      badge: '⏳ Noch nicht ganz soweit',
      title: 'Noch nicht ganz soweit – aber das lässt sich ändern',
      text:  'Google Ads können viel, aber nur, wenn die Grundlage stimmt. Ohne klares Angebot und eine Seite mit klarem CTA verbrennt jedes Budget schnell. Das bedeutet nicht, dass Ads für dich keine Option sind, sondern dass es noch einen Schritt davor gibt.',
      links: [
        { label: 'Folge mir auf Instagram', href: 'https://instagram.com/adsmitplan/' },
        { label: 'Verbinde dich auf LinkedIn', href: 'https://linkedin.com/in/nina-zurawski/' }
      ],
      mod:   'salmon'
    }
  };

  /* ─── State ─────────────────────────────────────────── */
  let pos = 0, neg = 0;

  /* ─── DOM ───────────────────────────────────────────── */
  const qWrapEl = section.querySelector('#quizQWrap');
  const resEl   = section.querySelector('#quizResult');
  const fillEl  = section.querySelector('#quizFill');
  const lblEl   = section.querySelector('#quizLabel');
  const textEl  = section.querySelector('#quizQText');
  const optsEl  = section.querySelector('#quizOpts');
  const cardEl  = section.querySelector('#quizCard');

  /* ─── Auto-start: erste Frage direkt anzeigen ───────── */
  renderQ('q1', false);

  /* ─── Render question ───────────────────────────────── */
  function renderQ(id, animate = true) {
    const q    = Q[id];
    const step = STEP[id];

    fillEl.style.width = `${(step / TOTAL) * 100}%`;
    lblEl.textContent  = `Frage ${step} von ${TOTAL}`;

    const draw = () => {
      textEl.textContent = q.text;
      optsEl.innerHTML   = '';
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt.label;
        btn.style.setProperty('--qi', i);
        btn.addEventListener('click', () => pick(opt, btn));
        optsEl.appendChild(btn);
      });
      cardEl.classList.remove('quiz-card--out');
    };

    if (animate) {
      cardEl.classList.add('quiz-card--out');
      setTimeout(draw, 215);
    } else {
      draw();
    }
  }

  /* ─── Handle selection ──────────────────────────────── */
  function pick(opt, btn) {
    optsEl.querySelectorAll('.quiz-option').forEach(b => {
      b.disabled = true;
      if (b !== btn) b.classList.add('quiz-opt--dim');
    });
    btn.classList.add('quiz-opt--chosen');

    if (typeof opt.score === 'number') {
      if (opt.score > 0) pos++;
      else if (opt.score < 0) neg++;
    }

    setTimeout(() => {
      if (opt.next === 'END') {
        showResult(opt.resultId ?? (pos >= 3 ? 1 : 3));
      } else {
        renderQ(opt.next);
      }
    }, 390);
  }

  /* ─── Show result ───────────────────────────────────── */
  function showResult(id) {
    const r = RESULTS[id];
    hide(qWrapEl); show(resEl);

    const ctaHtml = r.cta
      ? `<a href="${r.cta.href}" target="_blank" rel="noopener" class="btn-primary quiz-res-cta"><span class="btn-glow"></span>${r.cta.label}</a>`
      : r.links.map(l => `<a href="${l.href}" target="_blank" rel="noopener" class="btn-ghost quiz-res-link">${l.label}</a>`).join('');

    resEl.innerHTML = `
      <div class="quiz-res-card glass-card quiz-res--${r.mod}">
        <span class="quiz-res-badge">${r.badge}</span>
        <h3 class="quiz-res-title">${r.title}</h3>
        <p class="quiz-res-text">${r.text}</p>
        <div class="quiz-res-actions">${ctaHtml}</div>
        <button class="quiz-restart">↩ Nochmal starten</button>
      </div>`;

    resEl.querySelector('.quiz-restart').addEventListener('click', reset);
    setTimeout(() => resEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  /* ─── Reset ─────────────────────────────────────────── */
  function reset() {
    pos = 0; neg = 0;
    hide(resEl); show(qWrapEl);
    fillEl.style.width = '0%';
    renderQ('q1', false);
  }

  /* ─── Visibility helpers ────────────────────────────── */
  function show(el) { el.classList.remove('quiz-hidden'); }
  function hide(el) { el.classList.add('quiz-hidden'); }
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
