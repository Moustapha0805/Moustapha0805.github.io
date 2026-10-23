/*
  =============================================================================
  PROJET   : Portfolio Moustapha Gueye — Développeur Web Freelance (Dakar)
  FICHIER  : js/main.js
  RÔLE     : Logique interactive sans dépendance externe
  AUTEUR   : Moustapha Gueye
  =============================================================================
*/

/**
 * 01. GESTION DE LA NAVBAR AU DÉFILEMENT
 * Ajoute un fond opaque et une bordure fine dès que la page défile pour préserver
 * la lisibilité des liens au-dessus des sections de contenu.
 */
function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  // Écoute passive pour ne pas dégrader les performances de défilement
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 02. MENU MOBILE RESPONSIVE
 * Contrôle l'ouverture et la fermeture du panneau de navigation sur petit écran,
 * tout en maintenant l'état accessible (aria-expanded) pour les lecteurs d'écran.
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : toggleBtn.getAttribute('aria-expanded') !== 'true';
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    navMenu.classList.toggle('is-open', isOpen);
    // Empêche le défilement de l'arrière-plan quand le menu est déplié
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Fermeture automatique lors du clic sur un lien du menu
  navMenu.querySelectorAll('.nav-link, .nav-cta').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        toggleMenu(false);
      }
    });
  });

  // Fermeture par la touche Échap
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });
}

/**
 * 03. APPARITION AU DÉFILEMENT (SCROLL REVEAL)
 * Utilise IntersectionObserver pour révéler les blocs de manière fluide.
 * Désactivé automatiquement si l'utilisateur a configuré son système sur 'prefers-reduced-motion'.
 */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elementsToReveal = document.querySelectorAll(
    '.project-card, .service-card, .process-step, .pricing-card, .channel-card, .about-layout'
  );

  if (prefersReduced || !('IntersectionObserver' in window)) {
    // Rendu immédiat sans animation si restriction d'accessibilité ou navigateur ancien
    elementsToReveal.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  elementsToReveal.forEach((el) => el.classList.add('reveal-item'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target); // Libère l'observation dès que l'élément est visible
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elementsToReveal.forEach((el) => observer.observe(el));
}

/**
 * 04. TRANSMISSION DIRECTE SUR WHATSAPP & EMAIL (SANS SAISIE D'EMAIL)
 * Valide les informations essentielles (nom, numéro, projet, message) et génère
 * un message formaté avec soin transmis directement vers WhatsApp ou client mail.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  const emailBtn = document.getElementById('form-submit-email');
  if (!form || !statusBox) return;

  const setFieldError = (id, message) => {
    const errorSpan = document.getElementById(`${id}-error`);
    const input = document.getElementById(`form-${id}`);
    if (errorSpan) errorSpan.textContent = message;
    if (input) input.classList.toggle('has-error', Boolean(message));
  };

  const clearErrors = () => {
    ['name', 'phone', 'message'].forEach((id) => setFieldError(id, ''));
    statusBox.className = 'form-status';
    statusBox.textContent = '';
  };

  const getFormData = () => {
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const projectType = form.project_type.value;
    const budget = form.budget.value;
    const message = form.message.value.trim();

    let hasError = false;

    if (!name) {
      setFieldError('name', 'Veuillez renseigner votre nom.');
      hasError = true;
    }

    if (!phone) {
      setFieldError('phone', 'Veuillez indiquer votre numéro WhatsApp ou téléphone.');
      hasError = true;
    }

    if (!message || message.length < 10) {
      setFieldError('message', 'Merci de décrire votre projet en quelques mots (au moins 10 caractères).');
      hasError = true;
    }

    if (hasError) return null;

    return { name, phone, projectType, budget, message };
  };

  // Envoi WhatsApp principal
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const data = getFormData();
    if (!data) return;

    const whatsappMessage = `*Demande de projet web — Portfolio*
👤 *Nom :* ${data.name}
📱 *Téléphone :* ${data.phone}
💼 *Type de projet :* ${data.projectType}
💰 *Budget indicatif :* ${data.budget}

📝 *Description du besoin :*
${data.message}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/221774409492?text=${encodedMessage}`;

    statusBox.className = 'form-status is-success';
    statusBox.innerHTML = `Votre demande est prête sur WhatsApp ! <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline; font-weight:600; color:inherit;">Cliquez ici si WhatsApp ne s'ouvre pas automatiquement</a>.`;

    // Ouverture de WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  });

  // Alternative Email classique
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      clearErrors();
      const data = getFormData();
      if (!data) return;

      const emailSubject = `Nouveau projet web : ${data.projectType} — ${data.name}`;
      const emailBody = `Bonjour Moustapha,

Je vous contacte concernant un projet web avec les détails suivants :

• Nom : ${data.name}
• Numéro de téléphone / WhatsApp : ${data.phone}
• Type de projet : ${data.projectType}
• Budget indicatif : ${data.budget}

• Description du besoin :
${data.message}

---
Message envoyé depuis votre portfolio.`;

      const mailtoUrl = `mailto:gmoustapha0805@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      statusBox.className = 'form-status is-success';
      statusBox.innerHTML = `Ouverture de votre messagerie en cours... Si rien ne s'affiche, <a href="${mailtoUrl}" style="text-decoration:underline; font-weight:600; color:inherit;">cliquez ici pour ouvrir le message</a>.`;

      window.location.href = mailtoUrl;
    });
  }
}

/**
 * 05. DÉFILEMENT FLUIDE AVEC DÉCALAGE DE LA NAVBAR
 * Corrige l'ancrage des liens pour éviter que la barre de navigation fixe
 * ne recouvre les titres des sections.
 */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70; // Hauteur approximative du header fixe
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Met à jour l'URL sans saut brutal
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });
}

/**
 * 06. GESTION DES LIENS DE PROJETS CONDITIONNELS
 * Masque ou désactive le bouton "Voir le projet" si aucun lien réel n'est renseigné
 * dans l'attribut data-link, respectant la consigne d'absence de maquettes factices.
 */
function initProjectLinks() {
  const projectLinks = document.querySelectorAll('.project-link');

  projectLinks.forEach((link) => {
    const rawLink = link.getAttribute('data-link');
    if (!rawLink || rawLink.trim() === '' || rawLink === '#') {
      link.style.display = 'none';
      link.setAttribute('aria-hidden', 'true');
    } else {
      link.setAttribute('href', rawLink);
      link.style.display = 'inline-flex';
      link.removeAttribute('aria-hidden');
    }
  });
}

/**
 * 07. FALLBACK ÉLÉGANT SI LA PHOTO EST ABSENTE
 * Masque la balise image si moustapha.jpg n'existe pas encore sur le serveur,
 * laissant apparaître le monogramme typographique 'MG' en serif en arrière-plan.
 */
function initImageFallback() {
  const portraitImages = document.querySelectorAll('.photo-frame .photo-img');

  portraitImages.forEach((img) => {
    // Si l'image échoue au chargement (fichier non encore copié par l'utilisateur)
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });
}

/* =============================================================================
   POINT D'ENTRÉE UNIQUE AU CHARGEMENT DU DOM
   ============================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initContactForm();
  initSmoothScroll();
  initProjectLinks();
  initImageFallback();
});
