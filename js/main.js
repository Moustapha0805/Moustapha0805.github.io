/*
  =============================================================================
  PROJET   : Portfolio Moustapha Gueye — Développeur Web Freelance (Dakar)
  FICHIER  : js/main.js
  RÔLE     : Logique interactive (Thème clair/sombre, menu mobile, défilement fluide, contact)
  AUTEUR   : Moustapha Gueye
  =============================================================================
*/

/**
 * 01. GESTION DU THÈME CLAIR / SOMBRE
 * Sombre par défaut, mémorisé dans localStorage
 */
function initTheme() {
  var savedTheme = localStorage.getItem('portfolio-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || 'dark'; // Mode sombre par défaut

  applyTheme(currentTheme);

  var themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      var active = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = (active === 'dark') ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  var themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    var iconSun = themeToggleBtn.querySelector('.theme-icon-sun');
    var iconMoon = themeToggleBtn.querySelector('.theme-icon-moon');
    if (iconSun && iconMoon) {
      if (theme === 'dark') {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
        themeToggleBtn.setAttribute('aria-label', 'Passer au thème clair');
        themeToggleBtn.setAttribute('title', 'Passer au thème clair');
      } else {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
        themeToggleBtn.setAttribute('aria-label', 'Passer au thème sombre');
        themeToggleBtn.setAttribute('title', 'Passer au thème sombre');
      }
    }
  }
}

/**
 * 02. GESTION DU MENU MOBILE (DRAWER & OVERLAY)
 * Panneau au-dessus de l'overlay, fermeture par croix/overlay/liens, blocage du scroll
 */
function initMobileMenu() {
  var menuBtn    = document.getElementById('menu-toggle');
  var closeBtn   = document.getElementById('drawer-close');
  var drawer     = document.getElementById('nav-drawer');
  var overlay    = document.getElementById('nav-overlay');

  if (!menuBtn || !drawer || !overlay) return;

  function openMenu() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // Toggle avec le bouton hamburger
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (drawer.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Bouton croix dans le drawer
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Clic sur l'overlay sombre
  overlay.addEventListener('click', closeMenu);

  // Clic sur n'importe quel lien du drawer
  drawer.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  // Fermer avec la touche Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
      menuBtn.focus();
    }
  });

  // Fermer si la fenêtre repasse en mode desktop (>= 768px)
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/**
 * 03. NAVBAR SCROLL EFFECT
 */
function initNavbar() {
  var header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });
}

/**
 * 04. DÉFILEMENT FLUIDE AVEC DÉCALAGE DE LA NAVBAR
 */
function initSmoothScroll() {
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    var targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    var headerOffset = 80;
    var top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({ top: top, behavior: 'smooth' });

    if (history.pushState) {
      history.pushState(null, '', targetId);
    }
  });
}

/**
 * 05. FORMULAIRE DE CONTACT DIRECT SUR WHATSAPP & EMAIL
 */
function initContactForm() {
  var form      = document.getElementById('contact-form');
  var statusBox = document.getElementById('form-status');
  if (!form || !statusBox) return;

  function setFieldError(fieldKey, message) {
    var errorSpan = document.getElementById(fieldKey + '-error');
    var input     = document.getElementById('contact-' + fieldKey) || document.getElementById('form-' + fieldKey);
    if (errorSpan) errorSpan.textContent = message;
    if (input)     input.classList.toggle('has-error', Boolean(message));
  }

  function clearErrors() {
    ['name', 'phone', 'message'].forEach(function(key) { setFieldError(key, ''); });
    statusBox.className   = 'form-status';
    statusBox.textContent = '';
  }

  function getFormData() {
    var nameInput    = form.querySelector('[name="name"]');
    var phoneInput   = form.querySelector('[name="phone"]');
    var serviceInput = form.querySelector('[name="service"]') || form.querySelector('[name="project_type"]');
    var messageInput = form.querySelector('[name="message"]');

    var name        = nameInput ? nameInput.value.trim() : '';
    var phone       = phoneInput ? phoneInput.value.trim() : '';
    var service     = serviceInput ? serviceInput.value : 'Site web';
    var message     = messageInput ? messageInput.value.trim() : '';
    var hasError    = false;

    if (!name) {
      setFieldError('name', 'Veuillez renseigner votre prénom ou nom.');
      hasError = true;
    }
    if (!phone) {
      setFieldError('phone', 'Veuillez indiquer un numéro ou un email pour vous joindre.');
      hasError = true;
    }
    if (!message || message.length < 5) {
      setFieldError('message', 'Dites-moi en quelques mots ce dont vous avez besoin.');
      hasError = true;
    }

    if (hasError) return null;
    return { name: name, phone: phone, service: service, message: message };
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();
    var data = getFormData();
    if (!data) return;

    var text = encodeURIComponent(
      'Bonjour Moustapha,\n\n' +
      'Je vous contacte depuis votre portfolio :\n' +
      '• Nom : ' + data.name + '\n' +
      '• Contact : ' + data.phone + '\n' +
      '• Type de projet : ' + data.service + '\n\n' +
      'Message :\n' + data.message
    );
    var url = 'https://wa.me/221774409492?text=' + text;

    statusBox.className = 'form-status is-success';
    statusBox.innerHTML = 'Votre message est prêt ! <a href="' + url + '" target="_blank" rel="noopener noreferrer" style="text-decoration:underline;font-weight:700;color:inherit;">Cliquez ici pour ouvrir WhatsApp</a>.';
    window.open(url, '_blank');
  });
}

/**
 * 06. GESTION DES LIENS DE PROJETS
 */
function initProjectLinks() {
  document.querySelectorAll('.project-link').forEach(function(link) {
    var dataLink = link.getAttribute('data-link');
    if (dataLink !== null) {
      if (dataLink.trim() === '' || dataLink === '#') {
        link.style.display = 'none';
        link.setAttribute('aria-hidden', 'true');
      } else {
        link.setAttribute('href', dataLink);
        link.style.display = 'inline-flex';
        link.removeAttribute('aria-hidden');
      }
    }
  });
}

/**
 * 07. FALLBACK PHOTO
 */
function initImageFallback() {
  document.querySelectorAll('.hero-avatar-img, .photo-img').forEach(function(img) {
    img.addEventListener('error', function() {
      var parent = img.parentElement;
      if (parent) {
        var fallback = parent.querySelector('.photo-fallback');
        if (fallback) fallback.style.display = 'flex';
      }
      img.style.display = 'none';
    });
  });
}

/* =============================================================================
   POINT D'ENTRÉE GLOBAL
   ============================================================================= */
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initMobileMenu();
  initNavbar();
  initSmoothScroll();
  initContactForm();
  initProjectLinks();
  initImageFallback();
});
