/* =====================================================
   MARIEMA DIOP — PORTFOLIO PERSONNEL
   script.js — JavaScript principal
   ===================================================== */

'use strict';

/* ─── Utilitaires ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =====================================================
   NAVIGATION — sticky + hamburger + active links
   ===================================================== */
(function initNav() {
  const navbar     = $('#navbar');
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const navLinks   = $$('.nav-link');
  const mobileLinks = $$('.mobile-link');

  /* Sticky nav au scroll */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
    toggleBackToTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // état initial

  /* Hamburger */
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  /* Fermer menu mobile au clic sur un lien */
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Fermer menu mobile en cliquant dehors */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  /* Lien actif selon section visible */
  const sections = $$('section[id], #accueil');

  function updateActiveLink() {
    let currentId = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) currentId = section.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }
})();

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#[Ajouter lien LinkedIn]' ||
          targetId === '#[Ajouter lien GitHub]' || targetId === '#[Ajouter lien du projet]' ||
          targetId === '#[Lien vers CV]') return;

      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* =====================================================
   SCROLL REVEAL — IntersectionObserver
   ===================================================== */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animation une seule fois
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* =====================================================
   BOUTON RETOUR EN HAUT
   ===================================================== */
const backToTop = $('#back-to-top');

function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =====================================================
   FORMULAIRE DE CONTACT
   ===================================================== */
(function initForm() {
  const form     = $('#contact-form');
  const success  = $('#form-success');
  const resetBtn = $('#form-reset');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validation simple
    const fields = $$('[required]', form);
    let valid = true;
    fields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e05a7a';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) return;

    // Simuler envoi — afficher succès
    form.style.display = 'none';
    success.classList.add('show');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      success.classList.remove('show');
    });
  }
})();

/* =====================================================
   FILTRE PROJETS
   ===================================================== */
(function initProjectFilter() {
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const show = filter === 'tous' || card.dataset.category.includes(filter);
        card.style.display = show ? '' : 'none';
        card.style.opacity = show ? '1' : '0';
      });
    });
  });
})();

/* =====================================================
   IMAGES — placeholder si image absente
   ===================================================== */
(function initImageFallbacks() {
  $$('img[data-placeholder]').forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = img.nextElementSibling;
      img.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    });
  });
})();

/* =====================================================
   ANNÉE FOOTER (mise à jour automatique)
   ===================================================== */
(function updateYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();
