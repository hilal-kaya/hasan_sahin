const header = document.querySelector('[data-header]');
const navigation = document.querySelector('#site-navigation');
const menuButton = document.querySelector('.menu-toggle');
const compactHeader = window.matchMedia('(max-width: 1100px)');
const notice = document.querySelector('#preview-notice');
let noticeTimer;

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

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false, true);
  }
});

document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenu(false);
});

header.addEventListener('focusout', event => {
  if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
});

compactHeader.addEventListener('change', syncNavigation);
syncNavigation();

// Future sections remain real anchor destinations. Availability is derived from
// the document, so adding a section enables its links without rewriting the menu.
document.querySelectorAll('[data-section-link]').forEach(link => {
  const destination = document.getElementById(link.hash.slice(1));
  if (destination) {
    link.removeAttribute('aria-disabled');
    link.removeAttribute('title');
  }

  link.addEventListener('click', event => {
    if (destination) {
      setMenu(false);
      return;
    }

    event.preventDefault();
    clearTimeout(noticeTimer);
    notice.textContent = 'Bu bölüm bu önizlemede henüz yer almıyor.';
    notice.dataset.visible = 'true';
    setMenu(false, compactHeader.matches && navigation.contains(link));
    noticeTimer = window.setTimeout(() => {
      notice.dataset.visible = 'false';
      notice.textContent = '';
    }, 5000);
  });
});

document.querySelector('.brand').addEventListener('click', () => setMenu(false));
