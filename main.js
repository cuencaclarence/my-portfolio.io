
const sidebar = document.getElementById('sidebar');
const toggle = document.getElementById('sidebar-toggle');
const links = document.querySelectorAll('.sidebar__link');
const sections = document.querySelectorAll('main section[id]');

// Toggle sidebar (click + keyboard)
if (toggle && sidebar) {
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const icon = toggle.querySelector('i');
    if (icon) icon.classList.toggle('bx-chevron-right');
  });

  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });
}

// Smooth scroll and collapse on small screens
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const target = href && document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // update active immediately
    links.forEach(l => l.classList.remove('active-link'));
    link.classList.add('active-link');

    // auto-collapse on narrow viewports
    if (window.innerWidth < 900 && sidebar) sidebar.classList.add('collapsed');
  });
});

// Use IntersectionObserver for performant active-link updates
if (sections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector('.sidebar__link[href="#' + id + '"]');
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active-link'));
        link && link.classList.add('active-link');
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.15
  });

  sections.forEach(sec => observer.observe(sec));
} else {
  // Fallback: simple scroll handler
  const onScroll = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector('.sidebar__link[href="#' + id + '"]');
      if (scrollY >= top && scrollY < top + height) {
        link && link.classList.add('active-link');
      } else {
        link && link.classList.remove('active-link');
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Optional: initialize ScrollReveal if available (graceful)
if (window.ScrollReveal) {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '40px',
    duration: 900,
    delay: 150,
    // reset: true
  });

  sr.reveal('.home__data, .about__img, .skills__container, .project-card, .contact-cards', { interval: 120 });
  sr.reveal('.home__img, .about__subtitle, .about__text', { delay: 300 });
  sr.reveal('.home__social-icon', { interval: 180 });
}
