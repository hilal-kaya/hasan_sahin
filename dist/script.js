
// IMEP - Robust Navigation & UI Script
const header = document.querySelector('.site-header');
const updateHeaderHeightVar = () => {
  if (header) {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }
};
window.addEventListener('resize', updateHeaderHeightVar, { passive: true });
window.addEventListener('load', updateHeaderHeightVar);
updateHeaderHeightVar();

// --- 1. NAVIGATION & SCROLL SPY ---
const navigation = document.querySelector('#site-navigation');
const menuButton = document.querySelector('.menu-toggle');
const compactHeader = window.matchMedia('(max-width: 1100px)');
const scrollProgressBar = document.querySelector('#scroll-progress');

function updateScrollProgress() {
  if (!scrollProgressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function setMenu(open) {
  if(!menuButton) return;
  menuButton.setAttribute('aria-expanded', String(open));
  if(navigation) navigation.hidden = compactHeader.matches && !open;
}

if(menuButton) {
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
}

const toggleHeaderScrolled = () => {
  if (!header) return;
  if (window.scrollY > 100) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
};

// Map navigation links to sections
const sectionLinks = navigation ? [...navigation.querySelectorAll('[data-section-link]')] : [];
const trackedSections = sectionLinks.map(link => ({
  link,
  section: document.getElementById(link.hash.slice(1))
})).filter(item => item.section);

let isProgrammaticScroll = false;
let scrollTimeout = null;

const updateActiveAndProgress = () => {
  updateScrollProgress();
  toggleHeaderScrolled();
  
  if (isProgrammaticScroll) return; // Wait until programmatic scroll is completely done
  
  if (trackedSections.length > 0) {
    const headerHeight = header ? header.offsetHeight : 88;
    // We add a safety offset (e.g. +140) to guarantee the line is crossed when a section hits its scroll-margin-top
    const scrollReference = window.scrollY + headerHeight + 140; 
    
    let active = null;
    
    // Check if user reached bottom of page
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
      active = trackedSections[trackedSections.length - 1];
    } else {
      // Find the last section that is ABOVE our reference line
      for (let i = 0; i < trackedSections.length; i++) {
        const item = trackedSections[i];
        if (item.section.offsetTop <= scrollReference) {
          active = item;
        } else {
          break; // Since it's sorted, we stop at the first section below the line
        }
      }
    }
    
    // Apply aria-current ONLY to the active link. If active is null (Hero), all get removed.
    trackedSections.forEach(item => {
      if (item === active) {
        item.link.setAttribute('aria-current', 'location');
      } else {
        item.link.removeAttribute('aria-current');
      }
    });
  }
};

// Setup smooth scroll click handler for ALL anchors that point to internal IDs
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    
    event.preventDefault();
    setMenu(false);
    
    // History
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', targetId);
    }
    
    // Find if this target belongs to our tracked sections to immediately set active state
    const matchedTrack = trackedSections.find(t => t.section.id === targetId.slice(1));
    if (matchedTrack) {
      trackedSections.forEach(t => t.link.removeAttribute('aria-current'));
      matchedTrack.link.setAttribute('aria-current', 'location');
    }
    
    isProgrammaticScroll = true;
    
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // CUSTOM COORDINATE SCROLLING:
    // Instead of forcing the section's DOM boundary exactly to the viewport edge,
    // we calculate a natural visual coordinate that leaves ~100px of breathing room
    // below the sticky header. This shows the natural flow from the previous section.
    const headerHeight = header ? header.offsetHeight : 88;
    
    // TARGET PRECISE DOM ELEMENT: find the first eyebrow/kicker or section title
    const eyebrow = targetEl.querySelector('.eyebrow') || targetEl.querySelector('.section-title');
    const scrollTargetEl = eyebrow ? eyebrow : targetEl;
    
    // We scroll so the eyebrow text is exactly below the header, plus a standard 32px breathing room.
    const targetY = scrollTargetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 32;

    
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: prefersReduced ? 'instant' : 'smooth'
    });

    
    if (!targetEl.hasAttribute('tabindex')) {
      targetEl.setAttribute('tabindex', '-1');
    }
    targetEl.focus({ preventScroll: true });
    
    // Reset programmatic flag when scrolling finishes
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isProgrammaticScroll = false;
      updateActiveAndProgress();
    }, prefersReduced ? 100 : 800);
  });
});

