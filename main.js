/* ============================================================
   main.js — Nina Zurawski Website
   ============================================================ */

'use strict';

// ─── Wait for all scripts to load ───────────────────────────
window.addEventListener('load', () => {
  initApp();
});

function initApp() {
  initPreloader();
}

/* ============================================================
   PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader   = document.getElementById('preloader');
  const bar         = document.getElementById('preloaderBar');
  const counter     = document.getElementById('preloaderCounter');
  const plTagline   = document.querySelector('.preloader-tagline');
  const plCounterEl = document.querySelector('.preloader-counter');

  let progress = 0;

  // Animate logo lockup in
  gsap.to('.preloader-logo', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.15,
  });

  gsap.to([plTagline, plCounterEl], {
    opacity: 1,
    duration: 0.6,
    delay: 0.65,
  });

  // Progress bar fill
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      counter.textContent = '100';

      // Short pause then reveal
      setTimeout(dismissPreloader, 400);
    } else {
      bar.style.width = progress + '%';
      counter.textContent = Math.floor(progress);
    }
  }, 80);

  function dismissPreloader() {
    // Fade logo out
    gsap.to('.preloader-inner', {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.in',
    });

    // Slide panels out
    gsap.to('.pl-panel--left', {
      xPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      delay: 0.3,
    });

    gsap.to('.pl-panel--right', {
      xPercent: 100,
      duration: 0.9,
      ease: 'power3.inOut',
      delay: 0.3,
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.classList.remove('is-loading');
        // Boot everything else
        initCore();
      },
    });
  }
}

/* ============================================================
   CORE INIT (after preloader)
   ============================================================ */
function initCore() {
  initLenis();
  initScrollProgress();
  initNavigation();
  initHeroCanvas();     // particle network animation
  initHeroEntrance();   // GSAP text reveals
  initCustomCursor();
  initTextAnimations();
  initScrollAnimations();
  initMagneticButtons();
  initCardTilt();
  initCounters();
  initFAQ();
  initGlitchEffect();
  initContactParticles();
  initMobileMenu();
}

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  lenis.on('scroll', ({ progress }) => {
    bar.style.transform = `scaleX(${progress})`;
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
  const nav = document.getElementById('siteNav');

  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  });

  // Smooth anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      }
    });
  });

  // Nav entrance
  gsap.from('#siteNav', {
    y: -20,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.2,
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle   = document.getElementById('navToggle');
  const menu     = document.getElementById('mobileMenu');
  const links    = menu.querySelectorAll('.mobile-link, .mobile-cta');

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    menu.classList.toggle('is-open', isOpen);
    lenis[isOpen ? 'stop' : 'start']();

    if (isOpen) {
      gsap.from(links, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.15,
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
   HERO — PARTICLE NETWORK CANVAS
   Floating dots + connecting lines: metaphor for ads reaching people
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  // Palette matching beige/green/salmon theme
  const COLOURS = [
    { r: 31,  g: 61,  b: 46  },   // dark green
    { r: 74,  g: 122, b: 96  },   // mid green
    { r: 217, g: 107, b: 82  },   // salmon
    { r: 160, g: 136, b: 112 },   // warm muted
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    const count = Math.floor((W * H) / 14000);   // density scales with area
    particles = Array.from({ length: count }, () => {
      const c = COLOURS[Math.floor(Math.random() * COLOURS.length)];
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r:  Math.random() * 1.8 + 0.8,
        a:  Math.random() * 0.35 + 0.18,
        c,
      };
    });
  }

  const MAX_DIST    = 140;    // connection threshold (px)
  const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions with soft boundary bounce
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    // Draw connection lines first (behind dots)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > MAX_DIST_SQ) continue;

        const alpha = (1 - distSq / MAX_DIST_SQ) * 0.13;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(31,61,46,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // Draw dots on top
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c.r},${p.c.g},${p.c.b},${p.a})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  // Resize observer keeps canvas in sync with its CSS size
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  draw();
}

/* ============================================================
   HERO ENTRANCE ANIMATION — GSAP text reveals
   ============================================================ */
function initHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('.hero-eyebrow', {
    opacity: 1, y: 0,
    duration: 0.7, ease: 'power3.out',
  }, 0.4);

  tl.to('.hero-sub', {
    opacity: 1, y: 0,
    duration: 0.8, ease: 'power3.out',
  }, 0.95);

  tl.to('.hero-ctas', {
    opacity: 1, y: 0,
    duration: 0.8, ease: 'power3.out',
  }, 1.15);

  tl.to('.hero-social-proof', {
    opacity: 1, y: 0,
    duration: 0.7, ease: 'power3.out',
  }, 1.35);

  // Right-side decorative element
  tl.to('.hero-visual', {
    opacity: 1, y: 0,
    duration: 1.0, ease: 'power3.out',
  }, 0.8);

  tl.to('.scroll-indicator', {
    opacity: 1,
    duration: 0.8, ease: 'power2.out',
  }, 1.7);
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCustomCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (window.matchMedia('(hover: none)').matches) return;

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Dot follows exactly
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;

    // Ring follows with lag
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.style.left  = dotX + 'px';
    dot.style.top   = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover state
  const interactives = document.querySelectorAll('a, button, [data-magnetic]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ============================================================
   TEXT SPLIT ANIMATIONS
   ============================================================ */
function initTextAnimations() {
  if (typeof SplitType === 'undefined') {
    // Fallback: simple fade-in
    document.querySelectorAll('[data-split-heading]').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      });
    });
    return;
  }

  document.querySelectorAll('[data-split-heading]').forEach(el => {
    // Skip hero headline (handled separately)
    if (el.closest('#hero')) {
      const split = new SplitType(el, { types: 'lines' });

      gsap.from(split.lines, {
        y: '110%',
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.8,
      });
      return;
    }

    const split = new SplitType(el, { types: 'lines' });

    // Wrap each line in overflow-hidden container
    split.lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.from(split.lines, {
      y: '110%',
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    });
  });
}

