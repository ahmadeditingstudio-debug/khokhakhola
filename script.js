/* ============================================
   KHOKA KHOLA — FULL SCRIPT
   ============================================ */

(function () {

  /* ══════════════════════════════════════════
     NAVBAR — scroll glass effect
  ══════════════════════════════════════════ */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks   = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  let ticking = false;

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ══════════════════════════════════════════
     HAMBURGER — open / close
  ══════════════════════════════════════════ */
  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (hamburger.classList.contains('open') && !navbar.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMenu();
  });

  /* ── Active link on click ── */
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      mobileLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ══════════════════════════════════════════
     SCROLL ANIMATIONS
     — IntersectionObserver, threshold 0.15
     — Resets every time element leaves viewport
       (no "once" behaviour)
  ══════════════════════════════════════════ */

  // Selectors that get animated
  const ANIM_SELECTORS = [
    '.animate-heading',
    '.animate-card',
    '.animate-left',
    '.animate-right',
    '.animate-stat',
    '.animate-btn',
  ].join(', ');

  const animEls = document.querySelectorAll(ANIM_SELECTORS);

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Trigger count-up when stat enters view
          if (entry.target.classList.contains('animate-stat')) {
            triggerCountUp(entry.target);
          }
        } else {
          // Remove class → element resets for next scroll-in
          entry.target.classList.remove('in-view');
          // Reset stat number so it can count again
          if (entry.target.classList.contains('animate-stat')) {
            const numEl = entry.target.querySelector('.stat-number');
            if (numEl) numEl.textContent = '0';
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  animEls.forEach(el => scrollObserver.observe(el));

  /* ══════════════════════════════════════════
     COUNT-UP ANIMATION
     data-target on .stat-number
  ══════════════════════════════════════════ */

  function triggerCountUp(statBox) {
    const numEl = statBox.querySelector('.stat-number');
    if (!numEl) return;

    const target  = parseFloat(numEl.dataset.target);
    const isFloat = target % 1 !== 0;
    const duration = 1200; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;

      numEl.textContent = isFloat
        ? current.toFixed(1)
        : Math.floor(current).toString();

      if (progress < 1) requestAnimationFrame(step);
      else numEl.textContent = isFloat ? target.toFixed(1) : target.toString();
    }

    requestAnimationFrame(step);
  }

})();