let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (!scrollQueued) { 
    scrollQueued = true; 
    requestAnimationFrame(() => {
      updateActiveAndProgress();
      scrollQueued = false;
    });
  }
}, { passive: true });
updateActiveAndProgress();


// --- 2. GLOBAL REVEAL ---
const revealSelectors = [
  '.institution',
  '.intent-row',
  '.about-visual',
  '.biography',
  '.research-area-block',
  '.featured-pub-card',
  '.video-heading',
  '.video-stage',
  '.video-caption',
  '.feature-copy',
  '.feature-photo',
  '.skytr-visual-wrap',
  '.contact-information'
];
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll(revealSelectors.join(', ')).forEach((el, index) => {
  el.setAttribute('data-reveal', 'up');
  revealObserver.observe(el);
});
const lineSelectors = ['.caption-rule', '.hero-baseline'];
document.querySelectorAll(lineSelectors.join(', ')).forEach(el => {
  el.setAttribute('data-reveal', 'line-x');
  revealObserver.observe(el);
});


// --- 3. IDENTITY HIGHLIGHT (Hero) ---
const identities = document.querySelectorAll('.professional-role');
const identityMap = {
  0: ['[href*="sayfam.btu.edu.tr"]', '#akademik-calismalar'], 
  1: ['[href*="bukagem"]', '#bukagem'], 
  2: ['[href*="skytryazilim"]', '#skytr']
};
identities.forEach((el, index) => {
  el.style.cursor = 'pointer'; 
  el.addEventListener('click', () => {
    if (identityMap[index] && identityMap[index][1]) {
      const target = document.querySelector(identityMap[index][1]);
      if (target) {
        document.querySelector(`a[href="${identityMap[index][1]}"]`).click();
      }
    }
  });
});

// --- 4. HERO PARALLAX ---
const heroSection = document.querySelector('.hero');
const portraitFrame = document.querySelector('.portrait-frame');
if (heroSection && portraitFrame && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const xPos = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yPos = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    requestAnimationFrame(() => {
      portraitFrame.style.transform = `translate(${xPos * -6}px, ${yPos * -6}px)`;
    });
  });
  heroSection.addEventListener('mouseleave', () => {
    requestAnimationFrame(() => {
      portraitFrame.style.transform = `translate(0, 0)`;
      portraitFrame.style.transition = 'transform 0.5s ease-out';
    });
  });
  heroSection.addEventListener('mouseenter', () => {
    portraitFrame.style.transition = 'transform 0.1s linear';
  });
}

// --- 5. INTENT ROUTING LOGIC (Restored for Contact Form mapping) ---
const intentLinks = document.querySelectorAll('a[data-route]');
const routeMap = {
  student: { defaultSubject: 'Kariyer ve Mentörlük Talebi' },
  academic: { defaultSubject: 'Akademik İş Birliği' },
  industry: { defaultSubject: 'Üniversite–Sanayi İş Birliği' },
  speaker: { defaultSubject: 'Konuşmacı Daveti' }
};

function applyRouteTailoring(routeKey) {
  const config = routeMap[routeKey];
  if (!config) return;
  const subjEl = document.querySelector('#inquiry-form [name="subject"]');
  if (subjEl && subjEl.dataset.userEdited !== 'true' && !subjEl.value.trim()) {
    subjEl.value = config.defaultSubject;
  }
}

intentLinks.forEach(link => {
  link.addEventListener('click', event => {
    const routeKey = link.dataset.route;
    if (routeKey) {
      applyRouteTailoring(routeKey);
      try { sessionStorage.setItem('hasan_sahin_route', routeKey); } catch {}
    }
  });
});

try {
  const saved = sessionStorage.getItem('hasan_sahin_route');
  if (saved && routeMap[saved]) {
    applyRouteTailoring(saved);
  }
} catch {}