/* ============================================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  // Generic [data-reveal] elements
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0) / 1000;

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // Services parallax background
  gsap.to('.services-bg-parallax', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section-services',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  // Numbers parallax
  gsap.to('.numbers-parallax', {
    yPercent: -25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section-numbers',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    },
  });

  // Process line draw
  gsap.to('#processLine', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.process-steps',
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 1,
    },
  });

  // About section entrance
  gsap.from('.about-image-placeholder', {
    opacity: 0,
    x: -60,
    scale: 0.95,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 75%',
    },
  });

  gsap.from('.about-badge', {
    opacity: 0,
    x: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.4,
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 75%',
    },
  });

  // Hero card stat bar fill on scroll
  document.querySelectorAll('.stat-fill').forEach(fill => {
    ScrollTrigger.create({
      trigger: fill,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        fill.style.width = fill.style.getPropertyValue('--fill');
      },
    });
  });
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    let bounds;

    const onEnter = () => {
      bounds = el.getBoundingClientRect();
    };

    const onMove = (e) => {
      if (!bounds) bounds = el.getBoundingClientRect();
      const cx = bounds.left + bounds.width  / 2;
      const cy = bounds.top  + bounds.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;

      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove',  onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

/* ============================================================
   3D CARD TILT
   ============================================================ */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    let bounds;

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!bounds) return;
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const xPct = (x / bounds.width  - 0.5) * 2;
      const yPct = (y / bounds.height - 0.5) * 2;

      gsap.to(card, {
        rotateY:   xPct * 6,
        rotateX:  -yPct * 4,
        duration:  0.4,
        ease:      'power2.out',
        transformPerspective: 800,
        transformOrigin: 'center center',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY:  0,
        rotateX:  0,
        duration: 0.7,
        ease:     'power3.out',
      });
    });
  });
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  document.querySelectorAll('.count-up').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const isFloat = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = isFloat
              ? this.targets()[0].val.toFixed(1)
              : Math.floor(this.targets()[0].val);
          },
          onComplete: () => {
            el.textContent = isFloat ? target.toFixed(1) : target;
          },
        });
      },
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

      // Close all
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================
   GLITCH EFFECT (periodic)
   ============================================================ */
function initGlitchEffect() {
  const glitch = document.querySelector('.glitch');
  if (!glitch) return;

  function triggerGlitch() {
    glitch.classList.add('is-glitching');
    setTimeout(() => glitch.classList.remove('is-glitching'), 350);

    // Schedule next glitch
    setTimeout(triggerGlitch, 3000 + Math.random() * 5000);
  }

  // First glitch after 2 seconds
  setTimeout(triggerGlitch, 2000);
}

/* ============================================================
   CONTACT SECTION PARTICLES (CSS canvas-free)
   ============================================================ */
function initContactParticles() {
  const container = document.getElementById('contactParticles');
  if (!container) return;

  const colors = ['#C4567A', '#D4AA7D', '#E896B0', '#EDD5A8'];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'contact-particle';

    const size  = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left  = Math.random() * 100;
    const dur   = 6 + Math.random() * 8;
    const delay = Math.random() * 8;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      bottom: 0;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      filter: blur(${Math.random() > 0.5 ? 1 : 0}px);
      opacity: 0;
    `;

    container.appendChild(p);
  }
}


/* ============================================================
   SECTION ENTRANCE — Generic observer fallback
   ============================================================ */
// Ensures [data-reveal] elements that ScrollTrigger might miss are handled
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') {
    // If GSAP didn't load, just show everything
    document.querySelectorAll('[data-reveal], [data-split-heading]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});

/* ============================================================
   WINDOW RESIZE
   ============================================================ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});
