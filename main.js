/*
  =============================================================================
  PROJET   : Portfolio Moustapha Gueye — Étudiant en développement web (Dakar)
  FICHIER  : js/main.js
  RÔLE     : Logique interactive sans dépendance externe
  AUTEUR   : Moustapha Gueye
  =============================================================================
*/

/**
 * 01. GESTION DE LA NAVBAR AU DÉFILEMENT
 */
function initNavbar() {
  var header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });
}

/**
 * 02. DÉFILEMENT FLUIDE AVEC DÉCALAGE DE LA NAVBAR
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

    var headerOffset = 72;
    var top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({ top: top, behavior: 'smooth' });

    if (history.pushState) {
      history.pushState(null, '', targetId);
    }
  });
}

/**
 * 03. TRANSMISSION DIRECTE SUR WHATSAPP & EMAIL
 */
function initContactForm() {
  var form      = document.getElementById('contact-form');
  var statusBox = document.getElementById('form-status');
  var emailBtn  = document.getElementById('form-submit-email');
  if (!form || !statusBox) return;

  function setFieldError(id, message) {
    var errorSpan = document.getElementById(id + '-error');
    var input     = document.getElementById('form-' + id);
    if (errorSpan) errorSpan.textContent = message;
    if (input)     input.classList.toggle('has-error', Boolean(message));
  }

  function clearErrors() {
    ['name', 'phone', 'message'].forEach(function(id) { setFieldError(id, ''); });
    statusBox.className   = 'form-status';
    statusBox.textContent = '';
  }

  function getFormData() {
    var name        = form.name.value.trim();
    var phone       = form.phone.value.trim();
    var projectType = form.project_type.value;
    var budget      = form.budget.value;
    var message     = form.message.value.trim();
    var hasError    = false;

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
    return { name: name, phone: phone, projectType: projectType, budget: budget, message: message };
  }

  // Envoi WhatsApp
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();
    var data = getFormData();
    if (!data) return;

    var text = encodeURIComponent(
      '*Demande de projet web — Portfolio*\n' +
      '👤 *Nom :* ' + data.name + '\n' +
      '📱 *Téléphone :* ' + data.phone + '\n' +
      '💼 *Type de projet :* ' + data.projectType + '\n' +
      '💰 *Budget indicatif :* ' + data.budget + '\n\n' +
      '📝 *Description du besoin :*\n' + data.message
    );
    var url = 'https://wa.me/221774409492?text=' + text;

    statusBox.className = 'form-status is-success';
    statusBox.innerHTML = 'Votre demande est prête sur WhatsApp ! <a href="' + url + '" target="_blank" rel="noopener noreferrer" style="text-decoration:underline;font-weight:600;color:inherit;">Cliquez ici si WhatsApp ne s\'ouvre pas automatiquement</a>.';
    window.open(url, '_blank');
  });

  // Alternative email
  if (emailBtn) {
    emailBtn.addEventListener('click', function() {
      clearErrors();
      var data = getFormData();
      if (!data) return;

      var subject = encodeURIComponent('Nouveau projet web : ' + data.projectType + ' — ' + data.name);
      var body    = encodeURIComponent(
        'Bonjour Moustapha,\n\n' +
        'Je vous contacte concernant un projet web :\n\n' +
        '• Nom : ' + data.name + '\n' +
        '• Téléphone / WhatsApp : ' + data.phone + '\n' +
        '• Type de projet : ' + data.projectType + '\n' +
        '• Budget indicatif : ' + data.budget + '\n\n' +
        '• Description du besoin :\n' + data.message + '\n\n' +
        '---\nMessage envoyé depuis votre portfolio.'
      );
      var mailto = 'mailto:gmoustapha0805@gmail.com?subject=' + subject + '&body=' + body;

      statusBox.className = 'form-status is-success';
      statusBox.innerHTML = 'Ouverture de votre messagerie... <a href="' + mailto + '" style="text-decoration:underline;font-weight:600;color:inherit;">Cliquez ici si rien ne s\'affiche</a>.';
      window.location.href = mailto;
    });
  }
}

/**
 * 04. GESTION DES LIENS DE PROJETS CONDITIONNELS
 */
function initProjectLinks() {
  document.querySelectorAll('.project-link').forEach(function(link) {
    var rawLink = link.getAttribute('data-link');
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
 * 05. FALLBACK SI LA PHOTO EST ABSENTE
 */
function initImageFallback() {
  document.querySelectorAll('.photo-frame .photo-img').forEach(function(img) {
    img.addEventListener('error', function() {
      img.style.display = 'none';
    });
  });
}

/* =============================================================================
   POINT D'ENTRÉE
   ============================================================================= */
document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initSmoothScroll();
  initContactForm();
  initProjectLinks();
  initImageFallback();
});
