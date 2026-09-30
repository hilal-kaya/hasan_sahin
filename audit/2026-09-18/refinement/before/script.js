'use strict';
const header = document.querySelector('[data-header]');
const navigation = document.querySelector('#site-navigation');
const menuButton = document.querySelector('.menu-toggle');
const compactHeader = window.matchMedia('(max-width: 1100px)');
const notice = document.querySelector('#preview-notice');
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
    // Closing the mobile menu changes the header height before anchor placement.
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
if (trackedSections.length > 1) {
  let scrollQueued = false;
  const updateActive = () => {
    const position = header.offsetHeight + window.innerHeight * .3;
    let active;
    trackedSections.forEach(item => { if (item.section.getBoundingClientRect().top <= position) active = item; });
    trackedSections.forEach(item => {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  };
  addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateActive); }
  }, { passive: true });
  updateActive();
}

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
      // A selectable, visible fallback is preferable to reporting a false success.
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

const form = document.querySelector('#inquiry-form');
if (form) {
  const panel = document.querySelector('#draft-panel');
  const draft = document.querySelector('#draft-text');
  const draftLink = document.querySelector('#draft-mailto');
  form.querySelector('[type="submit"]').disabled = false;
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
    draftLink.href = `mailto:h.sahin@btu.edu.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    panel.hidden = false;
    document.querySelector('#draft-status').textContent = 'Taslak hazır. Mesajınız henüz gönderilmedi.';
    draftLink.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  form.addEventListener('input', () => {
    // A stale draft must never be offered after the visitor changes a field.
    panel.hidden = true;
    draft.value = '';
    draftLink.href = 'mailto:h.sahin@btu.edu.tr';
  });
  document.querySelector('#copy-draft').addEventListener('click', () => copyText(draft.value, 'E-posta taslağı'));
}
