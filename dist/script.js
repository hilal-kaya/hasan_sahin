'use strict';
const header = document.querySelector('[data-header]');
const navigation = document.querySelector('#site-navigation');
const menuButton = document.querySelector('.menu-toggle');
const compactHeader = window.matchMedia('(max-width: 1100px)');
const notice = document.querySelector('#preview-notice');
const scrollProgressBar = document.querySelector('#scroll-progress');
let noticeTimer;

function announce(message) {
  clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.dataset.visible = 'true';
  noticeTimer = setTimeout(() => {
    notice.dataset.visible = 'false';
    notice.textContent = '';
  }, 5500);
}

/* Scroll progress indicator (1px thin bronze line under sticky header) */
function updateScrollProgress() {
  if (!scrollProgressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  navigation.hidden = compactHeader.matches && !open;
  if (restoreFocus) menuButton.focus();
}

function syncNavigation() {
  menuButton.hidden = !compactHeader.matches;
  setMenu(false);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenu(false);
});
header.addEventListener('focusout', event => {
  if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
});
compactHeader.addEventListener('change', syncNavigation);
syncNavigation();

new ResizeObserver(() => {
  if (menuButton.getAttribute('aria-expanded') !== 'true') {
    document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight}px`);
  }
}).observe(header);

document.querySelectorAll('a[href*="#"]').forEach(link => {
  const url = new URL(link.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setMenu(false);
    history.pushState(null, '', url.href);
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight}px`);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  });
});

const sectionLinks = [...navigation.querySelectorAll('[data-section-link]')];
const trackedSections = sectionLinks.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) })).filter(item => item.section);

const toggleHeaderScrolled = () => {
  if (!header) return;
  if (window.scrollY > 220) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
};

let scrollQueued = false;
const updateActiveAndProgress = () => {
  updateScrollProgress();
  toggleHeaderScrolled();
  if (trackedSections.length > 1) {
    const position = header.offsetHeight + window.innerHeight * .3;
    let active;
    trackedSections.forEach(item => { if (item.section.getBoundingClientRect().top <= position) active = item; });
    trackedSections.forEach(item => {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }
  scrollQueued = false;
};

addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateActiveAndProgress); }
}, { passive: true });
updateActiveAndProgress();

/* "Bilgiden Etkiye" Signature Section: Progressive line reveal on scroll */
const approachTrack = document.querySelector('#approach-track');
if (approachTrack) {
  const steps = [...approachTrack.querySelectorAll('.approach-step')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        approachTrack.classList.add('is-visible');
        steps.forEach((step, i) => {
          setTimeout(() => step.classList.add('is-active'), 120 * (i + 1));
        });
      }
    });
  }, { threshold: 0.2 });
  observer.observe(approachTrack);
}

/* Clipboard Copy Support */
async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    announce(`${label} kopyalandı.`);
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('aria-label', label);
    field.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
    document.body.append(field);
    const previousFocus = document.activeElement;
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Keep manual fallback available. */ }
    field.remove();
    previousFocus?.focus({ preventScroll: true });
    if (copied) announce(`${label} kopyalandı.`);
    else {
      const fallback = document.querySelector('#copy-fallback') || document.body.appendChild(Object.assign(document.createElement('dialog'), { id: 'copy-fallback', className: 'publication-dialog' }));
      fallback.setAttribute('aria-label', `${label} — elle kopyalama`);
      fallback.replaceChildren();
      const wrapper = document.createElement('div');
      wrapper.className = 'dialog-toolbar';
      const instruction = document.createElement('p');
      instruction.textContent = 'Otomatik kopyalama kullanılamıyor. Aşağıdaki metni seçip kopyalayın.';
      const close = document.createElement('button');
      close.className = 'icon-button'; close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', 'Kapat');
      close.addEventListener('click', () => fallback.close());
      wrapper.append(instruction, close);
      const selectable = document.createElement('textarea');
      selectable.value = text; selectable.readOnly = true; selectable.setAttribute('aria-label', label); selectable.rows = 5;
      selectable.style.cssText = 'margin:1rem;padding:1rem;font:inherit';
      fallback.append(wrapper, selectable); fallback.showModal(); selectable.select();
    }
  }
}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => copyText(button.dataset.copy, button.dataset.copyLabel)));

/* Publication Dialog Lightbox */
const publicationDialog = document.querySelector('#publication-dialog');
if (publicationDialog) {
  const covers = [...document.querySelectorAll('[data-publication]')];
  const viewerImage = document.querySelector('#dialog-image');
  let publicationIndex = 0;
  let trigger;
  function showPublication(index) {
    publicationIndex = (index + covers.length) % covers.length;
    const cover = covers[publicationIndex];
    viewerImage.src = cover.href;
    viewerImage.alt = `${cover.dataset.title} — ilk sayfa`;
    document.querySelector('#publication-dialog-title').textContent = cover.dataset.title;
    document.querySelector('#publication-position').textContent = `${publicationIndex + 1} / ${covers.length}`;
    document.querySelector('#publication-original').href = cover.dataset.original;
    document.querySelector('.dialog-image-wrap').scrollTop = 0;
  }
  covers.forEach((cover, index) => cover.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); trigger = cover; showPublication(index); publicationDialog.showModal();
  }));
  publicationDialog.querySelector('[data-dialog-close]').addEventListener('click', () => publicationDialog.close());
  publicationDialog.querySelector('[data-publication-prev]').addEventListener('click', () => showPublication(publicationIndex - 1));
  publicationDialog.querySelector('[data-publication-next]').addEventListener('click', () => showPublication(publicationIndex + 1));
  publicationDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showPublication(publicationIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPublication(publicationIndex - 1); }
  });
  publicationDialog.addEventListener('click', event => {
    if (event.target !== publicationDialog) return;
    const box = publicationDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) publicationDialog.close();
  });
  publicationDialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
}

/* Refined Share Popover */
const shareButton = document.querySelector('#share-button');
const sharePopover = document.querySelector('#share-popover');
if (shareButton && sharePopover) {
  const toggleShare = (open) => {
    const isNowOpen = open !== undefined ? open : sharePopover.hidden;
    sharePopover.hidden = !isNowOpen;
    shareButton.setAttribute('aria-expanded', String(isNowOpen));
  };
  shareButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleShare();
  });
  document.addEventListener('click', (e) => {
    if (!sharePopover.hidden && !sharePopover.contains(e.target) && e.target !== shareButton) {
      toggleShare(false);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sharePopover.hidden) {
      toggleShare(false);
      shareButton.focus();
    }
  });
}

/* Contact Form / Mailto Draft Generator */
const form = document.querySelector('#inquiry-form');
if (form) {
  const panel = document.querySelector('#draft-panel');
  const draft = document.querySelector('#draft-text');
  const draftLink = document.querySelector('#draft-mailto');
  const subjectInput = form.querySelector('[name="subject"]');
  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      subjectInput.dataset.userEdited = 'true';
    });
  }

  form.querySelectorAll('[required]').forEach(input => input.addEventListener('input', () => {
    input.setCustomValidity(input.value && !input.value.trim() ? 'Lütfen bu alanı doldurun.' : '');
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const firstName = String(fields.get('firstName')).trim();
    const lastName = String(fields.get('lastName')).trim();
    const email = String(fields.get('email')).trim();
    const subject = String(fields.get('subject')).trim().replace(/[\r\n]/g, ' ') || 'İletişim / Konuşmacı daveti';
    const message = String(fields.get('message')).trim();
    const body = `Ad Soyad: ${firstName} ${lastName}\nE-posta: ${email}\n\n${message}`;
    draft.value = `Kime: h.sahin@btu.edu.tr\nKonu: ${subject}\n\n${body}`;
    const mailtoUrl = `mailto:h.sahin@btu.edu.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    draftLink.href = mailtoUrl;
    panel.hidden = false;
    document.querySelector('#draft-status').textContent = 'Taslak hazırlandı. E-posta uygulamanızda açabilir veya metni kopyalayabilirsiniz.';
    draftLink.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  form.addEventListener('input', () => {
    panel.hidden = true;
    draft.value = '';
    draftLink.href = 'mailto:h.sahin@btu.edu.tr';
  });
  document.querySelector('#copy-draft').addEventListener('click', () => copyText(draft.value, 'E-posta taslağı'));
}

/* Audience Routing Layer ("Nereden başlamak istersiniz?") */
const intentLinks = document.querySelectorAll('.intent-card');
if (intentLinks.length) {
  const routeMap = {
    student: {
      hash: '#bukagem',
      buttonText: 'Kariyer ve mentörlük için iletişime geç ↗',
      defaultSubject: 'Kariyer ve Mentörlük Talebi',
      ctaSelector: '#bukagem .editorial-link'
    },
    academic: {
      hash: '#akademik-calismalar',
      buttonText: 'Akademik iş birliği için iletişime geç ↗',
      defaultSubject: 'Akademik İş Birliği',
      ctaSelector: '.publications-heading .editorial-link'
    },
    industry: {
      hash: '#skytr',
      buttonText: 'Üniversite–sanayi iş birliği için iletişime geç ↗',
      defaultSubject: 'Üniversite–Sanayi İş Birliği',
      ctaSelector: '#skytr .editorial-link'
    },
    speaker: {
      hash: '#konusmalar',
      buttonText: 'Konuşmacı daveti gönder ↗',
      defaultSubject: 'Konuşmacı Daveti',
      ctaSelector: '.speaker-invite-btn'
    }
  };

  // Aliases for robust backwards compatibility
  routeMap.ogrenci = routeMap.student;
  routeMap.akademik = routeMap.academic;
  routeMap.akademisyen = routeMap.academic;
  routeMap.sanayi = routeMap.industry;
  routeMap.konusmaci = routeMap.speaker;

  function applyRouteTailoring(routeKey) {
    const config = routeMap[routeKey];
    if (!config) return;

    // Never overwrite user-entered text or touched input
    const subjEl = document.querySelector('#inquiry-form [name="subject"]');
    if (subjEl && subjEl.dataset.userEdited !== 'true' && !subjEl.value.trim()) {
      subjEl.value = config.defaultSubject;
    }
    const submitBtn = document.querySelector('#inquiry-form button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = config.buttonText;
    }
  }

  function triggerHighlight(targetEl, config) {
    document.querySelectorAll('.is-context-highlight, .is-cta-highlight').forEach(el => {
      el.classList.remove('is-context-highlight', 'is-cta-highlight');
    });
    targetEl.classList.add('is-context-highlight');
    setTimeout(() => targetEl.classList.remove('is-context-highlight'), 1500);

    if (config && config.ctaSelector) {
      const ctaEl = document.querySelector(config.ctaSelector);
      if (ctaEl) {
        ctaEl.classList.add('is-cta-highlight');
        setTimeout(() => ctaEl.classList.remove('is-cta-highlight'), 1500);
      }
    }
  }

  intentLinks.forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href') || link.dataset.target;
      if (!targetId || !targetId.startsWith('#')) return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      const routeKey = link.dataset.route || link.dataset.intent;
      if (routeKey) {
        applyRouteTailoring(routeKey);
        try {
          sessionStorage.setItem('hasan_sahin_route', routeKey);
        } catch {}
      }

      const config = routeMap[routeKey];
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Update URL hash cleanly so browser back/forward history works naturally
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', targetId);
      } else {
        window.location.hash = targetId;
      }

      // Smoothly scroll to target respecting scroll-margin-top
      targetEl.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth', block: 'start' });

      // Focus for accessibility and screen readers
      if (!targetEl.hasAttribute('tabindex')) {
        targetEl.setAttribute('tabindex', '-1');
      }
      targetEl.focus({ preventScroll: true });

      // Temporary subtle highlight (1200-1600ms)
      triggerHighlight(targetEl, config);

      event.preventDefault();
    });
  });

  try {
    const saved = sessionStorage.getItem('hasan_sahin_route');
    if (saved && routeMap[saved]) {
      applyRouteTailoring(saved);
    }
  } catch {}
}

